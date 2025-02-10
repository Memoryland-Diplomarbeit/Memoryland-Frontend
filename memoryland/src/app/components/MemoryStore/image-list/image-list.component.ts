import { Component } from '@angular/core';
import {store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-image-list',
  imports: [
    AsyncPipe
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {

  deleteImage() {

  }

  protected images = store.pipe(
    map(model => model.selectedPhotoAlbum?.photos),
    distinctUntilChanged()
  );
}
