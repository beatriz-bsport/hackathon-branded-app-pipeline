import {
  HTTPException,
  type ResponseType,
  getFullUri,
  getHeaders,
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
            const parsed = JSON.parse(responseText);
            resolve({ data: parsed as T, status });
          } catch (error) {
            reject(new Error("Failed to parse JSON response"));
          }
        } else {
          try {
            const parsed = JSON.parse(responseText);
            reject(
              new HTTPException(
                uri,
                parsed?.code ?? "UNKNOWN",
                parsed?.message ?? "Some error occurred",
                parsed?.statusCode ?? status,
              ),
            );
          } catch {
            reject(
              new HTTPException(
                uri,
                "UNKNOWN",
                "Failed request with invalid JSON",
                status,
              ),
            );
          }
        }
      };

      // Handle errors
      xhr.onerror = () =>
        reject(
          new HTTPException(uri, "NETWORK_ERROR", "An error occurred.", 0),
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
