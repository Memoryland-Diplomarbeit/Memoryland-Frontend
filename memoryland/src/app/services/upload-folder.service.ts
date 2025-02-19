import {inject, Injectable} from '@angular/core';
import {MemoryStoreService} from './memory-store.service';
import {set, store, UploadPhotoModel} from '../model';
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
    this.toastSvc.addToast(
      'Upload gestartet...',
      'Der Upload der Fotos wurde gestartet! Bitte warten Sie, bis der Upload abgeschlossen ist und verlassen und reloaden Sie nicht die Website.',
      'info'
    );

    set(model => {
      model.totalPhotos = store.value.uploadAlbumModel.files.length;
      model.finishedPhotos = 0;
    });

    if (store.value.uploadAlbumModel.useTransaction && !store.value.useResumableUpload) {
      this.webApi.postTransaction(() => {
        this.uploadAlbum().then(() => {
          this.finishUploadAlbum();
        });
      });
    } else {
      this.uploadAlbum().then(() => {
        this.finishUploadAlbum();
      });
    }
  }

  private finishUploadAlbum() {
    this.webApi.getPhotoAlbumsFromServer();
    this.webApi.removeTransaction();

    set(model => {
      model.useResumableUpload = false;
      model.uploadAlbumModel.useTransaction = false;
    });
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

        set(model => {
          model.finishedPhotos++;
        });
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

    set(model => {
      model.totalPhotos = 0;
      model.finishedPhotos = 0;
    });
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
