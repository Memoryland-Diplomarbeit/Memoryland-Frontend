import {Component, inject, model, OnInit} from '@angular/core';
import {set, store} from '../../../model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {WebapiService} from '../../../services/webapi.service';
import {AsyncPipe} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';

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
      map(model => ({
        token: model.token,
      })),
      distinctUntilChanged(),
      debounceTime(1500)
    );

  protected selectedMemoryland = store
    .pipe(
      map(model => model.selectedMemoryland),
      distinctUntilChanged()
    );

  ngOnInit(): void {
    store.pipe(
        map(model => model.selectedMemoryland),
        distinctUntilChanged(),
        debounceTime(1500)
      ).subscribe(memoryland => {
        if (memoryland !== undefined) {
          this.webApi.getToken(memoryland.id);
        }
    });

    this.token.subscribe(token => {
      let myToken = token.token;

      if (myToken !== null && myToken !== undefined && myToken !== "") {
        this.safeUrl = this.sanitizer
          .bypassSecurityTrustResourceUrl(`/unity/index.html?token=${myToken}&server=${environment.apiConfig.uri}`);
      } else {
        this.safeUrl = null;
      }
    });
  }

  generatePublicKey() {
    if (store.value.selectedMemoryland !== undefined) {
      this.webApi.generateNewPublicToken(
        store.value.selectedMemoryland.id
      );
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.getSafeUrl()).then(() => {
      const tooltip = document.getElementById("copyTooltip");

      if (tooltip !== null) {
        tooltip.innerText = "Copied!";
        setTimeout(() => tooltip.innerText = "Copy", 2000);
      }
    });
  }

  getSafeUrl(): string {
    let url = this.safeUrl ?
      this.sanitizer.sanitize(4, this.safeUrl) ?? '' : '';

    if (url !== "") {
      return window.location.href.replace(window.location.pathname, "")+url;
    }

    return '';
  }

  protected readonly store = store;
}
