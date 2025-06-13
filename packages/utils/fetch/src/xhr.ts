import { HTTPException } from "@bsport/http-exception";

import {
  BACKGROUND_TASK_UUID_HEADER,
  type ResponseType,
  getCustomErrorCodes,
  getFullUri,
  getHeaders,
  getMessage,
} from "./utils";

/** @todo Add parameters to personalize the headers */
export function getXhr() {
  return async <T = string>(
    uri: string,
    {
      headers,
      method = "GET",
      signal,
      onUploadProgress,
      formData,
    }: {
      formData?: FormData;
      headers?: HeadersInit;
      method?: RequestInit["method"];
      signal?: AbortSignal;
      onUploadProgress?: (progressEvent: ProgressEvent) => void;
    },
  ): Promise<ResponseType<T>> => {
    const _headers = getHeaders(headers);

    return new Promise<ResponseType<T>>((resolve, reject) => {
      // Doc : https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      const xhr = new XMLHttpRequest();

      // Open a {method} request before sending data
      xhr.open(method, getFullUri(uri));

      // Set custom headers
      Object.entries(_headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
      });

      // Track upload progress
      if (onUploadProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onUploadProgress?.(event);
          }
        };
      }

      // Handle request completion
      xhr.onload = () => {
        const status = xhr.status;
        const responseText = xhr.responseText;

        if (status >= 200 && status < 300) {
          try {
            const parsed =
              responseText.length > 0 ? JSON.parse(responseText) : {};

            const backgroundTaskUuid = xhr.getResponseHeader(
              BACKGROUND_TASK_UUID_HEADER,
            );

            resolve({ data: parsed as T, status, backgroundTaskUuid });
          } catch (error) {
            reject(
              new HTTPException({
                path: uri,
                message: "Failed to parse JSON response",
                statusCode: status,
              }),
            );
          }
        } else {
          try {
            const parsed =
              responseText.length > 0 ? JSON.parse(responseText) : {};
            const errorCodes = getCustomErrorCodes(
              parsed?.error_code ?? parsed?.errors_arrays ?? parsed,
            );
            reject(
              new HTTPException({
                path: uri,
                name: errorCodes.join(";"),
                statusCode: parsed?.statusCode ?? status,
                message: getMessage(
                  parsed?.message ??
                    parsed?.error_message ??
                    parsed?.errors_arrays,
                ),
                customErrorCodes: errorCodes,
              }),
            );
          } catch {
            reject(
              new HTTPException({
                path: uri,
                message: "Failed request with invalid JSON",
                statusCode: status,
              }),
            );
          }
        }
      };

      // Handle errors
      xhr.onerror = () =>
        reject(
          new HTTPException({
            path: uri,
            name: "NETWORK_ERROR",
            message: "An XHR error occured",
            statusCode: 500,
          }),
        );

      // Handle abort signal
      if (signal) {
        const abortHandler = () => {
          xhr.abort(); // Abort the request
          reject(
            new DOMException("Request aborted by the user.", "AbortError"),
          );
        };
        signal.addEventListener("abort", abortHandler);
        xhr.onloadend = () => {
          signal.removeEventListener("abort", abortHandler);
        };
      }

      // Send the FormData
      xhr.send(formData);
    });
  };
}

export type Xhr = ReturnType<typeof getXhr>;
