import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MemorylandListComponent} from '../memoryland-list/memoryland-list.component';
import {store} from '../../../model';

@Component({
  selector: 'app-all-worlds-page',
  imports: [
    AsyncPipe,
    MemorylandListComponent,
  ],
  templateUrl: './all-worlds-page.component.html',
  styleUrl: './all-worlds-page.component.scss'
})
export class AllWorldsPageComponent {

  protected readonly store = store;
}
