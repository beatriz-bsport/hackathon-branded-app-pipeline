import { useEffect } from "react";

import {
  type AlertKind,
  fetchAlertsAction,
  selectAlertCountByKind,
  selectAlertsByKind,
  useAlertingStore,
} from "@bsport/store-staff-management-alerting";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

interface UseFetchAlertsByKindParams {
  alertKind: AlertKind;
  page?: number;
  pageSize?: number;
}

/**
 * Hook to fetch and manage alerts for a specific alert kind with automatic data fetching
 *
 * @param params - Configuration object for fetching alerts
 * @param params.alertKind - The type of alert to fetch (1-9, see ALERT_KINDS)
 * @param params.page - Optional page number for pagination (1-based)
 * @param params.pageSize - Optional number of alerts per page
 *
 * @returns Object containing:
 * - `alerts` - Array of alerts for the specified kind from the store
 * - `count` - Total number of alerts available for pagination
 * - `isLoading` - Boolean indicating if a fetch operation is in progress
 * - `error` - Error object if the fetch failed, undefined otherwise
 * - `refetch` - Function to manually trigger a new fetch operation
 *
 * @example
 * ```tsx
 * const { alerts, count, isLoading, error, refetch } = useFetchAlertsByKind({
 *   alertKind: ALERT_KINDS.NEW_ORDER,
 *   page: 1,
 *   pageSize: 10
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     <h2>Alerts ({count})</h2>
 *     <ul>
 *       {alerts.map(alert => (
 *         <li key={alert.alert_kind}>{JSON.stringify(alert.data)}</li>
 *       ))}
 *     </ul>
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useFetchAlertsByKind({
  alertKind,
  page,
  pageSize,
}: UseFetchAlertsByKindParams) {
  const alerts = useAlertingStore(selectAlertsByKind(alertKind));
  const count = useAlertingStore(selectAlertCountByKind(alertKind));

  const fetchAlertsAsync = async () => {
    return fetchAlertsAction(fetch, {
      page,
      page_size: pageSize,
      alert_kind: alertKind,
    });
  };

  const [{ isLoading, error }, fetchAlerts] = useAsync<typeof fetchAlertsAsync>(
    {
      asyncFn: fetchAlertsAsync,
      dependencies: [page, pageSize, alertKind],
    },
  );

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    count,
    isLoading,
    error,
    refetch: fetchAlerts,
  };
}
