import { Component } from '@angular/core';

@Component({
  selector: 'app-folder-list',
  imports: [],
  templateUrl: './folder-list.component.html',
  styleUrl: './folder-list.component.css'
})
export class FolderListComponent {

  deleteAlbum() {

  }

  protected folders = [...Array(100).keys()];
}
