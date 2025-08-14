import { MixpanelAdapter } from "./MixpanelAdapter";
import { debugLog } from "./debugLog";
import type {
  AnalyticsAdapter,
  AnalyticsClientInterface,
  AnalyticsConfig,
  AnalyticsEvent,
  MixpanelConfig,
  Properties,
} from "./types";

export class AnalyticsClient<T = MixpanelConfig>
  implements AnalyticsClientInterface
{
  /** Class providing all analytics methods to this AnalyticsClient instance*/
  private analyticsAdapter: AnalyticsAdapter<T>;
  /** Boolean to activate the internal debug mode on this AnalyticsClient instance */
  private debug: boolean;
  /** Set of internal properties to apply to all events on this AnalyticsClient instance */
  private superProperties: Properties;

  constructor({
    adapter,
    internalDebug = false,
  }: {
    adapter?: AnalyticsAdapter<T>;
    internalDebug?: boolean;
  } = {}) {
    this.debug = internalDebug;
    this.superProperties = {};
    this.analyticsAdapter = adapter ?? new MixpanelAdapter();
  }

  //#region ----- Tracking tool methods (to be implemented in the Adapter) -----

  configure(defaultConfig?: AnalyticsConfig<T>) {
    if (this.debug) debugLog.configure(defaultConfig);

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

    if (this.debug) debugLog.event(eventWithSuperProperties);

    return this.analyticsAdapter.track(eventWithSuperProperties);
  }

  identify(params: { userId: string; traits: Properties }) {
    if (this.debug) debugLog.identify(params);

    return this.analyticsAdapter.identify(params);
  }

  resetIdentity() {
    if (this.debug) debugLog.resetIdentity();

    return this.analyticsAdapter.resetIdentity();
  }

  flush() {
    if (this.debug) debugLog.flush();

    return this.analyticsAdapter.flush();
  }

  overloadAddSuperProperties(properties: Properties) {
    if (!this.analyticsAdapter.overloadAddSuperProperties) {
      if (this.debug) debugLog.undefinedOverloadAddSuperProperties();
      return;
    }

    if (this.debug) debugLog.overloadAddSuperProperties(properties);

    return this.analyticsAdapter.overloadAddSuperProperties(properties);
  }

  overloadRemoveSuperProperties(propertiesKeys: string[]) {
    if (!this.analyticsAdapter.overloadRemoveSuperProperties) {
      if (this.debug) debugLog.undefinedOverloadRemoveSuperProperties();
      return;
    }

    if (this.debug) debugLog.overloadRemoveSuperProperties(propertiesKeys);

    return this.analyticsAdapter.overloadRemoveSuperProperties(propertiesKeys);
  }

  overloadResetSuperProperties() {
    if (!this.analyticsAdapter.overloadResetSuperProperties) {
      if (this.debug) debugLog.undefinedOverloadResetSuperProperties();
      return;
    }

    if (this.debug) debugLog.overloadResetSuperProperties();

    return this.analyticsAdapter.overloadResetSuperProperties();
  }

  //#endregion

  //#region ----- Agnostic methods -----

  setInternalDebugMode(debug: boolean) {
    this.debug = debug;
  }

  addSuperProperties(properties: Properties) {
    this.superProperties = { ...this.superProperties, ...properties };

    if (this.debug) debugLog.addSuperProperties(properties);
  }

  removeSuperProperties(propertiesKeys: string[]) {
    this.superProperties = Object.fromEntries(
      Object.entries(this.superProperties).filter(
        (entry) => !propertiesKeys.includes(entry[0]),
      ),
    );

    if (this.debug) debugLog.removeSuperProperties(propertiesKeys);
  }

  resetSuperProperties() {
    this.superProperties = {};

    if (this.debug) debugLog.resetSuperProperties();
  }

  //#endregion
}
