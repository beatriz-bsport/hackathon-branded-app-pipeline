import { getFullUri, getHeaders } from "./utils";

// TODO : Add inputs for getFetch to personalize the fetch method
// depending on the consuming application
export function getFetch() {
  return (
    uri: string,
    init?: Parameters<typeof fetch>[1],
  ): ReturnType<typeof fetch> => {
    return fetch(getFullUri(uri), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
        ...init?.headers,
      },
    });
  };
}
