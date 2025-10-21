import { useCallback } from "react";

import { fetchAppointmentsAction } from "@bsport/store-booking-appointment";
import { fetchGroupActivitiesAndWorkshopsAction } from "@bsport/store-booking-group-activity";
import { fetchAppointmentPassesAction } from "@bsport/store-buyables-appointment-pass";
import { fetchPassesAction } from "@bsport/store-buyables-pass";
import { fetchSubscriptionsAction } from "@bsport/store-buyables-subscription";
import { fetchEstablishmentsAction } from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { useFetchEmailTemplateSummaries } from "#src/hooks/api/use-fetch-email-template-summaries";
import { fetch } from "#src/utils/fetch";

import { useFetchSmartlists } from "./use-fetch-smartlists";

const fetchActivitiesBound = fetchGroupActivitiesAndWorkshopsAction.bind(
  null,
  fetch,
);
const fetchAppointmentsBound = fetchAppointmentsAction.bind(null, fetch);
const fetchEstablishmentsBound = fetchEstablishmentsAction.bind(null, fetch);
const fetchPaginatedAppointmentPassesBound = fetchAppointmentPassesAction.bind(
  null,
  fetch,
);
const fetchSubscriptionsBound = fetchSubscriptionsAction.bind(null, fetch);
const fetchPassesBound = fetchPassesAction.bind(null, fetch);

/**
 * Hook for fetching marketing notification dependencies.
 *
 * This hook retrieves related entities (group activities, private services, establishments,
 * private passes, and subscriptions) that are referenced by marketing notifications.
 *
 * @return Object containing ID-to-entity maps for each dependency type and a fetch function
 */
export function useFetchMarketingNotificationDependencies() {
  const { handleFetchSmartlists } = useFetchSmartlists();
  const { handleFetchEmailTemplateSummaries } =
    useFetchEmailTemplateSummaries();
  const [, fetchActivities] = useAsync<typeof fetchActivitiesBound>({
    asyncFn: fetchActivitiesBound,
  });

  const [, fetchAppointments] = useAsync<typeof fetchAppointmentsBound>({
    asyncFn: fetchAppointmentsBound,
  });

  const [, fetchEstablishments] = useAsync<typeof fetchEstablishmentsBound>({
    asyncFn: fetchEstablishmentsBound,
  });

  const [, fetchPaginatedAppointmentPasses] = useAsync<
    typeof fetchPaginatedAppointmentPassesBound
  >({
    asyncFn: fetchPaginatedAppointmentPassesBound,
  });

  const [, fetchSubscriptions] = useAsync<typeof fetchSubscriptionsBound>({
    asyncFn: fetchSubscriptionsBound,
  });

  const [, fetchPasses] = useAsync<typeof fetchPassesBound>({
    asyncFn: fetchPassesBound,
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
      smartlistIds,
    }: {
      groupActivityIds: number[];
      establishmentIds: number[];
      privateServiceIds: number[];
      privatePassIds: number[];
      paymentPackIds: number[];
      subscriptionIds: number[];
      emailTemplateIds: number[];
      smartlistIds: number[];
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
        handleFetchSmartlists({ smartlistIds }),
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
      handleFetchSmartlists,
    ],
  );

  return {
    fetchMarketingNotificationDependencies,
  };
}
