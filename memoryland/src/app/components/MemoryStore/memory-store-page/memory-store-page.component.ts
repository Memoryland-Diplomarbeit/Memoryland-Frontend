import { Component } from '@angular/core';
import {FolderListComponent} from '../folder-list/folder-list.component';
import {ImageListComponent} from '../image-list/image-list.component';

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

  protected createAlbum() {

  }

  protected uploadPhoto() {

  }

  protected uploadAlbum() {

  }
}
