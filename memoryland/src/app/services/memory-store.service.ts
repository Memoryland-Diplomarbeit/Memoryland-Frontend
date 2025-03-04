import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {set, store, UploadPhotoModel} from '../model';
import {WebapiService} from './webapi.service';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class MemoryStoreService {
  protected readonly webApi = inject(WebapiService);
  protected readonly toastSvc = inject(ToastService);
  protected readonly reservedChars: string = '!*\'();:@&=+$,/?#[]';

  createAlbum() {
    if (!this.albumNameNotValid()) {
      this.webApi.createPhotoAlbum(store.value.createAlbumName)
        .subscribe({
          "next": (obj) => {
            this.toastSvc.addToast(
              'Album erstellt!',
              `Das Album ${store.value.createAlbumName} wurde erfolgreich erstellt!`,
              'success'
            );

            set(model => {
              model.createAlbumName = '';
            });

            this.webApi.getPhotoAlbumsFromServer();
          },
          "error": (err: HttpErrorResponse) => {
            this.toastSvc.addToast(
              'Fehler beim erstellen des Albums!',
              err.message + ":\n" + err.error,
              'error'
            );
          },
        });
    }
  }

  uploadPhoto() {
    if (!this.uploadPhotoNotValid(undefined)) {
      const uploadPhotoModel = store
        .value
        .uploadPhotoModel;

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
        next: () => {
          this.toastSvc.addToast(
            'Foto hochgeladen!',
            `Das Foto ${uploadPhotoModel.fileName} wurde erfolgreich hochgeladen!`,
            'success'
          );
          this.webApi.getPhotoAlbumsFromServer();
        },
        error: (err) => {
          this.toastSvc.addToast(
            'Fehler beim hochladen des Fotos!',
            err.message + ":\n" + err.error,
            'error'
          );
        }
      });
    }
  }

  albumNameNotValid(): boolean {
    return store.value.createAlbumName === '' ||
      store.value.createAlbumName.length > 1024 ||
      this.containsAnyCharRegex(
        store.value.createAlbumName,
        this.reservedChars);
  }

  containsAnyCharRegex(source: string, chars: string): boolean {
    return chars
      .split('')
      .some(char => source.includes(char));
  }

  uploadPhotoNotValid(model: UploadPhotoModel | undefined) {
    if (model === undefined) {
      return store.value.uploadPhotoModel.fileName === '' ||
        store.value.uploadPhotoModel.selectedAlbumId === undefined ||
        store.value.photoAlbums.filter(pa =>
          pa.id === store.value.uploadPhotoModel.selectedAlbumId)
          .length === 0 ||
        store.value.uploadPhotoModel.file === undefined;
    } else {
      return model.fileName === '' ||
        model.selectedAlbumId === undefined ||
        store.value.photoAlbums.filter(pa =>
          pa.id === model.selectedAlbumId).length === 0 ||
        model.file === undefined;
    }
  }
}
