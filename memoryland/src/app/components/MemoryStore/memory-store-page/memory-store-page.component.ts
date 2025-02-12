import {Component, inject, OnInit} from '@angular/core';
import {FolderListComponent} from '../folder-list/folder-list.component';
import {ImageListComponent} from '../image-list/image-list.component';
import {set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {MemoryStoreService} from '../../../services/memory-store.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-memory-store-page',
  imports: [
    FolderListComponent,
    ImageListComponent,
    AsyncPipe
  ],
  templateUrl: './memory-store-page.component.html',
  styleUrl: './memory-store-page.component.css'
})
export class MemoryStorePageComponent implements OnInit{
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

}
