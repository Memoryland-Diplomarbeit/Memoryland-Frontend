import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Memoryland, MemorylandType, PhotoAlbum, SelectedPhoto} from '../model';
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
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public getMemorylandsFromServer(): void {
    this.httpClient.get<Memoryland[]>(
      `${environment.apiConfig.uri}/api/Memoryland/all`,
      {headers: this.headers})
      .subscribe({
        "next": (memorylands) => {
          set((model) => {
            model.memorylands = memorylands;

            if (model.selectedMemoryland !== undefined) {
              model.selectedMemoryland = memorylands
                .filter(m =>
                  m.id === model.selectedMemoryland!.id)[0];
            }
          });
        },
        "error": (err) => console.error(err),
      });
  }

  public getMemorylandTypesFromServer(): void {
    this.httpClient.get<MemorylandType[]>(
      `${environment.apiConfig.uri}/api/Memoryland/types`,
      {headers: this.headers})
      .subscribe({
        "next": (types) => {
          set((model) => {
            model.memorylandTypes = types;

            if (model.selectedMemorylandType !== undefined) {
              let memType = types
                .filter(m =>
                  m.id === model.selectedMemorylandType);

              if (memType !== undefined && memType.length > 0) {
                model.selectedMemorylandType = memType[0].id;
              }
            }
          });
        },
        "error": (err) => console.error(err),
      });
  }

  createMemoryland(memorylandName: string, memorylandTypeId: number): Observable<Object>  {
    return this.httpClient
      .post(
        `${environment.apiConfig.uri}/api/memoryland/${memorylandName}/${memorylandTypeId}`,
        {headers: this.headers}
      );
  }
}
