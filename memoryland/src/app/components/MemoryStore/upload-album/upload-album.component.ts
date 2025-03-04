import {Component, inject, OnInit} from '@angular/core';
import {set, store} from '../../../model';
import {UploadFolderService} from '../../../services/upload-folder.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {distinctUntilChanged, filter, map} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-upload-album',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './upload-album.component.html',
  styleUrl: './upload-album.component.scss'
})
export class UploadAlbumComponent implements OnInit {
  protected readonly uploadFolderSvc = inject(UploadFolderService);
  protected readonly photoAlbums = store
    .pipe(
      map(model => model.photoAlbums),
      distinctUntilChanged()
    );
  protected readonly uploadPhotoPhotoAlbumIndex = store
    .pipe(
      map(model => model.photoAlbums
        .findIndex(pa =>
          pa.id === store.value.uploadAlbumModel.selectedAlbumId)),
      distinctUntilChanged()
    );
  protected readonly useTransaction = store
    .pipe(
      map(model => model.uploadAlbumModel.useTransaction),
      distinctUntilChanged()
    );
  protected readonly isTransaction = store
    .pipe(
      map(model => model.useTransaction),
      distinctUntilChanged()
    );

  ngOnInit() {
    this.photoAlbums.subscribe(p => {
      if (store.value.uploadAlbumModel.selectedAlbumId === undefined &&
        p.length > 0) {
        set(model => {
          model.uploadAlbumModel.selectedAlbumId = p[0].id;
        });
      }
    });

    this.store.pipe(
      map(model => model.selectedPhotoAlbum),
      distinctUntilChanged()
    ).subscribe(p => {
      if (p !== undefined) {
        set(model => {
          model.uploadAlbumModel.selectedAlbumId = p.id;
        });
      }
    });

    if (store.value.photoAlbums.length > 0) {
      set(model => {
        model.selectedPhotoAlbum = store.value.photoAlbums[0];
      });
    }
  }

  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);
      let filteredFiles = files.filter(file =>
        file.webkitRelativePath.split('/').length === 2);

      if (store.value.transaction !== undefined) {
        const transaction = store.value.transaction;

        filteredFiles = filteredFiles
          .filter(f => transaction
            .destAlbum
            .photos
            .find(p => p.name === f.name) === undefined);
      }

      set(model => {
        model.uploadAlbumModel.files = filteredFiles.filter(file => {
          const extension = file
            .name
            .split('.')
            .pop()
            ?.toLowerCase();

          return extension && this.uploadFolderSvc
            .allowedExtensions
            .includes(extension);
        });
      });
    }
  }

  setAlbum(val: string) {
    const id = Number.parseInt(val);

    if (!Number.isNaN(id)) {
      set(model => {
        model.uploadAlbumModel.selectedAlbumId = id;
      });
    }
  }

  setUseTransaction(val: boolean) {
    set(model => {
      model.uploadAlbumModel.useTransaction = val;
    });
  }

  uploadAlbumNotValid(): boolean {
    const uploadAlbum = this.store.value.uploadAlbumModel;

    return uploadAlbum.selectedAlbumId === undefined;
  }

  protected readonly store = store;

  unsetUseTransaction() {
    set(model => {
      model.useTransaction = false;
    });
  }
}
