import { getFullUri, getHeaders } from "./utils";

type ResponseType<T> = {
  data: T;
  status: number;
};

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

// TODO : Add inputs for getFetch to personalize the fetch method
// depending on the consuming application
export function getFetch() {
  return async <T = string>(
    uri: string,
    init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
  ): Promise<ResponseType<T>> => {
    const response = await fetch(getFullUri(uri), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
        ...init?.headers,
      },
    });

    let payload = null;

    try {
      payload = await (init?.responseType === "text"
        ? response.text()
        : init?.responseType === "buffer"
          ? response.arrayBuffer()
          : response.json());
    } catch (e) {
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
