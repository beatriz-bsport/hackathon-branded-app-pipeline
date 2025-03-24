# Broadcast Channel Polyfill

A polyfill for the Broadcast Channel API. It is a simple implementation of the Broadcast Channel API using the storage event for cross-tab communication and custom events for same-tab communication. **This is not a full implementation of the Broadcast Channel API**, but it is a simple and effective polyfill for the most common use cases we have in our applications.

**Why the storage event?**
The storage event is particularly useful for creating a synchronized experience across multiple tabs or windows of the same application and it is widely supported across all browsers.

**Why custom events?**
Custom events are used for same-tab communication. They are also widely supported across all browsers.

## Installation

Add `@bsport/broadcast-channel-polyfill` to your project dependencies :

```json
{
  "dependencies": {
    "@bsport/broadcast-channel-polyfill": "workspace:*"
    // other dependencies...
  }
}
```

## How to use

```ts
import { applyBroadcastChannelPolyfill } from "@bsport/broadcast-channel-polyfill";

applyBroadcastChannelPolyfill();
```

In case you want to force the polyfill to be applied even if the native implementation exists, you can pass `true` as the second argument:

```ts
applyBroadcastChannelPolyfill(true);
```

Note this can be a good way to be sure your system works with our custom polyfill when native Broadcast channel is not available.

### Post and listen messages

```ts
const CHANNEL_NAME = "bsport:action-to-propagate";
const ACTION_NAME = "do-something";

export const postAMessage = (args: ...) => {
  const broadcast = new BroadcastChannel(CHANNEL_NAME);
  broadcast.postMessage({
    action: ACTION_NAME,
    payload: { ... something based on args },
    ... anything you want, should be JSON serializable
  });
  // Once the message sent, we don't need the instance anymore
  broadcast.close();
}

export const somethingThatNeedsToListen = () => {
  ...
  // Init a listener
  const broadcast = new BroadcastChannel(CHANNEL_NAME);
  broadcast.addEventListener("message", (event) => {
    const { action, payload, ...other stuff } = event.data;
    if (action === ACTION_NAME){
      // Do something based on the payload or other data sent by the emitter
    }
  });
}
```
