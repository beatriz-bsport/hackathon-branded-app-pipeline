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
