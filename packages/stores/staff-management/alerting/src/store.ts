import { createStore } from "zustand/vanilla";

import { bindStore } from "@bsport/store-base";

import type { Alert, AlertKind } from "#src/types";

interface AlertData {
  data: Alert[];
  count: number;
  page: number;
}

export interface AlertingState {
  alertsByKind: Partial<Record<AlertKind, AlertData>>;
}

const initialState: AlertingState = {
  alertsByKind: {},
};

export const alertingStore = createStore<AlertingState>()(() => initialState);

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
 * Hook to use the alerting store
 */
export const useAlertingStore = bindStore(alertingStore);
