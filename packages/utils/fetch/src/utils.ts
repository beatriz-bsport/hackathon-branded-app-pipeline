import { getAuthToken } from "@bsport/local-storage-auth-token";
import { getBsportRequestFrom } from "@bsport/request-from-header";
import { getSessionId, getTransactionId } from "@bsport/sentry";
import { getTimezoneName } from "@bsport/timezone-utils";

export type ResponseType<T> = {
  data: T;
  status: number;
  backgroundTaskUuid: string | null;
};

const API_DEV = "https://api.dev.bsport.io";
const API_LOCAL = "http://localhost:8000";
const API_SUFFIX_FEATURE_BRANCH = "chaos.bsport.io";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? API_DEV;

export const BACKGROUND_TASK_UUID_HEADER = "x-background-task-uuid";

export function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  const requestFrom = getBsportRequestFrom();

  return {
    Accept: "application/json",
    "X-Session-ID": getSessionId(),
    "X-Timezone-Name": getTimezoneName() || "unknown",
    "X-React-Referrer": window.location.href.slice(0, 250),
    "X-bsport-log-collection": "true",
    "X-Transaction-ID": getTransactionId(),
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(requestFrom ? { "X-bsport-request-from": requestFrom } : {}),
    ...customHeaders,
  };
}

export function getFullUri(uri: string) {
  if (
    API_BASE_URL === API_LOCAL ||
    API_BASE_URL?.includes(API_SUFFIX_FEATURE_BRANCH)
  ) {
    // We need to remove the replace the prefix with `api`
    // to be compliant with localhost API or Feature branch API usage in saas-legacy
    // There are two cases :
    // - if v0 (e.g. platform/v0) -> replace with api-v0
    // - if v1 (e.g. platform/v1) -> replace with api/v1
    const [version, ...otherParts] = uri.split("/").slice(1);

    // Validate that we have a recognized version segment
    if (!version || (version !== "v0" && version !== "v1")) {
      console.warn(`Unexpected URI structure for local/feature API: ${uri}`);
      return `${API_BASE_URL}/${uri}`;
    }

    const localUri =
      version === "v0"
        ? `api-v0/${otherParts.join("/")}`
        : `api/v1/${otherParts.join("/")}`;
    return `${API_BASE_URL}/${localUri}`;
  }
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
