import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MsalModule} from "@azure/msal-angular";
import {MsalAuthService} from "./services/msal-auth.service";
import {CommonModule, Location} from "@angular/common";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MsalModule,
    RouterOutlet,
    RouterOutlet,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  protected location = inject(Location);
  protected msalAuthSvc = inject(MsalAuthService);

  async ngOnInit() {
    await this.msalAuthSvc.initialize();
  }
}
