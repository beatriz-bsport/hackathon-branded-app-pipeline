import { useCallback } from "react";

import { fetchAppointmentsAction } from "@bsport/store-booking-appointment";
import { fetchGroupActivitiesAndWorkshopsAction } from "@bsport/store-booking-group-activity";
import { fetchAppointmentPassesAction } from "@bsport/store-buyables-appointment-pass";
import { fetchPassesAction } from "@bsport/store-buyables-pass";
import { fetchSubscriptionsAction } from "@bsport/store-buyables-subscription";
import { fetchEstablishmentsAction } from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

import { useFetchEmailTemplateSummaries } from "./use-fetch-email-template-summaries";

const fetchActivitiesBinded = fetchGroupActivitiesAndWorkshopsAction.bind(
  null,
  fetch,
);
const fetchAppointmentsBinded = fetchAppointmentsAction.bind(null, fetch);
const fetchEstablishmentsBinded = fetchEstablishmentsAction.bind(null, fetch);
const fetchPaginatedAppointmentPassesBinded = fetchAppointmentPassesAction.bind(
  null,
  fetch,
);
const fetchSubscriptionsBinded = fetchSubscriptionsAction.bind(null, fetch);
const fetchPassesBinded = fetchPassesAction.bind(null, fetch);

/**
 * Hook for fetching marketing notification dependencies.
 *
 * This hook retrieves related entities (group activities, private services, establishments,
 * private passes, and subscriptions) that are referenced by marketing notifications.
 *
 * @return Object containing ID-to-entity maps for each dependency type and a fetch function
 */
export function useFetchMarketingNotificationDependencies() {
  const { handleFetchEmailTemplateSummaries } =
    useFetchEmailTemplateSummaries();
  const [, fetchActivities] = useAsync<typeof fetchActivitiesBinded>({
    asyncFn: fetchActivitiesBinded,
  });

  const [, fetchAppointments] = useAsync<typeof fetchAppointmentsBinded>({
    asyncFn: fetchAppointmentsBinded,
  });

  const [, fetchEstablishments] = useAsync<typeof fetchEstablishmentsBinded>({
    asyncFn: fetchEstablishmentsBinded,
  });

  const [, fetchPaginatedAppointmentPasses] = useAsync<
    typeof fetchPaginatedAppointmentPassesBinded
  >({
    asyncFn: fetchPaginatedAppointmentPassesBinded,
  });

  const [, fetchSubscriptions] = useAsync<typeof fetchSubscriptionsBinded>({
    asyncFn: fetchSubscriptionsBinded,
  });

  const [, fetchPasses] = useAsync<typeof fetchPassesBinded>({
    asyncFn: fetchPassesBinded,
  });

  const fetchMarketingNotificationDependencies = useCallback(
    ({
      groupActivityIds,
      establishmentIds,
      privateServiceIds,
      privatePassIds,
      paymentPackIds,
      subscriptionIds,
      emailTemplateIds,
    }: {
      groupActivityIds: number[];
      establishmentIds: number[];
      privateServiceIds: number[];
      privatePassIds: number[];
      paymentPackIds: number[];
      subscriptionIds: number[];
      emailTemplateIds: number[];
    }) => {
      Promise.allSettled([
        fetchActivities({
          inIdList: groupActivityIds,
          page: 1,
          pageSize: groupActivityIds.length,
        }),
        fetchAppointments({
          id__in: privateServiceIds,
        }),
        fetchEstablishments({
          id__in: establishmentIds,
        }),
        fetchPaginatedAppointmentPasses({
          id__in: privatePassIds,
          page: 1,
          page_size: privatePassIds.length,
        }),
        fetchSubscriptions({
          id__in: subscriptionIds,
        }),
        fetchPasses({
          id__in: paymentPackIds,
          page: 1,
          page_size: paymentPackIds.length,
        }),
        handleFetchEmailTemplateSummaries({ emailTemplateIds }),
      ]);
    },
    [
      fetchActivities,
      fetchAppointments,
      fetchEstablishments,
      fetchPaginatedAppointmentPasses,
      fetchSubscriptions,
      fetchPasses,
      handleFetchEmailTemplateSummaries,
    ],
  );

  return {
    fetchMarketingNotificationDependencies,
  };
}
