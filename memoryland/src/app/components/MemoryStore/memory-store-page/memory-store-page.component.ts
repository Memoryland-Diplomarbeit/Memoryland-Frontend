import {Component, inject} from '@angular/core';
import {FolderListComponent} from '../folder-list/folder-list.component';
import {ImageListComponent} from '../image-list/image-list.component';
import {set, store} from '../../../model';
import {WebapiService} from '../../../services/webapi.service';
import {ToastService} from '../../../services/toast.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-memory-store-page',
  imports: [
    FolderListComponent,
    ImageListComponent
  ],
  templateUrl: './memory-store-page.component.html',
  styleUrl: './memory-store-page.component.css'
})
export class MemoryStorePageComponent {
  protected readonly webApi = inject(WebapiService);
  protected readonly toastSvc = inject(ToastService);
  protected readonly reservedChars: string = '!*\'();:@&=+$,/?#[]';

  protected createAlbum() {
    if (!this.albumNameNotValid()) {
      this.webApi.createPhotoAlbum(store.value.createAlbumName)
        .subscribe({
          "next": (obj) => {
            this.toastSvc.addToast(
              'Album erstellt!',
              `Das Album ${store.value.createAlbumName} wurde erfolgreich erstellt!`,
              'success'
            );
            this.setAlbumName('');
            this.webApi.getPhotoAlbumsFromServer();
          },
          "error": (err: HttpErrorResponse) => {
            this.toastSvc.addToast(
              'Fehler beim erstellen des Albums!',
              err.error,
              'error'
            );
          },
        });
    }
  }

  protected uploadPhoto() {

  }

  protected uploadAlbum() {

  }

  setAlbumName(val: string) {
    set(model => {
      model.createAlbumName = val;
    });
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

  protected readonly store = store;
}
