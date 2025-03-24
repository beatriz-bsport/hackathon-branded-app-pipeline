interface BroadcastChannelEventListener {
  (event: { data: unknown }): void;
}

const STORAGE_KEY_PREFIX = "__broadcastChannel_";
const CUSTOM_EVENT_PREFIX = "__broadcastChannelEvent_";

class BroadcastChannelPolyfill {
  listeners: BroadcastChannelEventListener[];
  channelName: string;
  eventName: string;

  private storageListener(event: StorageEvent): void {
    if (event.key === this.channelName && event.newValue) {
      const message = JSON.parse(event.newValue);
      this.listeners.forEach((listener) => listener({ data: message }));
    }
  }

  private customEventListener(event: CustomEvent): void {
    if (event.detail && event.detail.channelName === this.channelName) {
      this.listeners.forEach((listener) =>
        listener({ data: event.detail.message }),
      );
    }
  }

  constructor(channelName: string) {
    this.listeners = [];
    this.channelName = STORAGE_KEY_PREFIX + channelName;
    this.eventName = CUSTOM_EVENT_PREFIX + channelName;

    this.storageListener = this.storageListener.bind(this);
    this.customEventListener = this.customEventListener.bind(this);

    window.addEventListener("storage", this.storageListener);
    window.addEventListener(
      this.eventName,
      this.customEventListener as EventListener,
    );
  }

  postMessage(message: unknown): void {
    // For cross-tab communication: use localStorage
    // The storage event only fires in other windows/tabs, not in the current one
    localStorage.setItem(this.channelName, JSON.stringify(message));
    localStorage.removeItem(this.channelName);

    // For same-tab communication: dispatch a custom event
    const event = new CustomEvent(this.eventName, {
      detail: {
        channelName: this.channelName,
        message: message,
      },
    });
    window.dispatchEvent(event);
  }

  addEventListener(
    type: string,
    listener: BroadcastChannelEventListener,
  ): void {
    if (type === "message") {
      this.listeners.push(listener);
    }
  }

  removeEventListener(
    type: string,
    listener: BroadcastChannelEventListener,
  ): void {
    if (type === "message") {
      this.listeners = this.listeners.filter((current) => current !== listener);
    }
  }

  close(): void {
    this.listeners = [];
    window.removeEventListener("storage", this.storageListener);
    window.removeEventListener(
      this.eventName,
      this.customEventListener as EventListener,
    );
  }
}

/**
 * Applies the BroadcastChannel polyfill if the native implementation doesn't exist
 *
 * Current limitations:
 * - Only works in the main thread
 * - Only works in the same domain, origin and protocol
 * - Only accepts data that is serializable
 *
 * @returns true if the polyfill was applied, false otherwise
 * @param force - whether to apply the polyfill even if the native implementation exists
 */
export function applyBroadcastChannelPolyfill(force = false): boolean {
  const global = typeof window !== "undefined" ? window : globalThis;

  if (!global.BroadcastChannel || force) {
    global.BroadcastChannel =
      BroadcastChannelPolyfill as unknown as typeof BroadcastChannel;
    return true;
  }

  return false;
}
