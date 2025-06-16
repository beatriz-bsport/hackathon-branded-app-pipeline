import { getAuthToken } from "@bsport/local-storage-auth-token";
import { getSessionId, getTransactionId } from "@bsport/sentry";
import { getTimezoneName } from "@bsport/timezone-utils";

export type ResponseType<T> = {
  data: T;
  status: number;
  backgroundTaskUuid: string | null;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const BACKGROUND_TASK_UUID_HEADER = "x-background-task-uuid";

export function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token = getAuthToken();

  // missing getBsportRequestFromHeader() here
  return {
    Accept: "application/json",
    "X-Session-ID": getSessionId(),
    "X-Timezone-Name": getTimezoneName() || "unknown",
    "X-React-Referrer": window.location.href.slice(0, 250),
    "X-bsport-log-collection": "true",
    "X-Transaction-ID": getTransactionId(),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...customHeaders,
  };
}

export function getFullUri(uri: string) {
  return `${API_BASE_URL}/${uri}`;
}

export function getCustomErrorCodes(
  err:
    | number
    | Array<{ error_code: number; error_message: string }>
    | undefined,
): number[] {
  if (!err) return [];

  if (Array.isArray(err)) {
    return err?.filter(Boolean).map((error) => error.error_code);
  }

  if (typeof err === "number") {
    return [err];
  }

  return [];
}

export function getMessage(
  httpError:
    | string
    | Array<{ error_code: number; error_message: string }>
    | undefined,
): string {
  if (!httpError) return "";

  if (Array.isArray(httpError)) {
    return httpError
      ?.filter(Boolean)
      .map((error) => error.error_message)
      .join(";");
  }

  if (typeof httpError === "string") {
    return httpError;
  }

  try {
    return JSON.stringify(httpError);
  } catch {
    return "";
  }
}
