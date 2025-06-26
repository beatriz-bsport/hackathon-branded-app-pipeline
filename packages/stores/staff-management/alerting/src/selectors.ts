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

/**
 * Select all alerts (combined across all types)
 */
export const selectAllAlerts = (state: AlertingState): Alert[] => {
  return state.allAlerts.data;
};

/**
 * Select all alerts count
 */
export const selectAllAlertsCount = (state: AlertingState): number => {
  return state.allAlerts.count;
};

/**
 * Get total alert count across all kinds (for badge/notification count)
 */
export const selectTotalAlertCount = (state: AlertingState): number => {
  return Object.values(state.alertsByKind).reduce(
    (total, alertData) => total + (alertData?.count || 0),
    0,
  );
};
