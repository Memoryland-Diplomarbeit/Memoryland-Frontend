import {Inject, Injectable, OnDestroy} from '@angular/core';
import {filter, Subject, takeUntil} from 'rxjs';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService
} from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
  SsoSilentRequest
} from '@azure/msal-browser';
import {environment} from '../../environments/environment';
import {IdTokenClaimsWithPolicyId} from "../model/entity/authentication-authorization/IdTokenClainsWithPolicyId";

@Injectable({
  providedIn: 'root'
})
export class MsalAuthService implements OnDestroy {
  public loggedIn: boolean = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService) {
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  async initialize(): Promise<void> {
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
      .subscribe(() => {
        this.setLoggedIn();
        if (!this.loggedIn) {
          window.location.pathname = '/';
        }
      });

    //In progress event -> check and set active account
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) =>
            status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.setLoggedIn();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_FAILURE ||
          msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        console.error(`login failed: ${result}`);
        this.setLoggedIn();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) =>
          msg.eventType === EventType.LOGIN_SUCCESS ||
          msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
          msg.eventType === EventType.SSO_SILENT_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        let payload = result
          .payload as AuthenticationResult;
        let idTokenClaims = payload
          .idTokenClaims as IdTokenClaimsWithPolicyId;

        if (
          idTokenClaims.acr === environment.b2cPolicies
            .names
            .signUpSignIn ||
          idTokenClaims.tfp === environment.b2cPolicies
            .names
            .signUpSignIn) {
          this.authService.instance
            .setActiveAccount(payload.account);
        }

        if (
          idTokenClaims.acr === environment.b2cPolicies
            .names
            .editProfile ||
          idTokenClaims.tfp === environment.b2cPolicies
            .names
            .editProfile) {
          // retrieve the account from initial sign-in to the app
          const originalSignInAccount = this.authService
            .instance
            .getAllAccounts()
            .find((account: AccountInfo) =>
              account.idTokenClaims?.oid === idTokenClaims.oid &&
              account.idTokenClaims?.sub === idTokenClaims.sub &&
              (
                (account.idTokenClaims as IdTokenClaimsWithPolicyId)
                  .acr === environment.b2cPolicies
                  .names
                  .signUpSignIn ||
                (account.idTokenClaims as IdTokenClaimsWithPolicyId)
                  .tfp === environment.b2cPolicies
                  .names
                  .signUpSignIn
              )
            );

          let signUpSignInFlowRequest: SsoSilentRequest = {
            authority: environment.b2cPolicies
              .authorities
              .signUpSignIn
              .authority,
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
      let accounts = this
        .authService
        .instance
        .getAllAccounts();

      this.authService
        .instance
        .setActiveAccount(accounts[0]);
    } else {
      this.setLoggedIn();
    }
  }

  public login(loginFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
        ...loginFlowRequest } as RedirectRequest
      );
    } else {
      this.authService
        .loginRedirect(loginFlowRequest);
    }
  }

  public editProfile() {
    let editProfileFlowRequest: RedirectRequest | PopupRequest  = {
      authority: environment.b2cPolicies
        .authorities
        .editProfile
        .authority,
      scopes: [],
    };
    this.login(editProfileFlowRequest)
  }

  public logout() {
    this.authService.logoutRedirect();
  }
}
