import {inject, Injectable} from '@angular/core';
import {WebApiService} from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private webApi = inject(WebApiService);

  public submitPhoto(
    fileName: string,
    photoAlbumId: number,
    photo: File) {
    const formData = new FormData();
    formData.append('FileName', fileName);
    formData.append('PhotoAlbumId', photoAlbumId.toString());
    formData.append('Photo', photo);

    this.webApi.uploadPhoto(formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
      },
      error: (error) => console.error('Upload failed:', error),
    });
  }
}
