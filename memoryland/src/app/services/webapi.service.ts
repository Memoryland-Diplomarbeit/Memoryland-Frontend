import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  Memoryland,
  MemorylandConfig,
  MemorylandType,
  PhotoAlbum,
  RenameModelDto,
  SelectedPhoto,
  store,
  Transaction
} from '../model';
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
    set(model => {
      model.loadingAlbums = true;
    });

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

            if (model.photoAlbums.length > 0) {
              if (model.selectedPhotoAlbum !== undefined) {
                let filteredAlbums = photoAlbums
                  .filter(pa =>
                    pa.id === model.selectedPhotoAlbum!.id);

                if (filteredAlbums.length > 0) {
                  model.selectedPhotoAlbum = filteredAlbums[0];
                } else {
                  model.selectedPhotoAlbum = undefined;
                }
              } else {
                model.selectedPhotoAlbum = model.photoAlbums[0];
              }

              if (model.uploadPhotoModel.selectedAlbumId === undefined) {
                model.uploadPhotoModel.selectedAlbumId = model
                  .photoAlbums[0].id;
              }

              if (model.uploadAlbumModel.selectedAlbumId === undefined) {
                model.uploadAlbumModel.selectedAlbumId = model
                  .photoAlbums[0].id;
              }
            } else {
              model.selectedPhotoAlbum = undefined;
              model.uploadPhotoModel.selectedAlbumId = undefined;
              model.uploadAlbumModel.selectedAlbumId = undefined;
            }

            model.loadingAlbums = false;
          });
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen der Photoalben!',
            err.message + ":\n" + err.error,
            'error'
          );

          set(model => {
            model.loadingAlbums = false;
          });
        },
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
    set(model => {
      model.loadingMemorylands = true;
    });

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

            model.loadingMemorylands = false;
          });
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen der Memorylands!',
            err.message + ":\n" + err.error,
            'error'
          );

          set(model => {
            model.loadingMemorylands = false;
          });
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen der Memoryland-Typen!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen der Memoryland-Configurationen!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim speichern der Memoryland-Configuration!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public deletePhoto(photoId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/Photo/${photoId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim löschen des Fotos!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public deletePhotoAlbum(photoAlbumId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/PhotoAlbum/${photoAlbumId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getPhotoAlbumsFromServer(),
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim löschen des Albums!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public deleteMemoryland(memorylandId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getMemorylandsFromServer(),
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim löschen des Memorylands!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public deleteMemorylandConfig(configId: number, memorylandId: number){
    this.httpClient.delete(
      `${environment.apiConfig.uri}/api/Memoryland/config/${configId}`,
      {headers: this.headers})
      .subscribe({
        "next": () => this.getMemorylandConfigFromServer(memorylandId),
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim löschen der Memoryland-Configuration!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim umbenennen des Memorylands!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim umbenennen des Fotos!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
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
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim umbenennen des Albums!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public removeTransaction() {
    if (store.value.transaction !== undefined) {
      this.httpClient.delete(
        `${environment.apiConfig.uri}/api/Upload/transaction/${store.value.transaction.id}`,
        {headers: this.headers})
        .subscribe({
          "next": () => this.getTransaction(),
          "error": (err) => {
            this.toastSvc.addToast(
              'Fehler beim löschen der Transaction!',
              err.message + ":\n" + err.error,
              'error'
            );

            set((model) => {
              model.uploadAlbumModel.useTransaction = false;
            });
          },
        });
    }
  }

  public getTransaction() {
    this.httpClient.get<Transaction[]>(
      `${environment.apiConfig.uri}/api/Upload/transaction`,
      {headers: this.headers})
      .subscribe({
        "next": (transactions) => {
          if (transactions.length > 0) {
            set((model) => {
              model.transaction = transactions[0];
            });
          } else {
            set((model) => {
              model.transaction = undefined;
            });
          }
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim abrufen des Resumable-Uploads!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public postTransaction(func: () => void | undefined) {
    this.httpClient
      .post(
        `${environment.apiConfig.uri}/api/Upload/transaction`,
        {
          "destAlbumId": store.value
            .uploadAlbumModel.selectedAlbumId,
        },
        {headers: this.headers}
      ).subscribe({
      "next": () => {
        if (func !== undefined)
          func();
      },
      "error": (err) => {
        this.toastSvc.addToast(
          'Fehler beim speichern des Resumable Uploads!',
          err.message + ":\n" + err.error,
          'error'
        );
      },
    });
  }

  public getToken(memorylandId: number){
    this.httpClient.get<{ "token":string; }>(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}/token/`,
      {headers: this.headers})
      .subscribe({
        "next": (tokenDto) => {
          set((model) => {
            model.token = tokenDto.token;
          });
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim holen eines Tokens!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }

  public generateNewPublicToken(memorylandId: number) {
    this.httpClient.post<{ "token":string; }>(
      `${environment.apiConfig.uri}/api/Memoryland/${memorylandId}/token/`,
      {headers: this.headers})
      .subscribe({
        "next": (tokenDto) => {
          set((model) => {
            model.token = tokenDto.token;
          });
        },
        "error": (err) => {
          this.toastSvc.addToast(
            'Fehler beim generieren eines neuen Tokens!',
            err.message + ":\n" + err.error,
            'error'
          );
        },
      });
  }
}
