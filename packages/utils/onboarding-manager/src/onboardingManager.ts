import { AppcuesAdapter } from "./AppcuesAdapter";
import { debugLog as agnosticDebugLog } from "./debugLog";
import type {
  OnboardingGroupConfig,
  OnboardingManagerAdapter,
  OnboardingUserConfig,
  Properties,
} from "./types";

export class OnboardingManagerClient {
  /** Class providing all analytics methods to this AnalyticsClient instance*/
  private onboardingManager: OnboardingManagerAdapter;
  /** Boolean to activate the internal debug mode on this AnalyticsClient instance */
  private debug: boolean;
  /** Set of internal properties to apply to all events on this AnalyticsClient instance */
  private superProperties: Properties;
  /** Whether the tracking is activated and logs should be sent */
  private isTracking: boolean;
  /** Name of the Instance name provided to the apdater, to differentiate debugging */
  private instanceName: string | undefined;
  /** Custom logger for the instance */
  debugLog: ReturnType<typeof agnosticDebugLog>;

  constructor({
    onboardingManager,
    internalDebug = false,
    instanceName,
  }: {
    onboardingManager?: OnboardingManagerAdapter;
    internalDebug?: boolean;
    instanceName?: string;
  } = {}) {
    this.debug = internalDebug;
    this.isTracking = true; // Consider that the client is tracking by default
    this.superProperties = {};
    this.instanceName = instanceName;
    this.debugLog = agnosticDebugLog(this.instanceName);
    this.onboardingManager = onboardingManager ?? new AppcuesAdapter();
  }

  //#region ----- Tracking tool methods (to be implemented in the Adapter) -----

  loadScript() {
    if (this.debug) {
      this.debugLog.loadScript();
    }

    try {
      return this.onboardingManager.loadScript();
    } catch (error) {
      this.debugLog.loadScriptFailed({ error });
    }
  }

  initUser(defaultConfig: OnboardingUserConfig) {
    if (this.debug) {
      this.debugLog.initUser(defaultConfig);
    }

    try {
      return this.onboardingManager.initUser(defaultConfig);
    } catch (error) {
      this.debugLog.initUserFailed({ config: defaultConfig, error });
    }
  }

  initGroup(defaultConfig: OnboardingGroupConfig) {
    if (this.debug) {
      this.debugLog.initGroup(defaultConfig);
    }

    try {
      return this.onboardingManager.initGroup(defaultConfig);
    } catch (error) {
      this.debugLog.initGroupFailed({ config: defaultConfig, error });
    }
  }

  trackEvent(eventName: string, eventProperties: Properties) {
    const eventWithSuperProperties = {
      ...this.superProperties,
      ...eventProperties,
    };

    if (this.debug && this.isTracking) {
      this.debugLog.trackEvent(eventName, eventWithSuperProperties);
    }

    return this.onboardingManager.trackEvent(
      eventName,
      eventWithSuperProperties,
    );
  }

  navigate() {
    if (this.debug) {
      this.debugLog.navigate();
    }

    return this.onboardingManager.navigate();
  }

  resetData() {
    if (this.debug) {
      this.debugLog.resetData();
    }

    return this.onboardingManager.resetData();
  }

  logOutUser() {
    if (this.debug) {
      this.debugLog.logOutUser();
    }

    return this.onboardingManager.logOutUser();
  }

  //#endregion

  //#region ----- Agnostic methods -----

  setInternalDebugMode(debug: boolean) {
    this.debug = debug;

    this.debugLog.setInternalDebugMode(debug);
  }

  addSuperProperties(properties: Properties) {
    this.superProperties = { ...this.superProperties, ...properties };

    if (this.debug) {
      this.debugLog.addSuperProperties(properties);
    }
  }

  removeSuperProperties(propertiesKeys: string[]) {
    this.superProperties = Object.fromEntries(
      Object.entries(this.superProperties).filter(
        (entry) => !propertiesKeys.includes(entry[0]),
      ),
    );

    if (this.debug) {
      this.debugLog.removeSuperProperties(propertiesKeys);
    }
  }

  getIsTracking(): boolean {
    return this.isTracking;
  }

  //#endregion
}
