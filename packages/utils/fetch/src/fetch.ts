import { HTTPException } from "@bsport/http-exception";

import { getFullUri } from "./uri-management";
import {
  BACKGROUND_TASK_UUID_HEADER,
  type ResponseType,
  getCustomErrorCodes,
  getHeaders,
  getMessage,
} from "./utils";

/** @todo Add parameters to personalize the headers */
export function getFetch() {
  return async <T = string>(
    uri: string,
    init?: RequestInit & { responseType?: "text" | "json" | "buffer" | "blob" },
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
      } else if (responseType === "blob") {
        payload = await response.blob();
      } else {
        payload = await response.json();
      }
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const errorCodes = getCustomErrorCodes(
        payload?.error_code ?? payload?.errors_arrays,
      );
      throw new HTTPException({
        path: uri,
        name: payload?.code ?? errorCodes.join(";"),
        statusCode: payload?.statusCode ?? response?.status,
        customErrorCodes: errorCodes,
        message: getMessage(
          payload?.message ?? payload?.error_message ?? payload?.errors_arrays,
        ),
      });
    }

    return {
      data: payload as T,
      status: response.status,
      backgroundTaskUuid: response.headers.get(BACKGROUND_TASK_UUID_HEADER),
    };
  };
}

export type Fetch = ReturnType<typeof getFetch>;
