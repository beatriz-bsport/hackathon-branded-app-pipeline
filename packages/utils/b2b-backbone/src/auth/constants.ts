import { getFetch } from "@bsport/fetch";

export const fetch = getFetch();

export const BSPORT_AUTH_TOKEN_KEY = "bsport_auth_token";

export const LOGIN_URL = "/login";

// Define a list of URLs to ignore for authentication
export const EXCLUDED_URLS = [LOGIN_URL];
