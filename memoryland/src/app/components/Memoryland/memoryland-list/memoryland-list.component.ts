import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {HoverClassDirective} from "../../../directives/hover-class.directive";
import {distinctUntilChanged, map} from 'rxjs';
import {Memoryland, PhotoAlbum, set, store} from '../../../model';

@Component({
  selector: 'app-memoryland-list',
    imports: [
        AsyncPipe,
        HoverClassDirective
    ],
  templateUrl: './memoryland-list.component.html',
  styleUrl: './memoryland-list.component.scss'
})
export class MemorylandListComponent {
  protected memorylands = store.pipe(
    map(model => model.memorylands),
    distinctUntilChanged()
  );

  selectMemoryland(m: Memoryland) {
    set(model => {
      model.selectedMemoryland = m;
    });
  }

  deleteMemoryland() {

  }

  protected readonly store = store;
}
