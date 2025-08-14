import mixpanel from "mixpanel-browser";

import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsEvent,
  MixpanelConfig,
  Properties,
} from "./types";

const MIXPANEL_TOKEN_DEV = process.env.VITE_MIXPANEL_TOKEN_DEV;
const MIXPANEL_TOKEN_PRODUCTION = process.env.VITE_MIXPANEL_TOKEN_PRODUCTION;

export class MixpanelAdapter implements AnalyticsAdapter {
  private checkIsInitialized(): boolean {
    try {
      // Try to retrieve the mixpanel config, which is available only after mixpanel.init();
      // This will check the initialization on the mixpanel level (singleton), not on the AnalyticsClient level
      mixpanel.get_config();
      return true;
    } catch (_error) {
      console.warn(
        "[Mixpanel] Init has not been called. Please consider calling the 'configure' method.",
      );
      return false;
    }
  }

  configure(config?: AnalyticsConfig<MixpanelConfig>): void {
    if (this.checkIsInitialized()) {
      console.log(
        "[Mixpanel] Mixpanel has already been init. To avoid side effects, we don't override the init.",
      );
      return;
    }

    const { token, env, ...otherConfig } = config ?? {};

    const defaultToken =
      env === "production" ? MIXPANEL_TOKEN_PRODUCTION : MIXPANEL_TOKEN_DEV;
    const mixpanelToken = token ?? defaultToken ?? "";

    if (!mixpanelToken) throw new Error("[Mixpanel] No token provided !");

    mixpanel.init(mixpanelToken, otherConfig);

    console.log(
      `[Mixpanel] Init mixpanel client with env "${env}" and ${token ? "provided token" : "default token"}`,
    );
  }

  track(event: AnalyticsEvent): void {
    if (!this.checkIsInitialized()) return;

    const { eventType, ...properties } = event;
    mixpanel.track(eventType, properties);
  }

  identify({ userId, traits }: { userId: string; traits?: Properties }): void {
    if (!this.checkIsInitialized()) return;

    mixpanel.identify(userId);
    if (traits) mixpanel.people.set(traits);
  }

  resetIdentity(): void {
    if (!this.checkIsInitialized()) return;

    mixpanel.reset();
  }

  flush(): void {
    // Mixpanel doesn't expose flush in browser SDK
    console.warn("[Mixpanel] Flush is not supported in browser sdk");
  }

  overloadAddSuperProperties(properties: Properties) {
    if (!this.checkIsInitialized()) return;

    mixpanel.register(properties);
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]): void {
    if (!this.checkIsInitialized()) return;

    (propertiesKeys || []).forEach((property) => mixpanel.unregister(property));
  }

  overloadResetSuperProperties(): void {
    if (!this.checkIsInitialized()) return;

    mixpanel.reset();
  }
}
