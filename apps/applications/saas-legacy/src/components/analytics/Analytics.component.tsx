import React, { useEffect } from 'react';

import TagManager from 'react-gtm-module';

import type { CompanyTheme } from '#src/libs/theme/types';
import { removeItemInStorage, setItemInStorage } from '#src/utils/storage';
import {
  BLACKLIST_META_PIXEL_EVENT_LISTS,
  META_PIXEL_ID_STORAGE_KEY,
} from './constants';
import { removeTrackingScripts } from './utils';

type Props = {
  theme: CompanyTheme;
  isInternal?: boolean;
};

const Analytics: React.FC<Props> = ({ theme, isInternal }) => {
  /**
   * Initializes proxy wrappers for the Meta Pixel event functions (fbq and _fbq) to block specific events.
   *
   * This function does the following:
   * - Uses React's useCallback hook to memoize the function so that it isn't recreated on every render.
   * - Checks if the global 'fbq' function exists on the window object.
   *   - If it exists, it replaces it with a Proxy that intercepts any calls to 'fbq'.
   *   - In the Proxy's 'apply' trap (which intercepts function calls), it checks if the second argument (usually the event name)
   *     is included in the BLACKLIST_META_PIXEL_EVENT_LISTS.
   *   - If the event name is blacklisted, the call is ignored (the function returns without executing).
   *   - Otherwise, it calls the original 'fbq' function with the provided arguments.
   * - Repeats the same process for the global '_fbq' function.
   */ /**
   * Initializes proxy wrappers for the Meta Pixel event functions (fbq and _fbq) to block specific events.
   *
   * This function does the following:
   * - Uses React's useCallback hook to memoize the function so that it isn't recreated on every render.
   * - Checks if the global 'fbq' function exists on the window object.
   *   - If it exists, it replaces it with a Proxy that intercepts any calls to 'fbq'.
   *   - In the Proxy's 'apply' trap (which intercepts function calls), it checks if the second argument (usually the event name)
   *     is included in the BLACKLIST_META_PIXEL_EVENT_LISTS.
   *   - If the event name is blacklisted, the call is ignored (the function returns without executing).
   *   - Otherwise, it calls the original 'fbq' function with the provided arguments.
   * - Repeats the same process for the global '_fbq' function.
   */
  const initFBQProxyToBlackListEvent = React.useCallback(() => {
    // Check if 'fbq' exists on the window object before proxying it.
    if (window?.fbq) {
      // Replace the original fbq function with a Proxy to intercept calls.
      window.fbq = new Proxy(window.fbq, {
        // The 'apply' trap intercepts function calls to fbq.
        apply(target, thisArg, argumentsList) {
          // Check if the second argument (event name) is in the blacklist.
          if (BLACKLIST_META_PIXEL_EVENT_LISTS.includes(argumentsList[1])) {
            // If the event is blacklisted, do nothing (block the event).
            return;
          }
          // If not blacklisted, call the original fbq function with the given context and arguments.
          return target.apply(thisArg, argumentsList);
        },
      });
    }

    // Check if '_fbq' exists on the window object before proxying it.
    if (window._fbq) {
      // Replace the original _fbq function with a Proxy to intercept calls.
      window._fbq = new Proxy(window._fbq, {
        // The 'apply' trap intercepts function calls to _fbq.
        apply(target, thisArg, argumentsList) {
          // Check if the second argument (event name) is in the blacklist.
          if (BLACKLIST_META_PIXEL_EVENT_LISTS.includes(argumentsList[1])) {
            // If the event is blacklisted, do nothing (block the event).
            return;
          }
          // If not blacklisted, call the original _fbq function with the given context and arguments.
          return target.apply(thisArg, argumentsList);
        },
      });
    }
  }, []); // The empty dependency array ensures this function is created only once.)

  const init = React.useCallback(() => {
    if (!theme) {
      return;
    }

    const gtmId = isInternal ? 'GTM-W4G3NQ6' : theme.gtmId;
    const facebookPixelId = isInternal
      ? '515094402731005'
      : theme.facebookPixelId;

    // We are setting the meta pixel id here in the session storage so that we can access it in the analytics utils sender
    setItemInStorage(
      'session',
      META_PIXEL_ID_STORAGE_KEY,
      facebookPixelId || 'undefined',
    );
    if (facebookPixelId) {
      setTimeout(() => {
        window.fbq('init', facebookPixelId, {
          /**
           * Base config to disabled PageView events but is not sufficient to block everything
           */
          autoConfig: false,
          disablePushState: true,
        });
      }, 500);
    }
    if (gtmId) {
      try {
        TagManager.initialize({
          gtmId,
        });
      } catch (err) {
        console.error(err);
      }
    }
    // Init the proxy for blacklisted base events in case we have a hijacked pixel id from another studio
    initFBQProxyToBlackListEvent();
  }, [theme, isInternal, initFBQProxyToBlackListEvent]);

  useEffect(() => {
    init();
    return () => {
      /**
       * We are cleaning the meta pixel id in the session storage here so
       * that we avoid keeping it in the same session of an other studio
       * (low chance as sessionStorage is managed through tabs but lets
       * be cautious with it)
       *  */
      removeTrackingScripts();
      removeItemInStorage('session', META_PIXEL_ID_STORAGE_KEY);
    };
  }, [init]);

  return null;
};

export default React.memo(Analytics);
