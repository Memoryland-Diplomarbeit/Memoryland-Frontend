import { Component } from '@angular/core';

@Component({
  selector: 'app-image-list',
  imports: [],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {

  deleteImage() {

  }

  protected images = [...Array(100).keys()];
}
