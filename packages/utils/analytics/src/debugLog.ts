import type { AnalyticsConfig, AnalyticsEvent, Properties } from "./types";

const DEBUG_PREFIX = "[Analytics]";

export const debugLog = (instanceName?: string) => {
  const debugPrefix = instanceName
    ? `${DEBUG_PREFIX} (${instanceName})`
    : DEBUG_PREFIX;

  return {
    addSuperProperties: (properties: Properties) =>
      console.log(
        `${debugPrefix} Add super properties: `,
        JSON.stringify(properties, null, 2),
      ),

    configure: (config?: AnalyticsConfig) =>
      console.log(
        `${debugPrefix} Configure client: `,
        JSON.stringify(
          config?.token ? { ...config, token: "*****" } : config,
          null,
          2,
        ),
      ),

    setInternalDebugMode: (debug: boolean) =>
      console.log(`${debugPrefix} Set debug mode to ${debug}`),

    configureFailed: ({
      config,
      error,
    }: {
      config?: AnalyticsConfig;
      error: unknown;
    }) =>
      console.error(`${debugPrefix} Configuration failed: `, {
        config: JSON.stringify(
          config?.token ? { ...config, token: "*****" } : config,
          null,
          2,
        ),
        error,
      }),

    track: (event: AnalyticsEvent) =>
      console.log(
        `${debugPrefix} Tracked event: `,
        JSON.stringify(event, null, 2),
      ),

    flush: () => console.log(`${debugPrefix} Flush events`),

    identify: ({
      userId,
      traits,
    }: {
      userId?: string;
      traits?: Properties;
    }) => {
      let properties: string = "";
      if (userId && !traits) {
        properties = `id "${userId}"`;
      } else if (userId && traits) {
        properties = `id "${userId}" and traits: ${JSON.stringify(traits, null, 2)}`;
      } else if (!userId && traits) {
        properties = `traits: ${JSON.stringify(traits, null, 2)}`;
      }
      console.log(`${debugPrefix} Set user identity with ${properties}`);
    },

    optInTracking: () => console.log(`${debugPrefix} Activate tracking`),

    optOutTracking: () => console.log(`${debugPrefix} Deactivate tracking`),

    overloadAddSuperProperties: (properties: Properties) =>
      console.log(
        `${debugPrefix} Add overload super properties: `,
        JSON.stringify(properties, null, 2),
      ),

    overloadRemoveSuperProperties: (propertiesKeys: string[]) =>
      console.log(
        `${debugPrefix} Remove overload super properties: `,
        propertiesKeys,
      ),

    overloadResetSuperProperties: () =>
      console.log(`${debugPrefix} Reset overload super properties`),

    overloadSetDebugMode: (debug: boolean) =>
      console.log(`${debugPrefix} Set adapter debug mode to ${debug}`),

    removeSuperProperties: (propertiesKeys: string[]) =>
      console.log(`${debugPrefix} Remove super properties: `, propertiesKeys),

    resetIdentity: () => console.log(`${debugPrefix} Reset user identity`),

    resetSuperProperties: () =>
      console.log(`${debugPrefix} Reset super properties`),

    undefinedOptInTracking: () =>
      console.log(`${debugPrefix} optInTracking method is not defined`),

    undefinedOptOutTracking: () =>
      console.log(`${debugPrefix} optOutTracking method is not defined`),

    undefinedOverloadAddSuperProperties: () =>
      console.log(
        `${debugPrefix} overloadAddSuperProperties method is not defined`,
      ),

    undefinedOverloadRemoveSuperProperties: () =>
      console.log(
        `${debugPrefix} overloadRemoveSuperProperties method is not defined`,
      ),

    undefinedOverloadResetSuperProperties: () =>
      console.log(
        `${debugPrefix} overloadResetSuperProperties method is not defined`,
      ),

    undefinedOverloadSetDebugMode: () =>
      console.log(`${debugPrefix} overloadSetDebugMode method is not defined`),
  };
};
