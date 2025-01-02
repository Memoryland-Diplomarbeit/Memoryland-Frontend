import {IdTokenClaims} from '@azure/msal-browser';

export type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string,
  tfp?: string,
};
