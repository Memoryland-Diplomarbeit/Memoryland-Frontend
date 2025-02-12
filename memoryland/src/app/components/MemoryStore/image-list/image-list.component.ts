import {Component, inject} from '@angular/core';
import {Photo, set, store} from '../../../model';
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

  deleteImage() {

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
}
