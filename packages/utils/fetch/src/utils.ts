import { getAuthToken } from "@bsport/local-storage-auth-token";
import { setSessionId, setTransactionId } from "@bsport/sentry";
import { getTimezoneName } from "@bsport/timezone-utils";

export type ResponseType<T> = {
  data: T;
  status: number;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getHeaders(customHeaders?: HeadersInit): HeadersInit {
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
    ...customHeaders,
  };
}

export function getFullUri(uri: string) {
  return `${API_BASE_URL}/${uri}`;
}

export class HTTPException extends Error {
  readonly path: string;
  readonly name: string;
  readonly statusCode: number;

  constructor(path: string, name: string, message: string, statusCode: number) {
    super(
      `Error calling backend (path: ${path}) because: [${JSON.stringify(name)}] ${message}`,
    );
    this.path = path;
    this.name = name;
    this.statusCode = statusCode;
  }
}
