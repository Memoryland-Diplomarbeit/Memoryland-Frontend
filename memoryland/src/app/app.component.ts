import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Location} from '@angular/common';
import {MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService} from '@azure/msal-angular';
import {filter, Subject, takeUntil} from 'rxjs';
import {EventMessage, EventType, InteractionStatus, RedirectRequest} from '@azure/msal-browser';

@Component({
    selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  protected title: string = 'Memoryland';
  protected loggedIn: boolean = false;
  private readonly _destroying$ = new Subject<void>();

  // Navigate within the Angular application,
  // manipulate the URL without reloading the
  // page, and handle browser history
  protected location = inject(Location);


  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) { }


  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.setLoggedIn();

    this.authService.instance.enableAccountStorageEvents();
    // This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED
    // events emitted when a user logs in or out of
    // another tab or window

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoggedIn();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }


  private setLoggedIn() {
    this.loggedIn = this.authService
      .instance
      .getAllAccounts()
      .length > 0;
  }

  private checkAndSetActiveAccount() {
    let activeAccount = this.authService
      .instance
      .getActiveAccount();
    this.setLoggedIn();

    if (
      !activeAccount &&
      this.loggedIn
    ) {
      let accounts = this
        .authService
        .instance
        .getAllAccounts();
      this.authService
        .instance
        .setActiveAccount(accounts[0]);
    }
  }

  protected login() {
    // uses custom config if present
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  protected logout() {
    this.authService.logoutRedirect();
  }
}
