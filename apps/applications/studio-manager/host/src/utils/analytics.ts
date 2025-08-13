import {
  AnalyticsClient,
  type AnalyticsClientInterface,
} from "@bsport/analytics";

export const debugActive = import.meta.env.DEV;
export const analyticsClient: AnalyticsClientInterface = new AnalyticsClient({
  internalDebug: debugActive,
});
