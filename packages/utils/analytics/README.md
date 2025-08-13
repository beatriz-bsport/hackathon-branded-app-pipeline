# Analytics package

Abstract the complexity of integrating and managing analytics across multiple platforms. This package provides a developer-friendly interface that simplifies the emission of analytics events while ensuring consistency, observability, and traceability of those events.

## Installation

Add `@bsport/analytics` to your project dependencies :

```json
{
  "dependencies": {
    "@bsport/analytics": "workspace:*"
    // other dependencies...
  }
}
```

## Default usage

### Step 1 - Init and configure your analytics client

Initialize an analytics client object. It will use by default Mixpanel.

:warning: Make sure to enforce the typing of your analytics object with `AnalyticsClientInterface`, because of typing inference limitations.

```tsx
import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from "@bsport/analytics";

export const analytics: AnalyticsClientInterface = new AnalyticsClient({
  debug: true, // Agnostic debug, internal to the object
});
```

If the object has not been configured, you might need to call

```tsx
analytics.configure();
```

### Step 2 - Inject the event in the track method of your analytics client

```tsx
import { addButtonClickEvent } from "#src/events/some-file.ts";
import { analytics } from "#src/utils/analytics";

const MyButton = () => {
  const onClick = () => {
    // Do something

    analytics.track({
      eventType: "button_clicked",
      page: "my_current_url",
      id: 5,
    });
  };
  return <button onClick={onClick} />;
};
```

## Custom analytics tool

You might need to use a different tool than Mixpanel browser for your analytics desires. Though, you still need to use the `AnalyticsClient` to ensure consistent usage over our frontend codebases.

When creating your `AnalyticsClient` object, you can provide an `adapter` that follows the `AnalyticsAdapter` interface.

```tsx
import { AnalyticsClient, type AnalyticsClientInterface, type AnalyticsAdapter } from "@bsport/analytics";

// This is a mock of another analytics tool : Google Analytics, Mixpanel react native sdk
const customAdapter: AnalyticsAdapter = {
  configure: (config) => {
    console.log("Do something with ", config);
  },
  identify: ({ userId, traits }) => {
    console.log("Do something with ", userId, traits);
  },
  flush: () => {
    return Promise.resolve(console.log("Do something with events"));
  },
  track: (event) => {
    console.log("Do smth with the event: ", event);
  },
  // etc...
};

const analytics: AnalyticsClientInterface = new AnalyticsClient({ adapter: customAdapter });

analytics.configure({...});
```

You can use two tools at the same time, they will be isolated one from the other :

```tsx
const analyticsWithMixpanel: AnalyticsClientInterface = new AnalyticsClient();

const analyticsWithOtherTool: AnalyticsClientInterface = new AnalyticsClient({
  adapter: customAdapter,
});

analyticsWithOtherTool.configure({}); // It won't have side effects on analyticsWithMixpanel
```

## :warning: Singleton Considerations

When talking about singleton in the context of this analytics package, there are two different meanings depending on the scope:

### 1. Singleton at the dependency level (Module Federation / MFE)

In a micro-frontend architecture, a "singleton" often means sharing the same dependency instance across all MFEs so that:

- Only one copy of the analytics SDK (e.g., Mixpanel) is loaded in the browser.
- Configuration (e.g., mixpanel.init) is applied once and used everywhere.
- Events sent from any MFE go through the same underlying analytics client.

This is typically achieved via Module Federation's `singleton: true` configuration and is important for ensuring consistent tracking across MFEs.

### 2. Singleton at the code instance level

In application code, a singleton would mean only one AnalyticsClient instance exists in your runtime.

We do not enforce this in the current implementation:

- You can create multiple AnalyticsClient instances.
- Internally, these instances share the same underlying Mixpanel instance by default.
- This allows you to:
  - Keep agnostic, instance-level super properties (stored in AnalyticsClient, not Mixpanel) to differentiate between MFEs or contexts.
  - Maintain domain-specific isolation between MFEs while still benefiting from a shared Mixpanel connection.

### 3. Special cases

Some applications have different tracking scopes requiring different Mixpanel projects/tokens.
Example: saas-legacy has B2B and B2C parts using different tokens.

Options:

- Single Mixpanel instance: Configure once with the correct token based on app scope (less isolation, simpler).
- Multiple Mixpanel instances: Call `mixpanel.init(token, config, "instanceName")` for each scope and explicitly track events with the correct instance — ensures no cross-scope interference. :warning: This is not ready yet with the current AnalyticsClient interface.

### 4. Best practices

- Configure once per scope (e.g., once in the host MFE for revamped BO).
- Document where configure is called — calling it multiple times with different tokens can lead to unclear behavior.
- For multi-scope apps (B2B/B2C), consider multiple named Mixpanel instances for clarity and safety (incoming).
- Always reset the Mixpanel client on logout if switching to a radically different user or scope.
