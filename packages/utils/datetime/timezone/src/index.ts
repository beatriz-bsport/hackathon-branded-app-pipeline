import { Settings } from "luxon";

/**
 * Get the current timezone name of the user or null if it's unknown.
 */
export const getTimezoneName = (): string | null => {
  return Settings.defaultZone.isValid ? Settings.defaultZone.name : null;
};
