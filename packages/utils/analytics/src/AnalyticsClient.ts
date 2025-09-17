import { MixpanelAdapter } from "./MixpanelAdapter";
import { debugLog as agnosticDebugLog } from "./debugLog";
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
  /** Name of the Instance name provided to the apdater, to differentiate debugging */
  private instanceName: string | undefined;
  /** Custom logger for the instance */
  debugLog: ReturnType<typeof agnosticDebugLog>;

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
    this.instanceName = instanceName;
    this.debugLog = agnosticDebugLog(this.instanceName);
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
      this.debugLog.configure(defaultConfig);
    }

    try {
      return this.analyticsAdapter.configure(defaultConfig);
    } catch (error) {
      this.debugLog.configureFailed({ config: defaultConfig, error });
    }
  }

  track(event: AnalyticsEvent) {
    const eventWithSuperProperties = {
      ...this.superProperties,
      ...event,
    };

    if (this.debug && this.isTracking) {
      this.debugLog.track(eventWithSuperProperties);
    }

    return this.analyticsAdapter.track(eventWithSuperProperties);
  }

  identify(params: { userId?: string; traits?: Properties }) {
    if (this.debug) {
      this.debugLog.identify(params);
    }

    return this.analyticsAdapter.identify(params);
  }

  resetIdentity() {
    if (this.debug) {
      this.debugLog.resetIdentity();
    }

    return this.analyticsAdapter.resetIdentity();
  }

  flush() {
    if (this.debug) {
      this.debugLog.flush();
    }

    return this.analyticsAdapter.flush();
  }

  optInTracking(config?: OptInOptions): DualVoid {
    if (!this.analyticsAdapter.optInTracking) {
      if (this.debug) {
        this.debugLog.undefinedOptInTracking();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.optInTracking();
    }

    this.isTracking = true;
    return this.analyticsAdapter.optInTracking(config);
  }

  optOutTracking(config?: OptOutOptions): DualVoid {
    if (!this.analyticsAdapter.optOutTracking) {
      if (this.debug) {
        this.debugLog.undefinedOptOutTracking();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.optOutTracking();
    }

    this.isTracking = false;
    return this.analyticsAdapter.optOutTracking(config);
  }

  overloadAddSuperProperties(properties: Properties) {
    if (!this.analyticsAdapter.overloadAddSuperProperties) {
      if (this.debug) {
        this.debugLog.undefinedOverloadAddSuperProperties();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.overloadAddSuperProperties(properties);
    }

    return this.analyticsAdapter.overloadAddSuperProperties(properties);
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]) {
    if (!this.analyticsAdapter.overloadRemoveSuperProperties) {
      if (this.debug) {
        this.debugLog.undefinedOverloadRemoveSuperProperties();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.overloadRemoveSuperProperties(propertiesKeys);
    }

    return this.analyticsAdapter.overloadRemoveSuperProperties(propertiesKeys);
  }

  overloadResetSuperProperties() {
    if (!this.analyticsAdapter.overloadResetSuperProperties) {
      if (this.debug) {
        this.debugLog.undefinedOverloadResetSuperProperties();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.overloadResetSuperProperties();
    }

    return this.analyticsAdapter.overloadResetSuperProperties();
  }

  overloadSetDebugMode(debug: boolean): DualVoid {
    if (!this.analyticsAdapter.overloadSetDebugMode) {
      if (this.debug) {
        this.debugLog.undefinedOverloadSetDebugMode();
      }

      return;
    }

    if (this.debug) {
      this.debugLog.overloadSetDebugMode(debug);
    }

    return this.analyticsAdapter.overloadSetDebugMode(debug);
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

  resetSuperProperties() {
    this.superProperties = {};

    if (this.debug) {
      this.debugLog.resetSuperProperties();
    }
  }

  getIsTracking(): boolean {
    return this.isTracking;
  }

  //#endregion
}
