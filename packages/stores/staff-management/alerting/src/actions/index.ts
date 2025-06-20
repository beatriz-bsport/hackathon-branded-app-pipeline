import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchAlertsAPI, fetchAllAlertsAPI } from "#src/api";
import type { Alert, AlertKind } from "#src/types";

import { setAlertsForKind, setAllAlerts } from "./store";

/**
 * Fetches alerts for a specific alert kind with pagination
 * @param params.alert_kind The type of alert to fetch
 * @param params.page The page number (defaults to 1)
 * @param params.page_size The number of items per page (defaults to 10)
 */
export const fetchAlertsAction: Action<
  { alert_kind: AlertKind; page?: number; page_size?: number },
  PaginatedResponse<Alert>
> = async (fetch, params) => {
  const [uri, init] = fetchAlertsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setAlertsForKind({
        alertKind: params.alert_kind,
        alerts: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      new Error(`Failed to fetch alerts for kind ${params.alert_kind}`, {
        cause: error,
      }),
  );
};

/**
 * Fetches all alerts (across all types) with pagination
 * @param params.page The page number (defaults to 1)
 * @param params.page_size The number of items per page (defaults to 10)
 */
export const fetchAllAlertsAction: Action<
  { page?: number; page_size?: number },
  PaginatedResponse<Alert>
> = async (fetch, params) => {
  const [uri, init] = fetchAllAlertsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setAllAlerts({
        alerts: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch all alerts", { cause: error }),
  );
};
