// `ng build` replaces `environments.ts` with `environments.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  serverBaseUrl: "http://localhost:8080",
  production: false,
  msalConfig: {
    auth: {
      clientId: "",
    }
  },
  apiConfig: {
    scopes: [""],
    uri: ""
  },
  b2cPolicies: {
    names: {
      signUpSignIn: "",
      resetPassword: "",
      editProfile: ""
    },
    authorities: {
      signUpSignIn: {
        authority: ""
      },
      resetPassword: {
        authority: ""
      },
      editProfile: {
        authority: ""
      }
    },
    authorityDomain: ""
  }
};
