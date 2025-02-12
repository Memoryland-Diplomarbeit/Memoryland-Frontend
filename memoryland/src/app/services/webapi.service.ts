import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PhotoAlbum, SelectedPhoto} from '../model';
import { environment } from '../../environments/environment';
import {set} from '../model';
import {Observable} from 'rxjs';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  private httpClient = inject(HttpClient);
  private toastSvc = inject(ToastService);
  private headers: HttpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');

  public getPhotoAlbumsFromServer(): void {
    this.httpClient.get<PhotoAlbum[]>(
      `${environment.apiConfig.uri}/api/PhotoAlbum`,
      {headers: this.headers})
      .subscribe({
        "next": (photoAlbums) => {
          set((model) => {
            model.photoAlbums = photoAlbums;

            if (model.selectedPhotoAlbum !== undefined) {
              model.selectedPhotoAlbum = photoAlbums
                .filter(pa =>
                  pa.id === model.selectedPhotoAlbum!.id)[0];
            }
          });
        },
        "error": (err) => console.error(err),
      });
  }

  public createPhotoAlbum(albumName: string): Observable<Object> {
    return this.httpClient.post(
      `${environment.apiConfig.uri}/api/PhotoAlbum/${albumName}`,
      {headers: this.headers});
  }

  uploadPhoto(formData: FormData): Observable<Object>  {
    return this.httpClient
      .post(
        `${environment.apiConfig.uri}/api/upload/photo`,
        formData,
        {headers: this.headers}
      );
  }

  public getSelectedPhoto(albumId: number, photoName: string): void {
    this.httpClient.get<SelectedPhoto>(
      `${environment.apiConfig.uri}/api/Photo/${albumId}/${photoName}`,
      {headers: this.headers})
      .subscribe({
        "next": (photo) => {
          set((model) => {
            model.photoViewerPhoto = photo;
          });
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen des Fotos!',
            err.error,
            'error'
          );
        },
      });
  }
}
