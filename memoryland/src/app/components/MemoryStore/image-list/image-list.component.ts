import {Component, inject} from '@angular/core';
import {Memoryland, Photo, set, store} from '../../../model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
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
  constructor() {
    store.pipe(
      map(model =>
        model.selectedPhotoAlbum?.photos
          .filter(photo => photo.name
            .includes(model.searchImgList))),
      distinctUntilChanged(),
      debounceTime(5000)
    ).subscribe(images => {
      if (images && store.value.selectedPhotoAlbum !== undefined) {
        let filteredImages = images
          .filter(image => image.image === undefined);

        if (filteredImages.length > 0) {
          this.webApi.generatePreviewsByAlbum(
            store.value.selectedPhotoAlbum.id
          );
        }
      }
    });
  }

  protected images = store.pipe(
    map(model =>
      model.selectedPhotoAlbum?.photos
        .filter(photo => photo.name
          .includes(model.searchImgList))),
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

  setImgSearch(val: string) {
    set(model => {
      model.searchImgList = val;
    });
  }

  protected readonly store = store;
}
