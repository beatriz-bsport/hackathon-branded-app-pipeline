import { type FileUploadStatus, UPLOAD_STATUSES } from "./constants";

/**
 * This functions aims to replicate axios post request with signal and onUploadProgress params.
 * It is equivalente to : axios.post(url, { headers, onUploadProgress, signal, body: formData});
 * It uses XMLHttpRequest instead of fetch because fetch can not use onprogress on formData (Readable Stream not compliant).
 */
async function _uploadFormDataWithUploadProgress(
  url: string,
  headers: Record<string, string>,
  formData: FormData,
  signal: AbortSignal,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Open a POST request
    xhr.open("POST", url);

    // Set custom headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onUploadProgress(event);
      }
    };

    // Handle request completion
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    // Handle errors
    xhr.onerror = () =>
      reject(new Error("An error occurred during the upload."));
    // Handle abort signal
    if (signal) {
      const abortHandler = () => {
        xhr.abort(); // Abort the request
        reject(new DOMException("Upload aborted by the user.", "AbortError"));
      };
      signal.addEventListener("abort", abortHandler);
      xhr.onloadend = () => {
        signal.removeEventListener("abort", abortHandler);
      };
    }

    // Send the FormData
    xhr.send(formData);
  });
}

/**
 * Make a post request on the Dev environment, trying to upload giftcard background pictures.
 * URL : https://backoffice.dev.bsport.io/giftcard/?isBackgroundImageUploaderOpen=true
 * Credentials : dev@bsport.io dev
 */
export async function simulateUploadToBackend(
  file: File,
  signal: AbortSignal,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
): Promise<{ status: FileUploadStatus; customMessage?: string }> {
  try {
    // Need to authenticate to retrieve a token
    const authResponse = await fetch(
      "https://api.dev.bsport.io/api/v1/authentication/signin/with-jwt-login/",
      {
        credentials: "omit",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-React-Referrer": "https://backoffice.dev.bsport.io/login",
        },
        referrer: "https://backoffice.dev.bsport.io/",
        body: '{"email":"dev@bsport.io","password":"dev"}',
        method: "POST",
      },
    );
    if (!authResponse.ok) {
      throw new Error(`HTTP error! status: ${authResponse.status}`);
    }
    const responseData = await authResponse.json();
    const token = responseData.token;

    // Generate formData to send the picture
    const formData = new FormData();
    formData.append("image", file);

    const postHeaders = {
      Accept: "application/json",
      Authorization: `Token ${token}`,
      "X-React-Referrer":
        "https://backoffice.dev.bsport.io/giftcard/?isBackgroundImageUploaderOpen=true",
    };
    try {
      await _uploadFormDataWithUploadProgress(
        "https://api.dev.bsport.io/api/v1/giftcard/giftcard_background_image/",
        postHeaders,
        formData,
        signal,
        onUploadProgress,
      );
      // If no issues, return success
      return {
        status: UPLOAD_STATUSES.success,
        customMessage: `Great, it worked ! ${Math.random()}`,
      };
    } catch (error) {
      console.error(error);
      if (signal.aborted) {
        // Log a signal to highlight that the upload error has been triggered by the user.
        console.log("Upload aborted successfully by the user");
        return {
          status: UPLOAD_STATUSES.error,
          customMessage: `Aborted by the user ! ${Math.random()}`,
        };
      }
      return {
        status: UPLOAD_STATUSES.error,
        customMessage: `An error happened during the upload ! ${Math.random()}`,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: UPLOAD_STATUSES.error,
      customMessage: `An error happened in the global action ! ${Math.random()}`,
    };
  }
}
