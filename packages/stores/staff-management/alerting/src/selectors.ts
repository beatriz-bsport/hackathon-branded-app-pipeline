import type { AlertingState } from "#src/store";
import type { AlertKind, AlertTypeMap } from "#src/types";

/**
 * Select all alerts for a specific alert kind
 */
export const selectAlertsByKind =
  <T extends AlertKind>(alertKind: T) =>
  (state: AlertingState): AlertTypeMap[T][] => {
    return (state.alertsByKind[alertKind]?.data || []) as AlertTypeMap[T][];
  };

/**
 * Select alert count for a specific alert kind
 */
export const selectAlertCountByKind =
  (alertKind: AlertKind) =>
  (state: AlertingState): number => {
    return state.alertsByKind[alertKind]?.count || 0;
  };

/**
 * Select total count of all alerts across all alert kinds
 *
 * This selector automatically sums up the counts for all alert kinds in the store,
 * making it future-proof when new alert kinds are added.
 */
export const selectAllAlertsCount = (state: AlertingState): number => {
  return Object.values(state.alertsByKind).reduce((total, alertData) => {
    return total + (alertData?.count || 0);
  }, 0);
};
