import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";

import { getEnv } from "@bsport/envs";

import {
  debugLog,
  loadAppcuesScript,
  removeAppcuesScripts,
} from "./appcues-scripts";

export type AppcuesTagProps = {
  companyId?: number;
  companyRole?: number;
  email?: string;
  franchiseId?: number;
  franchiseRole?: number;
  userId: number | null | undefined;
  username: string | null | undefined;
};

/**
 * Appcues integration for studio-manager host.
 * Loads the Appcues script and identifies the user only when:
 * - User id and username are available
 * - Production environment
 * - Not already instantiated for this user
 * Uses refs and memoization so it does not run on every re-render.
 * Cleans up SDK on unmount and page unload.
 */
export function AppcuesTag({
  companyId,
  companyRole,
  email,
  franchiseId,
  franchiseRole,
  userId,
  username,
}: AppcuesTagProps) {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);
  const identifiedUserIdRef = useRef<string | null>(null);

  const isValidEnvironment = ["production"].includes(getEnv());

  const shouldEnableAppcues = useMemo(
    () => Boolean(userId != null && username && isValidEnvironment),
    [userId, username, isValidEnvironment],
  );

  const userPayload = useMemo(() => {
    if (!shouldEnableAppcues || userId == null || !username) return null;
    return {
      user_id: String(userId),
      email,
      username,
      companyRole,
      franchiseRole,
      company_id: companyId,
      franchise_id: franchiseId,
    };
  }, [
    shouldEnableAppcues,
    userId,
    username,
    companyRole,
    franchiseRole,
    companyId,
    franchiseId,
    email,
  ]);

  useEffect(() => {
    if (!shouldEnableAppcues) {
      identifiedUserIdRef.current = null;
      return;
    }
    if (!userPayload) return;

    const _userId = userPayload.user_id;

    if (identifiedUserIdRef.current === _userId) {
      return;
    }

    loadAppcuesScript()
      .then(() => {
        if (typeof window === "undefined" || !window.Appcues) {
          return;
        }
        const { user_id: _, ...traits } = userPayload;
        const traitsForAppcues: Record<string, string | number | boolean> = {};
        for (const [key, value] of Object.entries(traits)) {
          if (
            value !== undefined &&
            value !== null &&
            typeof value !== "object" &&
            typeof value !== "function"
          ) {
            traitsForAppcues[key] = value as string | number | boolean;
          }
        }
        if (window.Appcues?.identify) {
          window.Appcues.identify(_userId, traitsForAppcues);
          identifiedUserIdRef.current = _userId;
          debugLog("[AppcuesTag] DebugLog - user identified");
        } else {
          console.error("[AppcuesTag] - Appcues script failed to load.");
        }
      })
      .catch(() => {
        // Script failed to load (e.g. adblocker) – app continues normally
      });
  }, [shouldEnableAppcues, userPayload]);

  useEffect(() => {
    if (!shouldEnableAppcues) {
      return;
    }

    const path = location.pathname + location.search;

    if (lastPathRef.current === path) {
      return;
    }

    lastPathRef.current = path;

    if (typeof window !== "undefined" && window.Appcues?.page) {
      debugLog("[AppcuesTag] DebugLog - page navigation detected");
      window.Appcues?.page?.();
    }
  }, [location.pathname, location.search, shouldEnableAppcues]);

  useEffect(() => {
    const handlePageUnload = () => removeAppcuesScripts();
    window.addEventListener("beforeunload", handlePageUnload);

    return () => {
      window.removeEventListener("beforeunload", handlePageUnload);
      removeAppcuesScripts();
    };
  }, []);

  return null;
}
