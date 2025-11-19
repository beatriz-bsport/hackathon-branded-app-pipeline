import {
  OnboardingGroupConfig,
  OnboardingManagerAdapter,
  OnboardingUserConfig,
  Properties,
} from "./types";

export class AppcuesAdapter implements OnboardingManagerAdapter {
  private isScriptLoaded = false;
  private isInitialized = false;
  private superProperties: Properties = {};
  private debugMode = false;

  loadScript(): Promise<void> {
    if (this.debugMode) {
      console.log(`[Onboarding Manager] (Appcues) Loading Appcues SDK script`);
    }

    return new Promise((resolve, reject) => {
      if (this.isScriptLoaded && window?.Appcues) {
        if (this.debugMode) {
          console.log(
            `[Onboarding Manager] (Appcues) Appcues SDK already loaded, reusing existing instance`,
          );
        }

        resolve();

        return;
      }

      const initScript: HTMLScriptElement = document.createElement("script");
      initScript.type = "text/javascript";
      initScript.textContent =
        "window.AppcuesSettings = { enableURLDetection: true };";
      initScript.async = true;

      document.head.appendChild(initScript);

      const script = document.createElement("script");
      script.onload = () => {
        this.isScriptLoaded = true;

        if (this.debugMode) {
          console.log(
            `[Onboarding Manager] (Appcues) Appcues SDK script loaded successfully`,
          );
        }

        resolve();
      };
      script.onerror = () => {
        if (this.debugMode) {
          console.log(
            `[Onboarding Manager] (Apccues) Failed to load Appcues SDK script`,
          );
        }

        reject(new Error("Failed to load Appcues SDK"));
      };
      script.src = `https://fast.appcues.com/223986.js`;
      script.async = true;

      document.head.appendChild(script);
    });
  }

  private checkIsInitialized(silent: boolean = false): boolean {
    if (!this.isInitialized || !window?.Appcues) {
      if (!silent) {
        console.warn(
          "[Appcues] SDK not initialized. Please consider calling the 'configure' method.",
        );
      }

      return false;
    }

    return true;
  }

  async initUser(config: OnboardingUserConfig): Promise<void> {
    if (this.checkIsInitialized(true)) {
      console.log(
        "[Appcues] Appcues has already been initialized. To avoid side effects, we don't override the init.",
      );

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...appcuesConfig } = config;

    try {
      if (this.debugMode) {
        console.log(
          `[Onboarding Manager] (Appcues) Initializing user : ${user_id} on Appcues with config:`,
          JSON.stringify(appcuesConfig, null, 2),
        );
      }

      window?.Appcues?.identify(user_id, appcuesConfig);
      this.isInitialized = true;
    } catch (error) {
      console.error("[Onboarding Manager] Failed to initialize user :", error);
      throw error;
    }
  }

  async initGroup(config: OnboardingGroupConfig): Promise<void> {
    if (this.checkIsInitialized(true)) {
      console.log(
        "[Appcues] Appcues has already been initialized. To avoid side effects, we don't override the init.",
      );

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...appcuesConfig } = config;

    try {
      if (this.debugMode) {
        console.log(
          `[Onboarding Manager] (Appcues) Initializing user : ${user_id} group on Appcues with config:`,
          JSON.stringify(appcuesConfig, null, 2),
        );
      }

      window?.Appcues?.group(user_id, appcuesConfig);
      this.isInitialized = true;
    } catch (error) {
      console.error(
        "[Onboarding Manager] Failed to initialize user group :",
        error,
      );
      throw error;
    }
  }

  trackEvent(eventName: string, eventProperties: Properties): void {
    const trackFn = () => {
      if (!this.checkIsInitialized()) {
        return;
      }

      const mergedProperties = {
        ...this.superProperties,
        ...eventProperties,
      };

      window?.Appcues?.track(eventName, mergedProperties);
    };

    trackFn();
  }

  resetData(): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    window?.Appcues?.reset();
  }

  logOutUser(): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    window?.Appcues?.anonymous();
  }

  navigate(): void {
    if (!this.checkIsInitialized()) {
      return;
    }

    window?.Appcues?.page();
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

  overloadSetDebugMode(debug: boolean): void {
    this.debugMode = debug;
    console.log(`[Meiro] Debug mode ${debug ? "enabled" : "disabled"}`);
  }
}
