import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MemorylandListComponent} from '../memoryland-list/memoryland-list.component';
import {set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {ToastService} from '../../../services/toast.service';
import {WebapiService} from '../../../services/webapi.service';

@Component({
  selector: 'app-all-worlds-page',
  imports: [
    AsyncPipe,
    MemorylandListComponent,
  ],
  templateUrl: './all-worlds-page.component.html',
  styleUrl: './all-worlds-page.component.scss'
})
export class AllWorldsPageComponent implements OnInit {
  protected readonly store = store;
  private readonly toastSvc = inject(ToastService);
  private readonly webApi = inject(WebapiService);

  protected readonly memorylandTypes = store
    .pipe(
      map(model => model.memorylandTypes),
      distinctUntilChanged()
    );
  protected readonly selectedType = store
    .pipe(
      map(model => model.memorylandTypes
        .findIndex(mt =>
          mt.id === model.selectedMemorylandType)),
      distinctUntilChanged()
    );

  ngOnInit() {
    this.memorylandTypes.subscribe(mt => {
      if (store.value.selectedMemorylandType === undefined &&
        mt.length > 0) {
        set(model => {
          model.selectedMemorylandType = mt[0].id;
        });
      }
    });

    if (store.value.memorylandTypes.length > 0) {
      set(model => {
        model.selectedMemorylandType = store.value.memorylandTypes[0].id;
      });
    }
  }

  setType(val: string) {
    let id = Number.parseInt(val);

    if (!Number.isNaN(id)) {
      set(model => {
        model.selectedMemorylandType = id;
      });
    }
  }

  setMemorylandName(val: string) {
    set(model => {
      model.createMemorylandName = val;
    });
  }

  createMemorylandNotValid() {
    return store.value.createMemorylandName === "" ||
      store.value.selectedMemorylandType === undefined
  }

  createMemoryland() {
    if (store.value.selectedMemorylandType !== undefined) {
      this.webApi
        .createMemoryland(
          store.value.createMemorylandName,
          store.value.selectedMemorylandType)
        .subscribe({
          next: () => {
            this.toastSvc.addToast(
              'Memoryland erstellt!',
              `Das Memoryland ${store.value.createMemorylandName} wurde erfolgreich erstellt!`,
              'success'
            );

            set(model => {
              model.uploadPhotoModel.fileName = '';
              model.uploadPhotoModel.selectedAlbumId = undefined;
              model.uploadPhotoModel.file = undefined;
            });
            this.webApi.getMemorylandsFromServer();
          },
          error: (err) => {
            this.toastSvc.addToast(
              'Fehler beim erstellen des Memorylands!',
              err.message + ":\n" + err.error,
              'error'
            );
          }
      });
    }
  }
}
