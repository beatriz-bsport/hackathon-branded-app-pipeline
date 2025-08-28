import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";

// Ensure Node’s native BroadcastChannel is overridden
applyBroadcastChannelPolyfill(true);
