import { EventPayload } from "./types";

const DEBUG = false;

export const debugLog = (message: string, ...args: unknown[]) =>
  DEBUG && console.debug(`[BRIDGE PROXY] ${message}`, ...args);

export const postMessageToParent = (payload: EventPayload) => {
  debugLog("Sending message to parent", payload);
  const parentElement = window.opener ?? window.parent;
  parentElement.postMessage(payload, "*");
};

export const listenOnMessage = (listener: (payload: EventPayload) => void) => {
  debugLog("Listening for messages");
  window.addEventListener("message", ({ data: payload }) => {
    debugLog("Received message", payload);
    listener(payload);
  });
  return listener;
};

export const clearReduxStore = () => {
  localStorage.removeItem("persist:root");
};
