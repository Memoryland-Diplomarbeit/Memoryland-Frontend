// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  serverBaseUrl: "<server-base-url>",
  production: false,
  b2cPolicies: {
    names: {
      signUpSignIn: "<flow-name>",
      //resetPassword: "",
      //editProfile: ""
    },
    authorities: {
      signUpSignIn: {
        authority: "https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<flow-name>"
      },
      // resetPassword: {
      //   authority: ""
      // },
      // editProfile: {
      //   authority: ""
      // }
    },
    authorityDomain: "<tenant-name>.b2clogin.com"
  },
  msalConfig: {
    auth: {
      clientId: "<your-client-id>",
    }
  },
  apiConfig: {
    scopes: [
      "https://<tenant-name>.onmicrosoft.com/<app-name>/<scope-name>",
      "https://<tenant-name>.onmicrosoft.com/<app-name>/<scope-name>"
    ],
    uri: "https://<tenant-name>.onmicrosoft.com/<app-name>"
  }
};
