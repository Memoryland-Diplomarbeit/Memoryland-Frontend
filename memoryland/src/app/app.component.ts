import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalModule,
  MsalService
} from '@azure/msal-angular';
import {filter, Subject, takeUntil} from 'rxjs';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  IdTokenClaims,
  InteractionStatus, InteractionType, PopupRequest,
  RedirectRequest, SsoSilentRequest
} from '@azure/msal-browser';
import {environment} from '../environment/environment';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string,
  tfp?: string,
};

@Component({
    selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MsalModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
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

  async ngOnInit(): Promise<void> {
    this.authService.handleRedirectObservable().subscribe();
    this.setLoggedIn();

    this.authService.instance.enableAccountStorageEvents();
    // This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED
    // events emitted when a user logs in or out of
    // another tab or window

    //region Account added or removed event
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        this.setLoggedIn();
        if (!this.loggedIn) {
          window.location.pathname = '/';
        }
      });
    //endregion

    //region In progress event -> check and set active account
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.debug(`check and set active account`);
        this.checkAndSetActiveAccount();
        this.setLoggedIn();
      });
    //endregion

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        // Check for forgot password error
        // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
        console.error(`login failed: ${result}`);
        this.setLoggedIn();
      });

    this.msalBroadcastService.msalSubject$
        .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS
          || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
          || msg.eventType === EventType.SSO_SILENT_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {

        console.error("login success");
        let payload = result.payload as AuthenticationResult;
        let idtoken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

        if (idtoken.acr === environment.b2cPolicies.names.signUpSignIn || idtoken.tfp === environment.b2cPolicies.names.signUpSignIn) {
          this.authService.instance.setActiveAccount(payload.account);
        }

        /**
         * For the purpose of setting an active account for UI update, we want to consider only the auth response resulting
         * from SUSI flow. "acr" claim in the id token tells us the policy (NOTE: newer policies may use the "tfp" claim instead).
         * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
         */

        if (idtoken.acr === environment.b2cPolicies.names.editProfile || idtoken.tfp === environment.b2cPolicies.names.editProfile) {

          // retrieve the account from initial sing-in to the app
          const originalSignInAccount = this.authService.instance.getAllAccounts()
            .find((account: AccountInfo) =>
              account.idTokenClaims?.oid === idtoken.oid
              && account.idTokenClaims?.sub === idtoken.sub
              && ((account.idTokenClaims as IdTokenClaimsWithPolicyId).acr === environment.b2cPolicies.names.signUpSignIn
                || (account.idTokenClaims as IdTokenClaimsWithPolicyId).tfp === environment.b2cPolicies.names.signUpSignIn)
            );

          let signUpSignInFlowRequest: SsoSilentRequest = {
            authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
            account: originalSignInAccount
          };

          // silently login again with the signUpSignIn policy
          this.authService.ssoSilent(signUpSignInFlowRequest);
        }

        this.setLoggedIn();
        return result;
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

    if (
      !activeAccount &&
      this.loggedIn
    ) {
      console.log("logged in");
      let accounts = this
        .authService
        .instance
        .getAllAccounts();
      this.authService
        .instance
        .setActiveAccount(accounts[0]);
      console.log(accounts[0]);
    } else {
      console.log("not logged in")
      this.setLoggedIn();
    }
  }

  protected login(loginFlowRequest?: RedirectRequest | PopupRequest) {

      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest, ...loginFlowRequest } as RedirectRequest);
      } else {
        this.authService.loginRedirect(loginFlowRequest);
      }
  }

  protected editProfile() {
    let editProfileFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies.authorities.editProfile.authority,
      scopes: [],
    };
    this.login(editProfileFlowRequest)
  }

  protected logout() {
    this.authService.logoutRedirect();
  }

  protected readonly environment = environment;
}
