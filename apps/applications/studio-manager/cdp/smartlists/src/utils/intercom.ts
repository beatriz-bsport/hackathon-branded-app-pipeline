declare global {
  interface Window {
    Intercom?: (action: string) => void;
  }
}

/**
 * Open a new Intercom conversation (e.g. for Account Manager contact).
 * Safe to call when Intercom is not loaded.
 */
export const openIntercomConversation = () => {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.Intercom !== "function") {
      if (import.meta.env?.DEV) {
        // eslint-disable-next-line no-console
        console.log(
          "[Intercom] openIntercomConversation – Intercom not available",
        );
      }
      return;
    }
    window.Intercom("showNewMessage");
  } catch (e) {
    console.error("Failed to open new Intercom conversation", e);
  }
};
