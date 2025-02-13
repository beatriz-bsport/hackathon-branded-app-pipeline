import { getFullUri, getHeaders } from "./utils";

// TODO : Add inputs for getFetch to personalize the fetch method
// depending on the consuming application
export function getFetch() {
  return (uri: string, init?: RequestInit): Promise<Response> => {
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

export type Fetch = ReturnType<typeof getFetch>;
