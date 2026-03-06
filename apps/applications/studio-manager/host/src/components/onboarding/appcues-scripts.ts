import { getEnv } from "@bsport/envs";

const APPCUES_ACCOUNT_ID = "223986";
const APPCUES_SCRIPT_SRC = `https://fast.appcues.com/${APPCUES_ACCOUNT_ID}.js`;
const APPCUES_SCRIPT_MARKER = "data-appcues-injected";
const APPCUES_INIT_TIMEOUT_MS = 10000;
const APPCUES_POLL_INTERVAL_MS = 50;

let appcuesPromise: Promise<void> | null = null;

export function debugLog(message: string) {
  if (getEnv() !== "production") {
    console.log(message);
  }
}

/**
 * Loads the Appcues SDK script and initializes the Appcues SDK.
 * @returns A promise that resolves when the Appcues script is loaded and the Appcues SDK is initialized.
 */

export function loadAppcuesScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Appcues) return Promise.resolve();
  if (appcuesPromise) return appcuesPromise;

  appcuesPromise = new Promise((resolve, reject) => {
    injectAppcuesScripts({
      onLoad: () => waitForAppcues(resolve, reject),
      onError: () => {
        appcuesPromise = null;
        reject(new Error("Appcues script failed to load"));
      },
    });
  });

  return appcuesPromise;
}

function waitForAppcues(
  resolve: () => void,
  reject: (err: Error) => void,
): void {
  const startedAt = Date.now();

  const check = () => {
    if (window.Appcues) {
      resolve();
    } else if (Date.now() - startedAt > APPCUES_INIT_TIMEOUT_MS) {
      appcuesPromise = null;
      reject(new Error("Appcues SDK initialization timeout"));
    } else {
      setTimeout(check, APPCUES_POLL_INTERVAL_MS);
    }
  };

  check();
}

function injectAppcuesScripts({
  onLoad,
  onError,
}: {
  onLoad: () => void;
  onError: () => void;
}): void {
  const settingsScript = document.createElement("script");
  settingsScript.type = "text/javascript";
  settingsScript.textContent =
    "window.AppcuesSettings = { enableURLDetection: true };";
  settingsScript.setAttribute(APPCUES_SCRIPT_MARKER, "true");

  const script = document.createElement("script");
  script.src = APPCUES_SCRIPT_SRC;
  script.async = true;
  script.setAttribute(APPCUES_SCRIPT_MARKER, "true");
  script.onload = onLoad;
  script.onerror = onError;

  document.head.append(settingsScript, script);
}

/**
 * Removes the Appcues SDK from the page: resets state, removes injected scripts,
 * and clears window.Appcues / window.AppcuesSettings.
 */
export function removeAppcuesScripts(): void {
  if (typeof window === "undefined") return;

  try {
    if (window.Appcues?.reset) {
      debugLog("[AppcuesScripts] DebugLog - resetting Appcues session");
      window.Appcues?.reset?.();
    }
  } catch {
    console.error("Failed to reset Appcues session");
  }

  document
    .querySelectorAll(`script[${APPCUES_SCRIPT_MARKER}="true"]`)
    .forEach((el) => el.remove());

  (window as unknown as Record<string, unknown>).Appcues = undefined;
  (window as unknown as Record<string, unknown>).AppcuesSettings = undefined;
  appcuesPromise = null;
}
