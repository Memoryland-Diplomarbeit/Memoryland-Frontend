import {Component, inject, OnInit} from '@angular/core';
import {store} from '../../../model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {WebapiService} from '../../../services/webapi.service';
import {AsyncPipe} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

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
  protected sanitizer = inject(DomSanitizer);
  safeUrl: SafeResourceUrl | null = null;

  protected token = store
    .pipe(
      map(model => model.token),
      distinctUntilChanged(),
      debounceTime(1500)
    );

  ngOnInit(): void {
    store.pipe(
        map(model => model.selectedMemoryland),
        distinctUntilChanged(),
        debounceTime(1500)
      ).subscribe(memoryland => {
        if (memoryland !== undefined) {
          this.webApi.getPrivateToken(memoryland.id);
        }
    });

    this.token.subscribe(token => {
      if (token !== null && token !== undefined && token !== "") {
        this.safeUrl = this.sanitizer
          .bypassSecurityTrustResourceUrl(`/unity/index.html?token=${token}`);
      } else {
        this.safeUrl = null;
      }
    });
  }
}
