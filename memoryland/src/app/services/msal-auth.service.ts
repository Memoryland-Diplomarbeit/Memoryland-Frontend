import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
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
    console.error("ngOnInit");
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
