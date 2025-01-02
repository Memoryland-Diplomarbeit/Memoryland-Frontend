// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const b2cPolicies = {
  names: {
    signUpSignIn: "<flow-name>",
    editProfile: "<flow-name>"
  },
  authorities: {
    signUpSignIn: {
      authority: "https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<flow-name>"
    },
    editProfile: {
      authority: "https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/<flow-name>"
    }
  },
  authorityDomain: "<tenant-name>.b2clogin.com"
};

export const environment = {
  production: false,
  b2cPolicies: b2cPolicies,
  msalConfig: {
    auth: {
      clientId: "<your-client-id>",
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      knownAuthorities: [b2cPolicies.authorityDomain],
      redirectUri: '/',
    }
  },
  apiConfig: {
    scopes: [
      "https://<tenant-name>.onmicrosoft.com/<app-name>/<scope-name>",
    ],
    uri: "<backend-uri>"
  }
};

