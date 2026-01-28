import { BACKGROUND_TASK_UUID_HEADER } from "@bsport/fetch";
import type { Fetch, Xhr } from "@bsport/store-base";
import { HTTPException } from "@bsport/store-base";

/**
 * Error response payload structure from the API
 */
interface ErrorPayload {
  error?: string;
  error_code?: number;
  code?: string;
  message?: string;
}

/**
 * Creates a fetch function that matches the @bsport/store-base Fetch type signature.
 * This function mimics the behavior of the real @bsport/fetch utility by creating
 * HTTPException with custom error codes extracted from API responses.
 *
 * @template T The expected response data type
 * @returns A function that matches the Fetch type from @bsport/store-base
 */
export function createTestFetch<T>(): Fetch<T> {
  return async (
    uri: string,
    init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
  ): Promise<{
    data: T;
    status: number;
    backgroundTaskUuid: string | null;
  }> => {
    return createTest<T>(uri, init);
  };
}

/**
 * Creates a fetch function that matches the @bsport/store-base Xhr type signature.
 * This function mimics the behavior of the real @bsport/fetch utility by creating
 * HTTPException with custom error codes extracted from API responses.
 *
 * @template T The expected response data type
 * @returns A function that matches the Xhr type from @bsport/store-base
 */
export function createTestXhr<T>(): Xhr<T> {
  return async (
    uri: string,
    init: RequestInit & {
      headers?: HeadersInit;
      signal?: AbortSignal;
      onUploadProgress?: (progressEvent: ProgressEvent) => void;
      formData?: FormData;
    },
  ): Promise<{
    data: T;
    status: number;
    backgroundTaskUuid: string | null;
  }> => {
    if (init.formData) {
      init.body = init.formData;
    }

    return createTest<T>(uri, init);
  };
}

async function createTest<T>(uri: string, init: RequestInit | undefined) {
  const response = await fetch(`http://localhost/${uri}`, init);

  let payload: ErrorPayload | T | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // Extract custom error codes from the response (mimics real fetch behavior)
    const customErrorCodes: number[] = [];
    if (payload && typeof payload === "object" && "error_code" in payload) {
      const errorCode = payload.error_code;
      if (typeof errorCode === "number") {
        customErrorCodes.push(errorCode);
      }
    }

    // Extract error message
    let message = "An error occured";
    if (payload && typeof payload === "object" && "error" in payload) {
      const error = payload.error;
      if (typeof error === "string") {
        message = error;
      }
    }

    throw new HTTPException({
      path: uri,
      name: "UNKNOWN",
      statusCode: response.status,
      customErrorCodes,
      message,
    });
  }

  const backgroundTaskUuid = response.headers.get(BACKGROUND_TASK_UUID_HEADER);

  // For 204 No Content responses, return undefined as data
  if (response.status === 204) {
    return {
      data: undefined as unknown as T,
      status: response.status,
      backgroundTaskUuid: backgroundTaskUuid,
    };
  }

  // For other responses, return the parsed data
  return {
    data: payload as T,
    status: response.status,
    backgroundTaskUuid: backgroundTaskUuid,
  };
}
