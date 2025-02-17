import {inject, Injectable} from '@angular/core';
import {MemoryStoreService} from './memory-store.service';
import {store, UploadPhotoModel} from '../model';
import {WebapiService} from './webapi.service';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFolderService {
  public readonly allowedExtensions = [
    'png',
    'jpg',
    'jpeg'
  ];
  private webApi = inject(WebapiService);
  private toastSvc = inject(ToastService);
  private memoryStoreSvc = inject(MemoryStoreService);

  startUploadAlbum() {
    if (store.value.uploadAlbumModel.useTransaction) {
      this.webApi.postTransaction(() => {
        this.uploadAlbum().then(() => {
          this.webApi.getPhotoAlbumsFromServer();
          this.webApi.removeTransaction();
        });
      });
    } else {
      this.uploadAlbum().then(() => {
        this.webApi.getPhotoAlbumsFromServer();
        this.webApi.removeTransaction();
      });
    }
  }

  async uploadAlbum() {
    const selectedAlbum = store.value
      .uploadAlbumModel
      .selectedAlbumId;

    const uploadPhotoModels = store.value
      .uploadAlbumModel
      .files
      .map(f => {
        const uploadPhotoModel: UploadPhotoModel = {
          fileName: f.name,
          selectedAlbumId: selectedAlbum,
          file: f
        };

        return uploadPhotoModel;
      });

    const errors: string[] = [];
    let successCount = 0;

    for (const uploadPhotoModel of uploadPhotoModels) {
      if (!this.memoryStoreSvc.uploadPhotoNotValid(uploadPhotoModel)) {
        try {
          await this.uploadPhoto(uploadPhotoModel);
          successCount++;
        } catch (err) {
          // @ts-ignore
          errors.push(`<br><b>Fehler bei ${uploadPhotoModel.fileName}:</b><br>${err?.message}: ${err?.error}`);
        }
      }
    }

    if (errors.length === 0) {
      this.toastSvc.addToast(
        'Alle Fotos hochgeladen!',
        `Alle ${successCount} Fotos wurden erfolgreich hochgeladen!`,
        'success'
      );
    } else {
      this.toastSvc.addToast(
        'Fehler beim Hochladen!',
        `Erfolgreich: ${successCount} | Fehlgeschlagen: ${errors.length}<br>` +
        errors.join('<br>'),
        'error'
      );
    }
  }

  private uploadPhoto(uploadPhotoModel: UploadPhotoModel): Promise<void> {
    return new Promise((
      resolve,
      reject) => {
      const formData = new FormData();

      formData.append(
        'FileName',
        uploadPhotoModel.fileName
      );

      formData.append(
        'PhotoAlbumId',
        uploadPhotoModel.selectedAlbumId!.toString()
      );

      formData.append(
        'Photo',
        uploadPhotoModel.file!
      );

      this.webApi.uploadPhoto(formData).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }


}
