// @ts-ignore
const b2cPolicies = {
  names: {
    signUpSignIn: window["env"]?.B2C_SIGNUP_SIGNIN_FLOW!,
    editProfile: window["env"]?.B2C_EDIT_PROFILE_FLOW!
  },
  authorities: {
    signUpSignIn: {
      authority: window["env"]?.B2C_SIGNUP_SIGNIN_AUTHORITY!
    },
    editProfile: {
      authority: window["env"]?.B2C_EDIT_PROFILE_AUTHORITY!
    }
  },
  authorityDomain: window["env"]?.B2C_AUTHORITY_DOMAIN!
};

export const environment = {
  production: false,
  b2cPolicies: b2cPolicies,
  msalConfig: {
    auth: {
      clientId: window["env"]?.CLIENT_ID!,
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      knownAuthorities: [b2cPolicies.authorityDomain],
      redirectUri: '/',
    }
  },
  apiConfig: {
    scopes: [
      window["env"]?.SCOPE_READ!,
      window["env"]?.SCOPE_WRITE!
    ],
    uri: window["env"]?.BACKEND_URI!
  }
};
