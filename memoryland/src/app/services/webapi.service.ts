import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Memoryland, MemorylandConfig, MemorylandType, PhotoAlbum, RenameModelDto, SelectedPhoto} from '../model';
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
            model.photoAlbums = photoAlbums.map(p => {
              p.photos = p.photos.sort(
                (a,b) =>
                  a.name.localeCompare(b.name));
              return p;
            }).sort(
              (a,b) =>
                a.name.localeCompare(b.name));

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

  public uploadPhoto(formData: FormData): Observable<Object>  {
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
            model.memorylands = memorylands.sort(
              (a,b) =>
                a.name.localeCompare(b.name));

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
            model.memorylandTypes = types.sort(
              (a,b) =>
                a.name.localeCompare(b.name));

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

  public createMemoryland(memorylandName: string, memorylandTypeId: number): Observable<Object>  {
    return this.httpClient
      .post(
        `${environment.apiConfig.uri}/api/memoryland/${memorylandName}/${memorylandTypeId}`,
        {headers: this.headers}
      );
  }

  public getMemorylandConfigFromServer(memorylandId: number): void {
    this.httpClient.get<MemorylandConfig[]>(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}/configuration`,
      {headers: this.headers})
      .subscribe({
        "next": (configs) => {
          set((model) => {
            model.memorylandConfigs = structuredClone(configs)
              .sort((a,b) =>
                (a.position > b.position ? 1 : -1));
            model.originalMemorylandConfigs = structuredClone(model.memorylandConfigs);
          });
        },
        "error": (err) => console.error(err),
      });
  }

  public postMemorylandConfig(memorylandId: number, position: number, photoId: number): void {
    this.httpClient
      .post(
        `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}`,
        {
          "Position": position,
          "PhotoId": photoId,
        },
        {headers: this.headers}
      ).subscribe({
        "next": () => this.getMemorylandConfigFromServer(memorylandId),
        "error": (err) => console.error(err),
      });
  }

  public getToken(memorylandId: number, isPublic:boolean = false){
    this.httpClient.get<{ "token":string; "isPublic":boolean }>(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}/token/${isPublic}`,
      {headers: this.headers})
      .subscribe({
        "next": (tokenDto) => {
          set((model) => {
            if (tokenDto.isPublic) {
              model.publicToken = tokenDto.token;
            } else {
              model.token = tokenDto.token;
            }
          });
        },
        "error": (err) => console.error(err),
      });
  }

  public deletePhoto(photoId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/Photo/${photoId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => console.error(err),
      });
  }

  public deletePhotoAlbum(photoAlbumId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/PhotoAlbum/${photoAlbumId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => console.error(err),
      });
  }

  public deleteMemoryland(memorylandId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getMemorylandsFromServer(),
        "error": (err) => console.error(err),
      });
  }

  public renameMemoryland(id: number, name: string) {
    let renameModelDto: RenameModelDto = {
      oldId: id,
      newName: name
    }

    this.httpClient.put(
      `${environment.apiConfig.uri}/api/Memoryland/`,
      renameModelDto,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getMemorylandsFromServer(),
        "error": (err) => console.error(err),
      });
  }

  public renamePhoto(id: number, name: string) {
    let renameModelDto: RenameModelDto = {
      oldId: id,
      newName: name
    }

    this.httpClient.put(
      `${environment.apiConfig.uri}/api/Photo/`,
      renameModelDto,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => console.error(err),
      });
  }

  public renamePhotoAlbum(id: number, name: string) {
    let renameModelDto: RenameModelDto = {
      oldId: id,
      newName: name
    }

    this.httpClient.put(
      `${environment.apiConfig.uri}/api/PhotoAlbum/`,
      renameModelDto,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => console.error(err),
      });
  }
}
