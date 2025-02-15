import {Component, inject} from '@angular/core';
import {PhotoAlbum, set, store} from '../../../model';
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

  selectAlbum(f: PhotoAlbum) {
    set(model => {
      model.selectedPhotoAlbum = f;
    });
  }

  protected readonly store = store;
}
