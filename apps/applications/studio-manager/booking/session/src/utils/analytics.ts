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
