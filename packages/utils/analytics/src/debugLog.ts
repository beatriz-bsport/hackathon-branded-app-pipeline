import type { AnalyticsConfig, AnalyticsEvent, Properties } from "./types";

const DEBUG_PREFIX = "[Analytics]";

export const debugLog = {
  addSuperProperties: (properties: Properties) =>
    console.log(
      `${DEBUG_PREFIX} Add super properties: `,
      JSON.stringify(properties, null, 2),
    ),

  configure: (config?: AnalyticsConfig) =>
    console.log(
      `${DEBUG_PREFIX} Configure client: `,
      JSON.stringify(config, null, 2),
    ),

  setInternalDebugMode: (debug: boolean) =>
    console.log(`${DEBUG_PREFIX} Set debug mode to ${debug}`),

  configureFailed: ({
    config,
    error,
  }: {
    config?: AnalyticsConfig;
    error: unknown;
  }) =>
    console.error(`${DEBUG_PREFIX} Configuration failed: `, {
      config: JSON.stringify(config, null, 2),
      error,
    }),

  track: (event: AnalyticsEvent) =>
    console.log(
      `${DEBUG_PREFIX} Tracked event: `,
      JSON.stringify(event, null, 2),
    ),

  flush: () => console.log(`${DEBUG_PREFIX} Flush events`),

  identify: ({ userId, traits }: { userId: string; traits?: Properties }) =>
    console.log(
      `${DEBUG_PREFIX} Set user identity with id ${userId} and traits: `,
      JSON.stringify(traits, null, 2),
    ),

  optInTracking: () => console.log(`${DEBUG_PREFIX} Activate tracking`),

  optOutTracking: () => console.log(`${DEBUG_PREFIX} Deactivate tracking`),

  overloadAddSuperProperties: (properties: Properties) =>
    console.log(
      `${DEBUG_PREFIX} Add overload super properties: `,
      JSON.stringify(properties, null, 2),
    ),

  overloadRemoveSuperProperties: (propertiesKeys: string[]) =>
    console.log(
      `${DEBUG_PREFIX} Remove overload super properties: `,
      propertiesKeys,
    ),

  overloadResetSuperProperties: () =>
    console.log(`${DEBUG_PREFIX} Reset overload super properties`),

  overloadSetDebugMode: (debug: boolean) =>
    console.log(`${DEBUG_PREFIX} Set adapter debug mode to ${debug}`),

  removeSuperProperties: (propertiesKeys: string[]) =>
    console.log(`${DEBUG_PREFIX} Remove super properties: `, propertiesKeys),

  resetIdentity: () => console.log(`${DEBUG_PREFIX} Reset user identity`),

  resetSuperProperties: () =>
    console.log(`${DEBUG_PREFIX} Reset super properties`),

  undefinedOptInTracking: () =>
    console.log(`${DEBUG_PREFIX} optInTracking method is not defined`),

  undefinedOptOutTracking: () =>
    console.log(`${DEBUG_PREFIX} optOutTracking method is not defined`),

  undefinedOverloadAddSuperProperties: () =>
    console.log(
      `${DEBUG_PREFIX} overloadAddSuperProperties method is not defined`,
    ),

  undefinedOverloadRemoveSuperProperties: () =>
    console.log(
      `${DEBUG_PREFIX} overloadRemoveSuperProperties method is not defined`,
    ),

  undefinedOverloadResetSuperProperties: () =>
    console.log(
      `${DEBUG_PREFIX} overloadResetSuperProperties method is not defined`,
    ),

  undefinedOverloadSetDebugMode: () =>
    console.log(`${DEBUG_PREFIX} overloadSetDebugMode method is not defined`),
};
