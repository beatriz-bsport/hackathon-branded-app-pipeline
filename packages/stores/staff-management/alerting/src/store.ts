import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Alert, AlertKind } from "#src/types";

export interface AlertingState {
  // Alerts organized by alert kind
  alertsByKind: {
    [K in AlertKind]?: {
      data: Alert[];
      count: number;
      page: number;
    };
  };

  // All alerts combined
  allAlerts: {
    data: Alert[];
    count: number;
    page: number;
  };
}

export const alertingStore = createStore<AlertingState>()(() => ({
  alertsByKind: {},
  allAlerts: {
    data: [],
    count: 0,
    page: 1,
  },
}));

/**
 * Store action to set alerts for a specific alert kind
 */
export const setAlertsForKind = ({
  alertKind,
  alerts,
  count,
  page,
}: {
  alertKind: AlertKind;
  alerts: Alert[];
  count: number;
  page: number;
}) => {
  alertingStore.setState((state) => ({
    ...state,
    alertsByKind: {
      ...state.alertsByKind,
      [alertKind]: {
        data: alerts,
        count,
        page,
      },
    },
  }));
};

/**
 * Store action to set all alerts (combined)
 */
export const setAllAlerts = ({
  alerts,
  count,
  page,
}: {
  alerts: Alert[];
  count: number;
  page: number;
}) => {
  alertingStore.setState((state) => ({
    ...state,
    allAlerts: {
      data: alerts,
      count,
      page,
    },
  }));
};

/**
 * Hook to use the alerting store
 */
export const useAlertingStore = bindStore(alertingStore);
