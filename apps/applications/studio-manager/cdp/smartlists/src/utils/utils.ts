/**
 * Extracts a filename from a URL path (e.g. .../Campaign_export_2026-02-06.xlsx -> Campaign_export_2026-02-06.xlsx)
 */
function getFilenameFromUrl(
  url: string,
  fallback = "campaign-report.xlsx",
): string {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const segment = pathname.split("/").filter(Boolean).pop();
    return segment && segment.length > 0 ? segment : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Downloads a file from a URL. For cross-origin URLs (e.g. CDN), avoids fetch to prevent CORS
 * by using a hidden iframe so the browser triggers the download when the server sends
 * Content-Disposition: attachment. No new window is opened.
 */
export function downloadFileFromUrl(
  fileURL: string,
  options: { onSuccess?: () => void; onError?: () => void },
) {
  if (!fileURL) {
    console.warn("Provide a file URL to download.");
    return;
  }

  const urlOrigin = (() => {
    try {
      return new URL(fileURL, window.location.origin).origin;
    } catch {
      return null;
    }
  })();
  const isSameOrigin =
    urlOrigin !== null && urlOrigin === window.location.origin;

  if (isSameOrigin) {
    // Same origin: we can fetch and create a blob URL for a seamless download with our chosen filename
    fetch(fileURL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch file");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = getFilenameFromUrl(fileURL);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        options.onSuccess?.();
      })
      .catch((err) => {
        console.error("Download failed:", err);
        options.onError?.();
      });
    return;
  }

  // Cross-origin (e.g. CDN): avoid CORS by using a hidden iframe. The server should send
  // Content-Disposition: attachment so the browser starts the download without opening a new window.
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.onerror = () => {
    options.onError?.();
  };
  iframe.onload = () => {
    options.onSuccess?.();
  };
  document.body.appendChild(iframe);
  iframe.src = fileURL;
  // Remove iframe after a delay so the download has time to start
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 5000);
}
