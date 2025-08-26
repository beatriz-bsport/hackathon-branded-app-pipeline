import mixpanel, { type OverridedMixpanel } from "mixpanel-browser";

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
  private instanceName?: string;
  public instance: OverridedMixpanel;

  constructor(instanceName?: string) {
    this.instanceName = instanceName;
    // Use mixpanel as default instance. A named instance can be retrieved at init step.
    this.instance = mixpanel;
  }

  private checkIsInitialized(silent: boolean = false): boolean {
    try {
      // Try to retrieve the mixpanel config, which is available only after mixpanel.init();
      // This will check the initialization on the mixpanel level (singleton), not on the AnalyticsClient level
      this.instance.get_config();
      return true;
    } catch (_error) {
      if (!silent) {
        console.warn(
          "[Mixpanel] Init has not been called. Please consider calling the 'configure' method.",
        );
      }
      return false;
    }
  }

  configure(config?: AnalyticsConfig<MixpanelConfig>): void {
    if (this.checkIsInitialized(true)) {
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

    if (this.instanceName) {
      // Call init with a third argument, that will return a unique mixpanel instance
      this.instance = this.instance.init(
        mixpanelToken,
        otherConfig,
        this.instanceName,
      ) as OverridedMixpanel;
    } else {
      this.instance.init(mixpanelToken, otherConfig);
    }

    console.log(
      `[Mixpanel] Init mixpanel client with env "${env}" and ${token ? "provided token" : "default token"}`,
    );
  }

  track(event: AnalyticsEvent): void {
    if (!this.checkIsInitialized()) return;

    const { eventType, ...properties } = event;
    this.instance.track(eventType, properties);
  }

  identify({ userId, traits }: { userId: string; traits?: Properties }): void {
    if (!this.checkIsInitialized()) return;

    this.instance.identify(userId);
    if (traits) this.instance.people.set(traits);
  }

  resetIdentity(): void {
    if (!this.checkIsInitialized()) return;

    this.instance.reset();
  }

  flush(): void {
    // Mixpanel doesn't expose flush in browser SDK
    console.warn("[Mixpanel] Flush is not supported in browser sdk");
  }

  overloadAddSuperProperties(properties: Properties) {
    if (!this.checkIsInitialized()) return;

    this.instance.register(properties);
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]): void {
    if (!this.checkIsInitialized()) return;

    (propertiesKeys || []).forEach((property) =>
      this.instance.unregister(property),
    );
  }

  overloadResetSuperProperties(): void {
    if (!this.checkIsInitialized()) return;

    this.instance.reset();
  }
}
