import { Component } from '@angular/core';
import {store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-folder-list',
  imports: [
    AsyncPipe
  ],
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.css'
})
export class FolderListComponent {

  deleteAlbum() {

  }

  protected folders = store.pipe(
    map(model => model.photoAlbums),
    distinctUntilChanged()
  );
}
