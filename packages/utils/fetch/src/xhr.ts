import { getFullUri, getHeaders } from "./utils";

export function getXhr() {
  return (
    uri: string,
    {
      headers,
      method,
      signal,
      onUploadProgress,
      formData,
    }: {
      formData?: FormData;
      headers?: Record<string, string>;
      method:
        | "GET"
        | "POST"
        | "HEAD"
        | "PUT"
        | "DELETE"
        | "CONNECT"
        | "OPTIONS"
        | "TRACE"
        | "PATCH";
      signal?: AbortSignal;
      onUploadProgress?: (progressEvent: ProgressEvent) => void;
    },
  ): Promise<unknown> => {
    const _headers = {
      ...getHeaders(),
      ...headers,
    };

    return new Promise((resolve, reject) => {
      // Doc : https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      const xhr = new XMLHttpRequest();

      // Open a {method} request
      xhr.open(method, getFullUri(uri));

      // Set custom headers
      Object.entries(_headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
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
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            reject(new Error("Failed to parse JSON response"));
          }
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      // Handle errors
      xhr.onerror = () => reject(new Error("An error occurred."));

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
