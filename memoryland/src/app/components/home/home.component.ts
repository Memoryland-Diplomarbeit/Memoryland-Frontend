import {Component, inject, OnInit} from '@angular/core';
import {MsalBroadcastService, MsalService} from '@azure/msal-angular';
import {filter} from 'rxjs';
import {AuthenticationResult, EventMessage, EventType, InteractionStatus} from '@azure/msal-browser';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  protected loginDisplay: boolean = false;
  protected loginName: string = "none";

  private authService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.authService
          .instance
          .setActiveAccount(payload.account);
        console.log(payload);
        if (payload.account.name) {
          this.loginName = payload.account.name;
        }
        else {
          this.loginName = "none";
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) =>
          status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService
      .instance
      .getAllAccounts()
      .length > 0;
    if (!this.loginDisplay) {
      this.loginName = "none";
    }
  }
}
