import { useEffect, useMemo, useRef } from 'react';
import Config from '#src/config';
import { useLocation } from 'react-router';
import {
  debugLog,
  loadAppcuesScript,
  removeAppcuesScripts,
} from './appcues-scripts';

export type AppcuesTagProps = {
  userId: number;
  isManager: boolean;
  email?: string;
  username?: string;
  companyRole?: number;
  franchiseRole?: number;
  companyId?: number;
  franchiseId?: number;
};

/**
 * One-off Appcues integration for saas-legacy.
 * Loads the Appcues script and identifies the user only when:
 * - User is a manager
 * - User id is available
 * - Production environment
 * - Not already instantiated for this user
 * Uses refs and memoization so it does not run on every re-render.
 * Cleans up SDK on unmount and page unload.
 */
export const AppcuesTag: React.FC<AppcuesTagProps> = ({
  userId,
  companyRole,
  franchiseRole,
  isManager,
  companyId,
  franchiseId,
  email,
  username,
}: AppcuesTagProps) => {
  const location = useLocation();
  const lastPathRef = useRef<string>();

  const isValidEnvironment = ['production'].includes(
    Config.REACT_APP_SENTRY_ENVIRONMENT,
  );
  const identifiedUserIdRef = useRef<string | null>(null);

  const shouldEnableAppcues = useMemo(
    () =>
      Boolean(isManager && userId != null && username && isValidEnvironment),
    [isManager, userId, username, isValidEnvironment],
  );

  // Prepare user payload for Appcues
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

  // Identify user and load Appcues script
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
        if (typeof window === 'undefined' || !window.Appcues) {
          console.warn('[AppcuesTag] Appcues SDK not available.');
          return;
        }
        const { user_id: _, ...traits } = userPayload;
        const traitsForAppcues: Record<string, string | number | boolean> = {};
        for (const [key, value] of Object.entries(traits)) {
          if (
            value !== undefined &&
            value !== null &&
            typeof value !== 'object' &&
            typeof value !== 'function'
          ) {
            traitsForAppcues[key] = value as string | number | boolean;
          }
        }
        if (window.Appcues?.identify) {
          window.Appcues.identify(_userId, traitsForAppcues);
          identifiedUserIdRef.current = _userId;
          debugLog('[AppcuesTag] DebugLog - user identified');
        } else {
          console.error('[AppcuesTag] - Appcues script failed to load.');
        }
      })
      .catch(() => {
        console.warn('[AppcuesTag] Appcues script failed to load.');
      });
  }, [shouldEnableAppcues, userPayload]);

  // Track page view
  useEffect(() => {
    if (!shouldEnableAppcues) {
      return;
    }

    const path = location.pathname + location.search;

    if (lastPathRef.current === path) {
      return;
    }

    lastPathRef.current = path;

    if (typeof window !== 'undefined' && window.Appcues?.page) {
      debugLog('[AppcuesTag] DebugLog - page navigation detected');
      window.Appcues.page();
    }
  }, [location.pathname, location.search, shouldEnableAppcues]);

  // Reset Appcues session and remove scripts on page unload
  useEffect(() => {
    const handlePageUnload = () => removeAppcuesScripts();
    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
      removeAppcuesScripts();
    };
  }, []);

  return null;
};
