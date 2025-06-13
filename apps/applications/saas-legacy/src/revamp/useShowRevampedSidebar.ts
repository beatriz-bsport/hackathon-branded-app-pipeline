import { useState, useEffect } from 'react';

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

export const useShowRevampedSidebar = () => {
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
