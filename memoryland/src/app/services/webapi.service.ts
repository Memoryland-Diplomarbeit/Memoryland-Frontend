import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PhotoAlbum} from '../model/entity/MemoryStore/PhotoAlbum';
import { environment } from '../../environments/environment';
import {set} from '../model';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {
  private httpClient = inject(HttpClient);
  private headers: HttpHeaders = new HttpHeaders()
    .set('Accept', 'application/json');

  public getPhotoDataFromServer(): void {
    console.debug('getPhotoDataFromServer');
    this.httpClient.get<PhotoAlbum[]>(
      `${environment.apiConfig.uri}/api/PhotoAlbum`,
      {headers: this.headers})
      .subscribe({
        "next": (photoAlbums) => {
          set((model) => {
            console.debug('photoAlbums', photoAlbums);
          });
        },
        "error": (err) => console.error(err),
      });
  }
}
