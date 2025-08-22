import { MixpanelAdapter } from "./MixpanelAdapter";
import { debugLog } from "./debugLog";
import { AnalyticsMessageBus } from "./message-bus";
import type {
  AnalyticsAdapter,
  AnalyticsClientInterface,
  AnalyticsConfig,
  AnalyticsEvent,
  DualVoid,
  MixpanelConfig,
  MixpanelOptInOptions,
  MixpanelOptOutOptions,
  Properties,
} from "./types";

export class AnalyticsClient<
  ExtraConfig = MixpanelConfig,
  OptInOptions = MixpanelOptInOptions,
  OptOutOptions = MixpanelOptOutOptions,
> implements AnalyticsClientInterface<ExtraConfig, OptInOptions, OptOutOptions>
{
  /** Class providing all analytics methods to this AnalyticsClient instance*/
  private analyticsAdapter: AnalyticsAdapter<
    ExtraConfig,
    OptInOptions,
    OptOutOptions
  >;
  /** Boolean to activate the internal debug mode on this AnalyticsClient instance */
  private debug: boolean;
  /** Set of internal properties to apply to all events on this AnalyticsClient instance */
  private superProperties: Properties;
  /** Whether the tracking is activated and logs should be sent */
  private isTracking: boolean;

  constructor({
    adapter,
    internalDebug = false,
    instanceName,
  }: {
    adapter?: AnalyticsAdapter<ExtraConfig, OptInOptions, OptOutOptions>;
    internalDebug?: boolean;
    instanceName?: string;
  } = {}) {
    this.debug = internalDebug;
    this.isTracking = true; // Consider that the client is tracking by default
    this.superProperties = {};
    this.analyticsAdapter =
      adapter ??
      (new MixpanelAdapter(instanceName) as AnalyticsAdapter<
        ExtraConfig,
        OptInOptions,
        OptOutOptions
      >);

    try {
      // Connect AnalyticsClient to a broadcast channel to have debug sync
      AnalyticsMessageBus.subscribe((debug) =>
        this.setInternalDebugMode(debug),
      );
    } catch {
      // Graceful no-op: environments without BroadcastChannel should not throw
      // as it's only for debugging and no production purpose
    }
  }

  //#region ----- Tracking tool methods (to be implemented in the Adapter) -----

  configure(defaultConfig?: AnalyticsConfig<ExtraConfig>) {
    if (this.debug) {
      debugLog.configure(defaultConfig);
    }

    try {
      return this.analyticsAdapter.configure(defaultConfig);
    } catch (error) {
      debugLog.configureFailed({ config: defaultConfig, error });
    }
  }

  track(event: AnalyticsEvent) {
    const eventWithSuperProperties = {
      ...this.superProperties,
      ...event,
    };

    if (this.debug && this.isTracking) {
      debugLog.track(eventWithSuperProperties);
    }

    return this.analyticsAdapter.track(eventWithSuperProperties);
  }

  identify(params: { userId: string; traits: Properties }) {
    if (this.debug) {
      debugLog.identify(params);
    }

    return this.analyticsAdapter.identify(params);
  }

  resetIdentity() {
    if (this.debug) {
      debugLog.resetIdentity();
    }

    return this.analyticsAdapter.resetIdentity();
  }

  flush() {
    if (this.debug) {
      debugLog.flush();
    }

    return this.analyticsAdapter.flush();
  }

  optInTracking(config?: OptInOptions): DualVoid {
    if (!this.analyticsAdapter.optInTracking) {
      if (this.debug) {
        debugLog.undefinedOptInTracking();
      }

      return;
    }

    if (this.debug) {
      debugLog.optInTracking();
    }

    this.isTracking = true;
    return this.analyticsAdapter.optInTracking(config);
  }

  optOutTracking(config?: OptOutOptions): DualVoid {
    if (!this.analyticsAdapter.optOutTracking) {
      if (this.debug) {
        debugLog.undefinedOptOutTracking();
      }

      return;
    }

    if (this.debug) {
      debugLog.optOutTracking();
    }

    this.isTracking = false;
    return this.analyticsAdapter.optOutTracking(config);
  }

  overloadAddSuperProperties(properties: Properties) {
    if (!this.analyticsAdapter.overloadAddSuperProperties) {
      if (this.debug) {
        debugLog.undefinedOverloadAddSuperProperties();
      }

      return;
    }

    if (this.debug) {
      debugLog.overloadAddSuperProperties(properties);
    }

    return this.analyticsAdapter.overloadAddSuperProperties(properties);
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]) {
    if (!this.analyticsAdapter.overloadRemoveSuperProperties) {
      if (this.debug) {
        debugLog.undefinedOverloadRemoveSuperProperties();
      }

      return;
    }

    if (this.debug) {
      debugLog.overloadRemoveSuperProperties(propertiesKeys);
    }

    return this.analyticsAdapter.overloadRemoveSuperProperties(propertiesKeys);
  }

  overloadResetSuperProperties() {
    if (!this.analyticsAdapter.overloadResetSuperProperties) {
      if (this.debug) {
        debugLog.undefinedOverloadResetSuperProperties();
      }

      return;
    }

    if (this.debug) {
      debugLog.overloadResetSuperProperties();
    }

    return this.analyticsAdapter.overloadResetSuperProperties();
  }

  overloadSetDebugMode(debug: boolean): DualVoid {
    if (!this.analyticsAdapter.overloadSetDebugMode) {
      if (this.debug) {
        debugLog.undefinedOverloadSetDebugMode();
      }

      return;
    }

    if (this.debug) {
      debugLog.overloadSetDebugMode(debug);
    }

    return this.analyticsAdapter.overloadSetDebugMode(debug);
  }

  //#endregion

  //#region ----- Agnostic methods -----

  setInternalDebugMode(debug: boolean) {
    this.debug = debug;

    debugLog.setInternalDebugMode(debug);
  }

  addSuperProperties(properties: Properties) {
    this.superProperties = { ...this.superProperties, ...properties };

    if (this.debug) {
      debugLog.addSuperProperties(properties);
    }
  }

  removeSuperProperties(propertiesKeys: string[]) {
    this.superProperties = Object.fromEntries(
      Object.entries(this.superProperties).filter(
        (entry) => !propertiesKeys.includes(entry[0]),
      ),
    );

    if (this.debug) {
      debugLog.removeSuperProperties(propertiesKeys);
    }
  }

  resetSuperProperties() {
    this.superProperties = {};

    if (this.debug) {
      debugLog.resetSuperProperties();
    }
  }

  //#endregion
}
