import { getTimezoneName } from "@bsport/timezone-utils";
import { setTransactionId, setSessionId } from "@bsport/sentry";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TODO : Add inputs for getFetch to personalize the fetch method
// depending on the consuming application
export function getFetch() {
  return (
    uri: string,
    init?: Parameters<typeof fetch>[1],
  ): ReturnType<typeof fetch> => {
    return fetch(`${API_BASE_URL}/${uri}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Session-ID": setSessionId(),
        "X-Timezone-Name": getTimezoneName() || "unknown",
        "X-React-Referrer": window.location.href.slice(0, 250),
        "X-bsport-log-collection": "true",
        "X-Transaction-ID": setTransactionId(),
        // missing getBsportRequestFromHeader() here
        ...init?.headers,
      },
    });
  };
}
