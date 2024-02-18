export const SCHEME = process.env.SCHEME ? process.env.SCHEME : "http";
export const HOST = process.env.HOST ? process.env.HOST : "localhost";
export const PORT = process.env.PORT ? process.env.PORT : "8088";
export const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1`;
export const LOGIN_URL = BASE_URL + `/auth/token`;
export const SIGNUP_URL = BASE_URL + `/users`
export const CONTACT_URL = BASE_URL + `/contacts`
export const RELAY_URL = BASE_URL + `/`;

export const PAYMENT_URL = BASE_URL + `/payment`;
export const SEARCH_URL = BASE_URL + `/search`;
export const SEARCHES_URL = BASE_URL + `/searches`;

export const FAVORITES_URL = BASE_URL + `/favorites`

export const NOTIFICATIONS_URL = BASE_URL + `/notifications`
export const SUGGESTION_URL = BASE_URL + `/search/suggestion`;

//export const ADS_IMAGE_URL = `${SCHEME}://${HOST}:${PORT}/images/`;
export const ADS_IMAGE_URL = `${process.env.REACT_APP_API_BASE_URL}/images/`;
export const ACTIVE_USER_URL = BASE_URL + `/auth/token/verify`;

export const FORGOT_PASSWORD_USER_URL = BASE_URL + `/auth/forgot-password`;

export const RESET_PASSWORD_USER_URL = BASE_URL + `/auth/reset-password`;
export const IMAGE_URL = BASE_URL + `/images`;
export const CHAT_URL = BASE_URL + `/chats`;
export const MESSAGE_URL = BASE_URL + `/messages`;
export const ADS_URL = BASE_URL + `/ads`;
export const ACCESS_TOKEN = "accessToken";

export const REFRESH_TOKEN = "refreshToken";
export const EXPIRATION = "expiration";


export const defaultHeaders = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const headersWithAuthorization = () => {
  let requestHeaders: any = {
    ...defaultHeaders(),
    Authorization: localStorage.getItem(ACCESS_TOKEN),
  };
  return {
    ...requestHeaders,
  };
};

export const headersImageAuthorization = () => {
  let requestHeaders: any = {
    Accept: "*/*",
    Authorization: localStorage.getItem(ACCESS_TOKEN),
  };
  return {
    ...requestHeaders,
  };
};

export const tokenExpired = () => {
  const expDate = Number(localStorage.getItem(EXPIRATION));

  if (expDate > Date.now()) {
    return false;
  }
  return true;
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN)
};

export const getExpiredToken = () => {
  return Number(localStorage.getItem(EXPIRATION))
};

export const storeAccessToken = (token: any) => {
  if (token !== "") {
    localStorage.setItem(REFRESH_TOKEN, token.refreshToken);
    localStorage.setItem(ACCESS_TOKEN, `Bearer ${token.accessToken}`);
    localStorage.setItem(
      EXPIRATION,
      getExpiration(token.accessToken).toString(),
    );
  } else {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRATION);
  }
};

export const getExpiration = (token: string) => {
  let encodedPayload = token ? token.split(".")[1] : null;
  if (encodedPayload) {
    encodedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(encodedPayload));
    return payload?.exp ? payload?.exp * 1000 : 0;
  }
  return 0;
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);
