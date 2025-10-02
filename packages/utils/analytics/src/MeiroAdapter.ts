import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsEvent,
  DualVoid,
  MeiroConfig,
  Properties,
} from "./types";

const MEIRO_DOMAIN_STAGING = "meiro.staging.bsport.io";
const MEIRO_DOMAIN_PRODUCTION = "meiro.production.bsport.io";

type MeiroEventPayload =
  | (AnalyticsEvent<"page_view"> & Properties)
  | (AnalyticsEvent<"custom_event"> & {
      custom_event: string;
    } & Properties);

export class MeiroAdapter implements AnalyticsAdapter<MeiroConfig> {
  private isScriptLoaded = false;
  private isInitialized = false;
  private pendingTracks: Array<() => void> = [];
  private superProperties: Properties = {};
  private debugMode = false;

  private loadScript(domain: string): Promise<void> {
    if (this.debugMode) {
      console.log(
        `[Analytics] (Meiro) Loading Meiro SDK script from domain: ${domain}`,
      );
    }

    return new Promise((resolve, reject) => {
      if (this.isScriptLoaded && window.MeiroEvents) {
        if (this.debugMode) {
          console.log(
            `[Analytics] (Meiro) Meiro SDK already loaded, reusing existing instance`,
          );
        }

        resolve();

        return;
      }

      const script = document.createElement("script");
      script.onload = () => {
        this.isScriptLoaded = true;

        if (this.debugMode) {
          console.log(
            `[Analytics] (Meiro) Meiro SDK script loaded successfully`,
          );
        }

        resolve();
      };
      script.onerror = () => {
        if (this.debugMode) {
          console.log(`[Analytics] (Meiro) Failed to load Meiro SDK script`);
        }

        reject(new Error("Failed to load Meiro SDK"));
      };
      script.src = `https://${domain}/sdk-script.min.js`;
      script.async = true;

      document.head.appendChild(script);
    });
  }

  private checkIsInitialized(silent: boolean = false): boolean {
    if (!this.isInitialized || !window.MeiroEvents) {
      if (!silent) {
        console.warn(
          "[Meiro] SDK not initialized. Please consider calling the 'configure' method.",
        );
      }

      return false;
    }

    return true;
  }

  async configure(config: AnalyticsConfig<MeiroConfig>): Promise<void> {
    if (this.checkIsInitialized(true)) {
      console.log(
        "[Meiro] Meiro has already been initialized. To avoid side effects, we don't override the init.",
      );

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { env = "dev", token: _token, ...meiroConfig } = config;

    const defaultDomain =
      env === "production" ? MEIRO_DOMAIN_PRODUCTION : MEIRO_DOMAIN_STAGING;
    const domain = config.domain || defaultDomain;
    const endpoint =
      config.endpoint ||
      `https://${domain}/api/v1/collect/f8c214b5-2f7f-4b0a-8ce7-216928b13f1f`;

    const initConfig = { ...meiroConfig, domain, endpoint };

    if (this.debugMode) {
      console.log(
        `[Analytics] (Meiro) Resolved domain: ${domain} for environment: ${env}`,
      );
    }

    if (!domain) {
      throw new Error("[Meiro] No domain provided!");
    }

    try {
      await this.loadScript(domain);

      if (this.debugMode) {
        console.log(
          `[Analytics] (Meiro) Initializing Meiro with config:`,
          JSON.stringify(initConfig, null, 2),
        );
      }

      window.MeiroEvents.init(initConfig);
      this.isInitialized = true;

      // Possible race conditions between track and configure may happen given
      // this method is async, that's why we process pending tracks here

      if (this.debugMode) {
        console.log(
          `[Analytics] (Meiro) Processing ${this.pendingTracks.length} pending tracks`,
        );
      }
      this.pendingTracks.forEach((track) => track());
      this.pendingTracks = [];

      console.log(
        `[Meiro] Init Meiro client with env "${env}", domain "${domain}"`,
      );
    } catch (error) {
      console.error("[Meiro] Failed to initialize:", error);
      throw error;
    }
  }

  track(event: MeiroEventPayload): void {
    const trackFn = () => {
      if (!this.checkIsInitialized()) {
        return;
      }

      const { eventType, ...properties } = event;

      const mergedProperties = {
        ...this.superProperties,
        ...properties,
      };

      if (eventType === "page_view") {
        window.MeiroEvents.track("page_view", mergedProperties);
      } else {
        const payload = {
          ...mergedProperties,
        };

        window.MeiroEvents.track("custom_event", payload);
      }
    };

    if (this.isInitialized) {
      trackFn();
    } else {
      // Queue the track call until initialization is complete
      this.pendingTracks.push(trackFn);
    }
  }

  identify({ userId, traits }: { userId: string; traits?: Properties }): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    const payload: MeiroEventPayload = {
      eventType: "custom_event",
      custom_event: "identify",
    };

    this.overloadAddSuperProperties({
      user_id: userId,
      traits,
    });

    this.track(payload);
  }

  resetIdentity(): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    this.overloadRemoveSuperProperties(["user_id", "traits"]);

    window.MeiroEvents.resetIdentity();
  }

  flush(): void {
    // Meiro doesn't have a flush method - it sends events immediately
    console.log("[Meiro] Events are sent immediately, no flush needed");
  }

  getUserId(): string | null {
    if (!this.checkIsInitialized()) {
      return null;
    }

    return window.MeiroEvents.getUserId();
  }

  getSessionId(): string | null {
    if (!this.checkIsInitialized()) {
      return null;
    }

    return window.MeiroEvents.getSessionId();
  }

  updateConfig(config: MeiroConfig): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    window.MeiroEvents.updateConfig(config);
  }

  overloadAddSuperProperties(properties: Properties): void {
    this.superProperties = {
      ...this.superProperties,
      ...properties,
    };
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]): void {
    for (const property of propertiesKeys) {
      delete this.superProperties[property];
    }
  }

  overloadResetSuperProperties(): void {
    this.superProperties = {};
  }

  overloadSetDebugMode(debug: boolean): DualVoid {
    this.debugMode = debug;
    console.log(`[Meiro] Debug mode ${debug ? "enabled" : "disabled"}`);
  }
}
