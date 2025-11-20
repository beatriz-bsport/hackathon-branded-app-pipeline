import type {
  OnboardingGroupConfig,
  OnboardingUserConfig,
  Properties,
} from "./types";

const DEBUG_PREFIX = "[Onboarding Manager]";

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

    loadScript: () =>
      console.log(`${debugPrefix} Load the script for the onboarding Manager`),

    initUser: (config?: OnboardingUserConfig) =>
      console.log(
        `${debugPrefix} Initialize user : `,
        JSON.stringify(config, null, 2),
      ),

    initGroup: (config?: OnboardingGroupConfig) =>
      console.log(
        `${debugPrefix} Initialize user group : `,
        JSON.stringify(config, null, 2),
      ),

    setInternalDebugMode: (debug: boolean) =>
      console.log(`${debugPrefix} Set debug mode to ${debug}`),

    loadScriptFailed: ({ error }: { error: unknown }) =>
      console.log(
        `${debugPrefix} Failed to load the script for the onboarding Manager`,
        {
          error,
        },
      ),

    initUserFailed: ({
      config,
      error,
    }: {
      config?: OnboardingUserConfig;
      error: unknown;
    }) =>
      console.error(`${debugPrefix} Initialize user failed: `, {
        config: JSON.stringify(config, null, 2),
        error,
      }),

    initGroupFailed: ({
      config,
      error,
    }: {
      config?: OnboardingGroupConfig;
      error: unknown;
    }) =>
      console.error(`${debugPrefix} Initialize user group failed: `, {
        config: JSON.stringify(config, null, 2),
        error,
      }),

    trackEvent: (eventName: string, eventProperties: Properties) =>
      console.log(
        `${debugPrefix} Tracked event: ${eventName}`,
        JSON.stringify(eventProperties, null, 2),
      ),

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

    navigate: () => console.log(`${debugPrefix} Navigate to a new location`),

    resetData: () => console.log(`${debugPrefix} Reset user data`),

    logOutUser: () => console.log(`${debugPrefix} Logging out user`),
  };
};
