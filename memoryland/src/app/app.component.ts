import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MsalModule} from "@azure/msal-angular";
import {MsalAuthService} from "./services/msal-auth.service";
import {CommonModule, Location} from "@angular/common";
import {set} from './model';
import {WebapiService} from './services/webapi.service';
import {ToastComponent} from './components/toast/toast.component';

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

  async ngOnInit() {
    await this.msalAuthSvc.initialize(
      () => {
        this.webApi.getPhotoAlbumsFromServer();
      },
      () => {
        set(model => {
          model.photoAlbums = [];
        });
      }
    );
  }

}
