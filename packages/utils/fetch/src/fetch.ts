import {
  HTTPException,
  type ResponseType,
  getFullUri,
  getHeaders,
} from "./utils";

/** @todo Add parameters to personalize the headers */
export function getFetch() {
  return async <T = string>(
    uri: string,
    init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
  ): Promise<ResponseType<T>> => {
    const headers = getHeaders({
      "Content-Type": "application/json",
      ...init?.headers,
    });

    const response = await fetch(getFullUri(uri), {
      ...init,
      headers,
    });

    let payload = null;

    try {
      const responseType = init?.responseType ?? "json";
      if (responseType === "text") {
        payload = await response.text();
      } else if (responseType === "buffer") {
        payload = await response.arrayBuffer();
      } else {
        payload = await response.json();
      }
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new HTTPException(
        uri,
        payload?.code ?? payload?.error ?? "UNKONWN",
        payload?.message ?? "Some Error occured",
        payload?.statusCode ?? response?.status ?? 400,
      );
    }

    return {
      data: payload as T,
      status: response.status,
    };
  };
}

export type Fetch = ReturnType<typeof getFetch>;
