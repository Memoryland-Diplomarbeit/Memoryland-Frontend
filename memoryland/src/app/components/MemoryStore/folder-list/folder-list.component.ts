import {Component, inject} from '@angular/core';
import {Photo, PhotoAlbum, set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {HoverClassDirective} from '../../../directives/hover-class.directive';
import {WebapiService} from '../../../services/webapi.service';

@Component({
  selector: 'app-folder-list',
  imports: [
    AsyncPipe,
    HoverClassDirective
  ],
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.scss'
})
export class FolderListComponent {
  private webApi = inject(WebapiService);

  deleteAlbum(photoAlbum: PhotoAlbum) {
    this.webApi.deletePhotoAlbum(photoAlbum.id);
  }

  protected folders = store.pipe(
    map(model => model.photoAlbums),
    distinctUntilChanged()
  );

  selectAlbum(p: PhotoAlbum) {
    set(model => {
      model.selectedPhotoAlbum = p;
    });
  }

  renamePhotoAlbumNotValid() {
    return store.value.renamePhotoAlbum.name === "" ||
      store.value.renamePhotoAlbum.renameObj === undefined
  }

  setRenamePhotoAlbum(p: PhotoAlbum) {
    set(model => {
      model.renamePhotoAlbum.renameObj = p;
      model.renamePhotoAlbum.name = p.name;
    });
  }

  setPhotoAlbumName(val: string) {
    set(model => {
      model.renamePhotoAlbum.name = val;
    });
  }

  renamePhotoAlbum() {
    let renamePhotoAlbum = store.value.renamePhotoAlbum;

    if (!this.renamePhotoAlbumNotValid()) {
      this.webApi.renamePhotoAlbum(
        renamePhotoAlbum.renameObj!.id,
        renamePhotoAlbum.name
      );
    }
  }

  protected readonly store = store;
}
