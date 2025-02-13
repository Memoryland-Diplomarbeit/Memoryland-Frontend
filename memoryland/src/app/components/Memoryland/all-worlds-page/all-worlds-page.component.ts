import {Component, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MemorylandListComponent} from '../memoryland-list/memoryland-list.component';
import {set, store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';

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

  protected readonly memorylandTypes = store
    .pipe(
      map(model => model.memorylandTypes),
      distinctUntilChanged()
    );
  protected readonly selectedType = store
    .pipe(
      map(model => model.memorylandTypes
        .findIndex(mt =>
          mt.name === model.selectedMemorylandType)),
      distinctUntilChanged()
    );

  ngOnInit() {
    this.memorylandTypes.subscribe(mt => {
      if (store.value.selectedMemorylandType === "" &&
        mt.length > 0) {
        set(model => {
          model.selectedMemorylandType = mt[0].name;
        });
      }
    });

    if (store.value.memorylandTypes.length > 0) {
      set(model => {
        model.selectedMemorylandType = store.value.memorylandTypes[0].name;
      });
    }
  }

  setType(val: string) {
    set(model => {
      model.selectedMemorylandType = val;
    });
  }

  setMemorylandName(val: string) {
    set(model => {
      model.createMemorylandName = val;
    });
  }

  createMemorylandNotValid() {
    return store.value.createMemorylandName === "" ||
      store.value.selectedMemorylandType === ""
  }

  createMemoryland() {
    console.debug("Creating memoryland");
    console.debug(store.value.createMemorylandName);
    console.debug(store.value.selectedMemorylandType);
  }
}
