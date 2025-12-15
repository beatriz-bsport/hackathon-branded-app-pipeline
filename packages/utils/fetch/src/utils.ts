import { getAuthToken } from "@bsport/local-storage-auth-token";
import { getBsportRequestFrom } from "@bsport/request-from-header";
import { getSessionId, getTransactionId } from "@bsport/sentry";
import { getCompanyTimezone } from "@bsport/timezone-utils";

export type ResponseType<T> = {
  data: T;
  status: number;
  backgroundTaskUuid: string | null;
};

export const UNKNOWN_TIMEZONE = "unknown";
export const BACKGROUND_TASK_UUID_HEADER = "x-background-task-uuid";

/**
 * Build request headers as a combination of common and custom headers
 */
export function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  const requestFrom = getBsportRequestFrom();

  return {
    Accept: "application/json",
    "X-Session-ID": getSessionId(),
    "X-Timezone-Name": getCompanyTimezone() || UNKNOWN_TIMEZONE,
    "X-React-Referrer": window.location.href.slice(0, 250),
    "X-bsport-log-collection": "true",
    "X-Transaction-ID": getTransactionId(),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(requestFrom ? { "X-bsport-request-from": requestFrom } : {}),
    ...customHeaders,
  };
}

/**
 * Parsed custom error codes associated to a 499 response (custom bsport exception)
 */
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

/**
 * Stringify the http error in a consistent way
 */
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
