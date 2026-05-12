declare global {
  interface Window {
    Intercom?: (action: string) => void;
  }
}

export const openIntercomConversation = () => {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.Intercom !== "function") return;
    window.Intercom("showNewMessage");
  } catch (e) {
    console.error("Failed to open Intercom conversation", e);
  }
};
