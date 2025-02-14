interface Window {
  env: {
    B2C_SIGNUP_SIGNIN_FLOW?: string;
    B2C_EDIT_PROFILE_FLOW?: string;
    B2C_SIGNUP_SIGNIN_AUTHORITY?: string;
    B2C_EDIT_PROFILE_AUTHORITY?: string;
    B2C_AUTHORITY_DOMAIN?: string;
    CLIENT_ID?: string;
    SCOPE_READ?: string;
    SCOPE_WRITE?: string;
    BACKEND_URI?: string;
  };
}

declare var window: Window;
