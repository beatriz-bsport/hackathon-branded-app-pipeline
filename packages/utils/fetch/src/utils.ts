import { getAuthToken } from "@bsport/local-storage-auth-token";
import { setSessionId, setTransactionId } from "@bsport/sentry";
import { getTimezoneName } from "@bsport/timezone-utils";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getHeaders(): HeadersInit {
  const token = getAuthToken();

  // missing getBsportRequestFromHeader() here
  return {
    Accept: "application/json",
    "X-Session-ID": setSessionId(),
    "X-Timezone-Name": getTimezoneName() || "unknown",
    "X-React-Referrer": window.location.href.slice(0, 250),
    "X-bsport-log-collection": "true",
    "X-Transaction-ID": setTransactionId(),
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
}

export function getFullUri(uri: string) {
  return `${API_BASE_URL}/${uri}`;
}
