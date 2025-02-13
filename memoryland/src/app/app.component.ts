import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MsalModule} from "@azure/msal-angular";
import {MsalAuthService} from "./services/msal-auth.service";
import {CommonModule, Location} from "@angular/common";
import {set} from './model';
import {WebapiService} from './services/webapi.service';
import {ToastComponent} from './components/toast/toast.component';
import {ToastService} from './services/toast.service';

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
  protected toastSvc = inject(ToastService);

  async ngOnInit() {
    await this.msalAuthSvc.initialize(
      () => {
        this.webApi.getPhotoAlbumsFromServer();
        this.webApi.getMemorylandsFromServer();
        this.webApi.getMemorylandTypesFromServer();
      },
      () => {
        set(model => {
          model.photoAlbums = [];
        });
      }
    );

    this.toastSvc.addToast("success", "success", "success");
    this.toastSvc.addToast("info", "info", "info");
    this.toastSvc.addToast("error", "error", "error");
  }

}
