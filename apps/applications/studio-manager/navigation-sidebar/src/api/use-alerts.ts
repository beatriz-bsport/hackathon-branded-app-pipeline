import { useEffect } from "react";

import {
  ALERT_KINDS,
  type AlertKind,
  fetchAlertsAction,
  selectAlertCountByKind,
  selectAlertsByKind,
  useAlertingStore,
} from "@bsport/store-staff-management-alerting";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

interface UseFetchAlertsByKindParams<T extends AlertKind> {
  alertKind: T;
  page?: number;
  pageSize?: number;
  refetchInterval?: number;
}

const DEFAULT_ALERTS_REFETCH_INTERVAL = 60 * 1000;

/**
 * Hook to fetch and manage alerts for a specific alert kind with automatic data fetching
 *
 * @param params - Configuration object for fetching alerts
 * @param params.alertKind - The type of alert to fetch (1-9, see ALERT_KINDS)
 * @param params.page - Optional page number for pagination (1-based)
 * @param params.pageSize - Optional number of alerts per page
 * @param params.refetchInterval - Optional interval in milliseconds for automatic refetching
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
 *   pageSize: 10,
 *   refetchInterval: 60000 // Refetch every minute
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
export function useFetchAlertsByKind<T extends AlertKind>({
  alertKind,
  page,
  pageSize,
  refetchInterval,
}: UseFetchAlertsByKindParams<T>) {
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
      refetchInterval,
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

/**
 * Hook to fetch all alert kinds used in the NotificationsModal with automatic refetching
 *
 * This hook fetches alerts for all 7 alert kinds that are displayed in the NotificationsModal:
 * - UNEVEN_INVOICE (billing)
 * - NEW_ORDER (orders)
 * - REMINDER_NOTE (tasks)
 * - PRIVATE_BOOKING_INCOMPLETE (private booking incomplete)
 * - COMPANY_ONBOARDING (company onboarding)
 * - UNPAID_PRIVATE_BOOKING (unpaid appointments)
 * - NEW_TUTORIAL_SECTION_OR_LESSON (tutorials)
 *
 * @param refetchInterval - Optional interval in milliseconds for automatic refetching (default: 60000ms = 1 minute)
 */
export function useAlerts(
  refetchInterval: number = DEFAULT_ALERTS_REFETCH_INTERVAL,
) {
  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.UNEVEN_INVOICE,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.NEW_ORDER,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.REMINDER_NOTE,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.PRIVATE_BOOKING_INCOMPLETE,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.COMPANY_ONBOARDING,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.UNPAID_PRIVATE_BOOKING,
    refetchInterval,
  });

  useFetchAlertsByKind({
    alertKind: ALERT_KINDS.NEW_TUTORIAL_SECTION_OR_LESSON,
    refetchInterval,
  });
}
