import { useEffect } from "react";

import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";

applyBroadcastChannelPolyfill();

const POLL_INTERVAL_MS = 30_000; // 30 seconds
const MAINTENANCE_LOCK_URL = "/maintenance.json";
const BROADCAST_CHANNEL_NAME = "bsport-maintenance";
const BROADCAST_MESSAGE = "activate";

async function isMaintenance(): Promise<boolean> {
  try {
    const res = await fetch(MAINTENANCE_LOCK_URL, {
      method: "HEAD",
      cache: "no-store",
    });
    // Also check content-type: CloudFront custom error responses convert
    // S3 403s (missing object) to 200 and serve index.html (text/html),
    // which would make res.ok true and incorrectly trigger maintenance.
    const isJson = (res.headers.get("content-type") ?? "").includes(
      "application/json",
    );
    return res.ok && isJson;
  } catch {
    return false;
  }
}

async function activateMaintenance(): Promise<void> {
  window.__MAINTENANCE_MODE__ = true;

  // Unregister service workers so they don't serve stale cached content
  // after index.html has been swapped for the maintenance page.
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister()));
  }
  window.location.href = "/maintenance.html";
}

/**
 * Polls for a `maintenance.json` marker file on the CDN.
 * When detected:
 * - sets `window.__MAINTENANCE_MODE__` so Sentry drops in-flight errors
 * - broadcasts to all other open tabs via BroadcastChannel so they
 *   redirect immediately without waiting for their own polling cycle
 * - unregisters service workers and navigates to `/maintenance.html`
 *
 * Renders nothing — mount this once at the app root.
 */
export function MaintenancePoller() {
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    // If another tab already detected maintenance, redirect immediately.
    channel.addEventListener("message", (event) => {
      if (event.data === BROADCAST_MESSAGE) {
        void activateMaintenance();
      }
    });

    const id = setInterval(async () => {
      const maintenance = await isMaintenance();
      if (maintenance) {
        clearInterval(id);
        channel.postMessage(BROADCAST_MESSAGE);
        channel.close();
        await activateMaintenance();
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(id);
      channel.close();
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    __MAINTENANCE_MODE__?: boolean;
  }
}
