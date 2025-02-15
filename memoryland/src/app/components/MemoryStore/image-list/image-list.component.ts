import {Component, inject} from '@angular/core';
import {Memoryland, Photo, set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {HoverClassDirective} from '../../../directives/hover-class.directive';
import {WebapiService} from '../../../services/webapi.service';

@Component({
  selector: 'app-image-list',
  imports: [
    AsyncPipe,
    HoverClassDirective
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.scss'
})
export class ImageListComponent {
  protected images = store.pipe(
    map(model => model.selectedPhotoAlbum?.photos),
    distinctUntilChanged()
  );

  private readonly webApi = inject(WebapiService);

  protected readonly selectedPhoto = store
    .pipe(
      map(model => model.photoViewerPhoto),
      distinctUntilChanged()
    );

  deleteImage(photo: Photo) {
    this.webApi.deletePhoto(photo.id);
  }

  selectImage(i: Photo) {
    if (store.value.photoViewerPhoto !== undefined)
      this.unsetImage()

    if (store.value.selectedPhotoAlbum !== undefined) {
      this.webApi.getSelectedPhoto(
        store.value.selectedPhotoAlbum!.id,
        i.name
      );
    }
  }

  private unsetImage() {
    set(model => {
      model.photoViewerPhoto = undefined;
    });
  }

  renamePhotoNotValid() {
    return store.value.renamePhoto.name === "" ||
      store.value.renamePhoto.renameObj === undefined
  }

  setRenamePhoto(p: Photo) {
    set(model => {
      model.renamePhoto.renameObj = p;
      model.renamePhoto.name = p.name;
    });
  }

  setPhotoName(val: string) {
    set(model => {
      model.renamePhoto.name = val;
    });
  }

  renamePhoto() {
    let renamePhoto = store.value.renamePhoto;

    if (!this.renamePhotoNotValid()) {
      this.webApi.renamePhoto(
        renamePhoto.renameObj!.id,
        renamePhoto.name
      );
    }
  }

  protected readonly store = store;
}
