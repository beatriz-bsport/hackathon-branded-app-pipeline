import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";

applyBroadcastChannelPolyfill();

export const ANALYTICS_CHANNEL = "bsport:channel:analytics";

export const ANALYTICS_ACTION_SWITCH_DEBUG_MODE =
  "ANALYTICS_ACTION_SWITCH_DEBUG_MODE";

export const AnalyticsMessageBus = {
  /**
   * Post a message to the analytics debug switcher broadcast channel to tell
   * all AnalyticsClienti instances to change their debug mode base on the debug value
   * @param debug Whether to activate the debug mode
   */
  send: (debug: boolean = false) => {
    const broadcast = new BroadcastChannel(ANALYTICS_CHANNEL);

    broadcast.postMessage({
      action: ANALYTICS_ACTION_SWITCH_DEBUG_MODE,
      payload: debug,
    });

    broadcast.close();
  },

  /**
   * Listen to messages from the analytics debug switcher broadcast channel
   * @param handleReceive Action to do when receiving a switch message
   */
  subscribe: (handleReceive: (debug: boolean) => void) => {
    const broadcast = new BroadcastChannel(ANALYTICS_CHANNEL);

    broadcast.addEventListener("message", (event) => {
      const { action, payload } = event.data;
      if (action === ANALYTICS_ACTION_SWITCH_DEBUG_MODE) {
        handleReceive(payload);
      }
    });
  },
};
