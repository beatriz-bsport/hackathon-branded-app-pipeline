import type {
  Config,
  InTrackingOptions,
  OutTrackingOptions,
} from "mixpanel-browser";

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Serializable[]
  | { readonly [key: string]: Serializable }
  | { toJSON(): Serializable };

export type Properties = Record<string, Serializable>;

export type AnalyticsEvent = Properties & {
  eventType: string;
};

/** Augment your type config using the generic T type (extensibility) */
export type AnalyticsConfig<T = Record<string, unknown>> = {
  token?: string;
  env?: "production" | "dev";
} & T;

export type DualVoid = void | Promise<void>;

/**
 * Interface of an Analytics Adapter, which basically is a set of methods that
 * allow to use tool-specific methods within the generic Analytics Client
 */
export type AnalyticsAdapter<
  ExtraConfig = Record<string, unknown>,
  OptInOptions = Record<string, unknown> | undefined,
  OptOutOptions = Record<string, unknown> | undefined,
> = {
  /**
   * Initialize the Analytics service with provided configuration
   * @param config Parameters to provide to the adapter
   */
  configure(config?: AnalyticsConfig<ExtraConfig>): DualVoid;

  /**
   * Track an event with optional additional properties
   * @param event Parameters of the event to track. It should contain at least
   * the `eventType` property
   */
  track(event: AnalyticsEvent): DualVoid;

  /**
   * Identify a user with optional traits
   * @param userId Identifier for the logged user
   * @param traits Record of properties to attach to the user
   */
  identify({
    userId,
    traits,
  }: {
    userId?: string;
    traits?: Properties;
  }): DualVoid;

  /**
   * Reset (remove) the user identification
   */
  resetIdentity(): DualVoid;

  /**
   * Force trigger the sending of events without waiting for the automatic batch sending
   */
  flush(): DualVoid;

  /**
   * Activate data tracking
   */
  optInTracking?(config?: OptInOptions): DualVoid;

  /**
   * Deactivate data tracking
   */
  optOutTracking?(config?: OptOutOptions): DualVoid;

  /**
   * Allow to add super properties to the selected analytics tool directly
   * @param properties New super properties keys to add to the Analytics tool
   */
  overloadAddSuperProperties?(properties: Properties): DualVoid;

  /**
   * Allow to remove super properties from the selected analytics tool directly
   * @param propertiesKeys Super properties keys to remove from the Analytics tool
   */
  overloadRemoveSuperProperties?(propertiesKeys: string[]): DualVoid;

  /**
   * Remove all super properties that were attached to the selected analytics tool directly
   */
  overloadResetSuperProperties?(): DualVoid;

  /**
   * Allow to set the debug mode on the selected analytics tool directly
   * @param debug Whether the debug mode should be activated
   */
  overloadSetDebugMode?(debug: boolean): DualVoid;
};

export type AnalyticsAgnosticMethods = {
  /**
   * Store properties to append to all events
   * @param properties New super properties to add to the Analytics client
   *
   * This method is analytics-tools agnostic.
   */
  addSuperProperties(properties: Properties): void;

  /**
   * Enable or disable the debug mode (logs in the console starting with [Analytics])
   * @param debug Whether to enable the debug mode
   */
  setInternalDebugMode(debug: boolean): void;

  /**
   * Remove properties that were appended to all events
   * @param properties Super properties keys to remove from the Analytics client
   *
   * This method is analytics-tools agnostic.*
   */
  removeSuperProperties(propertiesKeys: string[]): void;

  /**
   * Remove all super properties that were appended to all events
   *
   * This method is analytics-tools agnostic.
   */
  resetSuperProperties(): void;
};

export type MixpanelConfig = Partial<Config>;
export type MixpanelOptInOptions = Partial<InTrackingOptions>;
export type MixpanelOptOutOptions = Partial<OutTrackingOptions>;

export type AnalyticsClientInterface<
  ExtraConfig = MixpanelConfig,
  OptInOptions = MixpanelOptInOptions,
  OptOutOptions = MixpanelOptOutOptions,
> = Required<AnalyticsAdapter<ExtraConfig, OptInOptions, OptOutOptions>> &
  AnalyticsAgnosticMethods;
