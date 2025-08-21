import { useFlag as useUnleashFlag } from "@unleash/proxy-client-react";

/**
 * Factory to create a typed useFlag per module without cross-app coupling.
 *
 * Usage in a consuming module:
 *   export const { flags, useFlag } = makeFeatureFlags({
 *     INSIGHTS_PAGE: "insights_page",
 *   } as const);
 */
export function makeFeatureFlags<T extends Record<string, string>>(flags: T) {
  type FlagName = T[keyof T];
  const useFlag = (name: FlagName) => useUnleashFlag(name);
  return { flags, useFlag };
}
