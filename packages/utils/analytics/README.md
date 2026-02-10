# Analytics package

Abstract the complexity of integrating and managing analytics across multiple platforms. This package provides a developer-friendly interface that simplifies the emission of analytics events while ensuring consistency, observability, and traceability of those events.

## Installation

Add `@bsport/analytics` to your project dependencies :

```jsonc
{
  "dependencies": {
    "@bsport/analytics": "workspace:*",
    // other dependencies...
  },
}
```

## Default usage

### Step 1 - Init and configure your analytics client

Initialize an analytics client object. By default, it uses Mixpanel.

:warning: Make sure to enforce typing of your analytics object with `AnalyticsClientInterface` due to type inference limitations.

```tsx
import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from "@bsport/analytics";

export const analytics: AnalyticsClientInterface = new AnalyticsClient({
  internalDebug: true, // Agnostic debug, internal to the object
});

// Toggle internal debug mode at runtime when needed:
analytics.setInternalDebugMode(true);
```

If the object has not been configured in your frontend architecture, you might need to call

```tsx
import { analytics } from "#src/utils/analytics";

analytics.configure({
  token: import.meta.env.VITE_MIXPANEL_B2C_TOKEN,
  env: import.meta.env.MODE,
});
```

### Step 2 - Define your event schema and function

Define your event with Zod and the `generateEvent` helper.

Rules:

- In order to be detected by the extractor script, your application should contain a `#src/events/register.ts` file.
- Your events schema can be defined anywhere, but should be exported inside the register file.
- Your Zod Schema must contain an eventType: `eventType: z.string().default("my_event_name")`.
- Your Zod Schema should contain a description: `z.object({}).describe("My event description")`.
- All your properties must be set in the Zod Schema, with a description: `myProperty: z.number().describe("property description")`
  The descriptions on the Zod Schema replace the JSDoc.

```tsx
// src/events/list-events.ts
import { z } from "zod";

import { generateEvent } from "@bsport/analytics";

export const buttonClickedEventSchema = z
  .object({
    eventType: z.string().default("button_clicked"),
    kind: z
      .string()
      .describe("Kind of action performed when clicking on the button"),
  })
  .describe("When the user clicks on a button");

// Used in your runtime application
export const buttonClickedEvent = generateEvent(buttonClickedEventSchema);
```

```tsx
// src/events/register.ts
export { buttonClickedEventSchema } from "./list-events.ts";
```

### Step 3 - Inject the event in the track method of your analytics client

```tsx
import { buttonClickedEvent } from "#src/events/list-events.ts";
import { analytics } from "#src/utils/analytics";

const MyButton = () => {
  const onClick = () => {
    // Do something

    analytics.track(buttonClickedEvent({ kind: "Add Teacher" }));
  };
  return <button onClick={onClick} />;
};
```

### Step 4 - Identify your users

```tsx
// On login
analytics.identify({
  userId: user.id,
  traits: { email: user.email, role: user.role },
});

// On logout
analytics.reset(); // or analytics.clearSuperProperties();
```

## Custom analytics tool

You might need to use a different tool than Mixpanel browser for your analytics desires. Though, you still need to use the `AnalyticsClient` to ensure consistent usage over our frontend codebases.

### Using Meiro Analytics

We provide a built-in `MeiroAdapter` for Meiro Events SDK integration:

```tsx
import {
  AnalyticsClient,
  type AnalyticsClientInterface,
  MeiroAdapter,
} from "@bsport/analytics";

const meiroAdapter = new MeiroAdapter();
const analytics: AnalyticsClientInterface = new AnalyticsClient({
  adapter: meiroAdapter,
});

analytics.configure({
  domain: "meiro.staging.bsport.io", // or your production domain
  env: "staging", // or "production"
  external_id: "your-external-id", // string format
  // OR use object format for multiple IDs:
  // external_id: { ga: "ga_client_id", app_cid: "site_client_id" },
  sync: {
    ga_cid: true,
    fb_cid: true,
  },
  outbound_link_tracking: {
    enabled: true,
    domains_blacklist: ["example.com"],
  },
});

// Enable debug logging for development
analytics.setDebugMode(true);

// Use super properties for session-scoped data (privacy-safe, memory-only)
analytics.addSuperProperties({
  app_version: "2.1.0",
  user_plan: "premium",
  feature_flags: { new_dashboard: true },
});

// Use normally with the same API
analytics.track(buttonClickedEvent({ kind: "Add Teacher" }));
analytics.identify({ userId: "123", traits: { email: "user@example.com" } });
```

#### Meiro Enhanced Features

**External ID Flexibility**
The `external_id` field supports both string and object formats:

```tsx
// String format (simple)
analytics.configure({ external_id: "user123" });

// Object format (multiple identifiers)
analytics.configure({
  external_id: {
    ga: "GA1.1.123456789.1234567890",
    app_cid: "site_client_id_456",
    custom_id: "my_internal_id",
  },
});
```

**Privacy-Safe Super Properties**
Super properties are stored in memory only (no localStorage/sessionStorage) for GDPR compliance:

```tsx
// Add properties that persist for the session
analytics.addSuperProperties({
  app_version: "2.1.0",
  user_segment: "premium",
  ab_test_variant: "version_a",
});

// All subsequent events automatically include these properties
analytics.track(buttonClickedEvent({ kind: "signup" }));
// Sent as: { event_type: "button_clicked", kind: "signup", app_version: "2.1.0", user_segment: "premium", ab_test_variant: "version_a" }

// Remove specific properties
analytics.removeSuperProperties(["ab_test_variant"]);

// Clear all super properties
analytics.resetSuperProperties();
```

**Debug Logging**
Enable detailed console logging for development and troubleshooting:

```tsx
// Enable debug mode to see detailed logs
analytics.setDebugMode(true);

// Now all operations are logged:
// [Meiro Debug] Configure called with config: {...}
// [Meiro Debug] Loading Meiro SDK script from domain: meiro.staging.bsport.io
// [Meiro Debug] Track event called: {...}
// [Meiro Debug] Adding super properties: {...}

// Disable when not needed
analytics.setDebugMode(false);
```

### Custom Adapter Implementation

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

You can use multiple tools at the same time, they will be isolated one from the other :

```tsx
const analyticsWithMixpanel: AnalyticsClientInterface = new AnalyticsClient();

const analyticsWithMeiro: AnalyticsClientInterface = new AnalyticsClient({
  adapter: new MeiroAdapter(),
});

const analyticsWithOtherTool: AnalyticsClientInterface = new AnalyticsClient({
  adapter: customAdapter,
});

analyticsWithMeiro.configure({ domain: "meiro.staging.bsport.io" }); // Won't affect other instances
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

## Local Development with Module Federation

When working on a tracking plan in a Module Federation architecture, you have two development options:

### Option 1: Run with the host (Recommended)

```bash
pnpm exec nx dev-mfe @bsport/sm-host --watchDeps=false --remotes=@bsport/sm-navigation-sidebar,@bsport/sm-homepage,{YOUR-APP}
```

**How it works:**

- The host configures the shared Mixpanel SDK singleton
- Your MFE creates its own `AnalyticsClient` wrapper instance
- The shared singleton means Mixpanel is already configured
- ✅ Closest to production behavior
- ✅ Analytics works out of the box
- ⚠️ You still need to add MFE-specific super properties or identify calls if you need to add app specific information

**How to create a `AnalyticsClient` wrapper instance specific to your app:**

In a new file analytics.ts

```ts
// You'll need to add @bsport/analytics to your app dependencies (package.json)
import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from "@bsport/analytics";

const ACTIVATE_DEBUG = import.meta.env.DEV;

export const analyticsClient: AnalyticsClientInterface = new AnalyticsClient({
  internalDebug: ACTIVATE_DEBUG,
});

analyticsClient.addSuperProperties({
  application: __SESSION__.__I18N_NAMESPACE_PREFIX__,
});
```

### Option 2: Run MFE standalone

```bash
pnpm exec nx dev @bsport/your-app-name  # Runs only your MFE in isolation
```

**How it works:**

- Your MFE runs independently without the host
- Mixpanel SDK is NOT configured
- ❌ Analytics tracking will not work without configuration

**To enable analytics in standalone mode**, manually configure the client (⚠️ don't commit these changes ⚠️):

To prevent you from accidentally commits your local configuration, create locally in your app a file under `__tmp__` which is naturally gitignored : `src/__tmp__/analytics-local-starter.ts`

```tsx
// In your app src/__tmp__/analytics-local-starter.ts
import { analytics } from "#src/utils/analytics";

// 1. Configure Mixpanel
analytics.configure({
  token: import.meta.env.VITE_MIXPANEL_TOKEN,
  env: "dev",
});

// 2. Identify the user
analytics.identify({
  userId: "example-user-123",
  traits: {
    username: "Example",
    email: "dev@example.com",
  },
});

// 3. Add super properties (context that applies to all events)
analytics.addSuperProperties({
  application: "sm-session",
  company_id: 123,
  // ... other context
});
```

**Important:**

- ⚠️ These configuration calls are only for local standalone development
- ⚠️ Do NOT commit these changes — they will conflict with the host's configuration.
- ✅ When running with the host, configuration is handled automatically

### Why this matters

In a Module Federation setup:

- `@bsport/analytics` is a **shared singleton dependency**
- All MFEs share the **same underlying Mixpanel SDK instance**
- Each MFE creates its **own `AnalyticsClient` wrapper**
- The host typically configures the shared SDK on app initialization
- MFEs inherit this configuration automatically when loaded by the host
