import {Component, inject, OnInit} from '@angular/core';
import {FolderListComponent} from '../folder-list/folder-list.component';
import {ImageListComponent} from '../image-list/image-list.component';
import {set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {MemoryStoreService} from '../../../services/memory-store.service';
import {AsyncPipe} from '@angular/common';
import {UploadAlbumComponent} from '../upload-album/upload-album.component';
import {WebapiService} from '../../../services/webapi.service';

@Component({
  selector: 'app-memory-store-page',
  imports: [
    FolderListComponent,
    ImageListComponent,
    AsyncPipe,
    UploadAlbumComponent
  ],
  templateUrl: './memory-store-page.component.html',
  styleUrl: './memory-store-page.component.scss'
})
export class MemoryStorePageComponent implements OnInit{
  protected readonly webApi = inject(WebapiService);
  protected readonly memoryStoreSvc = inject(MemoryStoreService);
  protected readonly store = store;
  protected readonly photoAlbums = store
    .pipe(
      map(model => model.photoAlbums),
      distinctUntilChanged()
    );
  protected readonly uploadPhotoPhotoAlbumIndex = store
    .pipe(
      map(model => model.photoAlbums
        .findIndex(pa =>
          pa.id === store.value.uploadPhotoModel.selectedAlbumId)),
      distinctUntilChanged()
    );

  protected readonly canUploadAlbum = store
    .pipe(
      map(model => model.totalPhotos !== model.finishedPhotos),
      distinctUntilChanged()
    );

  protected readonly canResumeUpload = store
    .pipe(
      map(model => model.transaction === undefined),
      distinctUntilChanged()
    );

  ngOnInit() {
    this.photoAlbums.subscribe(p => {
      if (store.value.uploadPhotoModel.selectedAlbumId === undefined &&
        p.length > 0) {
        set(model => {
          model.uploadPhotoModel.selectedAlbumId = p[0].id;
        });
      }
    });

    this.store.pipe(
      map(model => model.selectedPhotoAlbum),
      distinctUntilChanged()
    ).subscribe(p => {
      if (p !== undefined) {
        set(model => {
          model.uploadPhotoModel.selectedAlbumId = p.id;
        });
      }
    });

    if (store.value.photoAlbums.length > 0) {
      set(model => {
        model.selectedPhotoAlbum = store.value.photoAlbums[0];
      });
    }
  }

  setAlbumName(val: string) {
    set(model => {
      model.createAlbumName = val;
    });
  }

  setFileName(val: string) {
    set(model => {
      model.uploadPhotoModel.fileName = val;
    });
  }

  setAlbum(val: string) {
    const id = Number.parseInt(val);

    if (!Number.isNaN(id)) {
      set(model => {
        model.uploadPhotoModel.selectedAlbumId = id;
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      set(model => {
        model.uploadPhotoModel.file = file;
        model.uploadPhotoModel.fileName = file.name;
      });
    }
  }

  setUseTransaction() {
    set(model => {
      model.uploadAlbumModel.useTransaction = true;
    });

    this.webApi.removeTransaction();
  }

  getPercentage(): number {
    return Math.floor(
      store.value.finishedPhotos/store.value.totalPhotos *
      100 * 100)/100;
  }

  setResumableUpload() {
    set(model => {
      model.uploadAlbumModel.useTransaction = true;
      model.useResumableUpload = true;
      model.uploadAlbumModel.selectedAlbumId = model.transaction!.destAlbum.id;
    });
  }
}
