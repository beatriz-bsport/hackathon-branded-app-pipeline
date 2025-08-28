import type { Dispatch, SetStateAction } from "react";

import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";
import { Toggle } from "@bsport/kaizen-primitive-core";

applyBroadcastChannelPolyfill();

const ANALYTICS_CHANNEL = "bsport:channel:analytics";
const ANALYTICS_ACTION_SWITCH_DEBUG_MODE = "ANALYTICS_ACTION_SWITCH_DEBUG_MODE";

const AnalyticsMessageBus = {
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
};

export const AnalyticsDebugToggle = ({
  debugMode,
  setDebugMode,
}: {
  debugMode: boolean;
  setDebugMode: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Toggle
      id="analytics-debug-toggle"
      checked={debugMode}
      label="Analytics Debug"
      onChange={() => {
        setDebugMode((prev) => {
          AnalyticsMessageBus.send(!prev);
          return !prev;
        });
      }}
    />
  );
};
