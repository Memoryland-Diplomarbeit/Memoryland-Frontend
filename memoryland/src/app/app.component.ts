import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MsalModule} from "@azure/msal-angular";
import {MsalAuthService} from "./services/msal-auth.service";
import {CommonModule, Location} from "@angular/common";
import {set, store} from './model';
import {WebapiService} from './services/webapi.service';
import {ToastComponent} from './components/toast/toast.component';
import {distinctUntilChanged, map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MsalModule,
    RouterOutlet,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  protected location = inject(Location);
  protected webApi = inject(WebapiService);
  protected msalAuthSvc = inject(MsalAuthService);

  protected userName = store
    .pipe(
      map(model => model.username),
      distinctUntilChanged()
    )

  async ngOnInit() {
    await this.msalAuthSvc.initialize(
      () => {
        this.webApi.getPhotoAlbumsFromServer();
        this.webApi.getMemorylandsFromServer();
        this.webApi.getMemorylandTypesFromServer();
        this.webApi.getTransaction();
      },
      () => {
        set(model => {
          model.photoAlbums = [];
        });
      }
    );

    store.pipe(
      map(model => model.selectedMemoryland),
      distinctUntilChanged()
    ).subscribe(_ => {
        set(model => {
          model.token = "";
        });
      }
    )
  }

}
