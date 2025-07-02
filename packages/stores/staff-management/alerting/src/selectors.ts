import type { AlertingState } from "#src/store";
import type { Alert, AlertKind } from "#src/types";

/**
 * Select all alerts for a specific alert kind
 */
export const selectAlertsByKind =
  (alertKind: AlertKind) =>
  (state: AlertingState): Alert[] => {
    return state.alertsByKind[alertKind]?.data || [];
  };

/**
 * Select alert count for a specific alert kind
 */
export const selectAlertCountByKind =
  (alertKind: AlertKind) =>
  (state: AlertingState): number => {
    return state.alertsByKind[alertKind]?.count || 0;
  };
