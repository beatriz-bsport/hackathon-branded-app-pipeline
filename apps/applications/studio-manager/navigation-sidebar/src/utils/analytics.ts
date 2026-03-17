import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from "@bsport/analytics";

const debugActive = import.meta.env.DEV;

export const analyticsClient: AnalyticsClientInterface = new AnalyticsClient({
  internalDebug: debugActive,
});

analyticsClient.addSuperProperties({
  application: "__NAVIGATION_SIDEBAR__",
});
