import { useState, useEffect } from 'react';
import Config from '#src/config';

type Listener = (value: boolean) => void;

declare global {
  interface Window {
    __REVAMPED__?: boolean;
    __REVAMPED__listeners: Listener[];
    __REVAMPED__isObserved?: boolean;
  }
}

// Only install the getter/setter once per page
// Use a module-level variable to track listeners
window.__REVAMPED__listeners = window.__REVAMPED__listeners || [];

// Install getter/setter if not already installed
if (!window.__REVAMPED__isObserved) {
  let value = window.__REVAMPED__;

  Object.defineProperty(window, '__REVAMPED__', {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(newVal) {
      value = newVal;
      window.__REVAMPED__listeners.forEach((fn) => fn(newVal));
    },
  });

  window.__REVAMPED__isObserved = true;
}

export const useShowRevampedSidebarWithTrick = () => {
  const [showRevamped, setShowRevamped] = useState(false);

  useEffect(() => {
    const listener: Listener = (val) => setShowRevamped(Boolean(val));
    window.__REVAMPED__listeners.push(listener);
    // Sync in case value changed before effect ran
    setShowRevamped(Boolean(window.__REVAMPED__));

    return () => {
      const listeners = window.__REVAMPED__listeners;
      const idx = listeners.indexOf(listener);

      if (idx !== -1) {
        listeners.splice(idx, 1);
      }
    };
  }, []);

  return showRevamped;
};

/**
 * Return whether the revamped navigation sidebar should be displayed, base on DB data or cheat code.
 * @param enabledForUser Whether the revamp is enabled at the user level. Can be extracted from props.revampedBackofficeEnabled
 * @param enabledInTheme Whether the revamp is enabled at the company theme level. Can be extracted from props.theme.revamped_backoffice_enabled
 */
export const useShowRevampedSidebar = ({
  enabledForUser,
  enabledInTheme,
}: {
  enabledForUser: boolean;
  enabledInTheme: boolean;
}) => {
  const showRevampedCheatCode =
    useShowRevampedSidebarWithTrick() &&
    !['production', 'staging'].includes(Config.REACT_APP_SENTRY_ENVIRONMENT);

  return (enabledForUser && enabledInTheme) || showRevampedCheatCode;
};
