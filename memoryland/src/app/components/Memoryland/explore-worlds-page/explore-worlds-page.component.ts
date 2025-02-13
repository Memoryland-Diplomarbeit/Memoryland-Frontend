import {Component, inject, OnInit} from '@angular/core';
import {store} from '../../../model';
import {distinctUntilChanged, map} from 'rxjs';
import {WebapiService} from '../../../services/webapi.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-explore-worlds-page',
  imports: [
    AsyncPipe
  ],
  templateUrl: './explore-worlds-page.component.html',
  styleUrl: './explore-worlds-page.component.scss'
})
export class ExploreWorldsPageComponent implements OnInit {
  protected webApi = inject(WebapiService);

  protected token = store
    .pipe(
      map(model => model.token),
      distinctUntilChanged(),
    );

  ngOnInit(): void {
    store.pipe(
        map(model => model.selectedMemoryland),
        distinctUntilChanged(),
      ).subscribe(memoryland => {
        if (memoryland !== undefined) {
          this.webApi.getPrivateToken(memoryland.id);
        }
    });
  }
}
