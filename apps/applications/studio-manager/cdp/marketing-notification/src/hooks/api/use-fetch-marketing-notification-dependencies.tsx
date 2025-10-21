import { useCallback } from "react";

import { fetchAppointmentsAction } from "@bsport/store-booking-appointment";
import { fetchGroupActivitiesAndWorkshopsAction } from "@bsport/store-booking-group-activity";
import { fetchSubscriptionsAction } from "@bsport/store-buyables-subscription";
import { fetchEstablishmentsAction } from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { useFetchAppointmentPasses } from "#src/hooks/api/use-fetch-appointment-passes";
import { useFetchEmailTemplateSummaries } from "#src/hooks/api/use-fetch-email-template-summaries";
import { useFetchPasses } from "#src/hooks/api/use-fetch-passes";
import { useFetchSmartlists } from "#src/hooks/api/use-fetch-smartlists";
import { fetch } from "#src/utils/fetch";

const fetchActivitiesBound = fetchGroupActivitiesAndWorkshopsAction.bind(
  null,
  fetch,
);
const fetchAppointmentsBound = fetchAppointmentsAction.bind(null, fetch);
const fetchEstablishmentsBound = fetchEstablishmentsAction.bind(null, fetch);
const fetchSubscriptionsBound = fetchSubscriptionsAction.bind(null, fetch);

/**
 * Hook for fetching marketing notification dependencies.
 *
 * This hook retrieves related entities (group activities, private services, establishments,
 * private passes, and subscriptions) that are referenced by marketing notifications.
 *
 * @return Object containing ID-to-entity maps for each dependency type and a fetch function
 */
export function useFetchMarketingNotificationDependencies() {
  const { handleFetchSmartlists, isSmartlistsLoading } = useFetchSmartlists();
  const { handleFetchEmailTemplateSummaries, isEmailTemplateSummariesLoading } =
    useFetchEmailTemplateSummaries();
  const { handleFetchPasses, isPassesLoading } = useFetchPasses();
  const { handleFetchAppointmentPasses, isAppointmentPassesLoading } =
    useFetchAppointmentPasses();
  const [, fetchActivities] = useAsync<typeof fetchActivitiesBound>({
    asyncFn: fetchActivitiesBound,
  });

  const [, fetchAppointments] = useAsync<typeof fetchAppointmentsBound>({
    asyncFn: fetchAppointmentsBound,
  });

  const [, fetchEstablishments] = useAsync<typeof fetchEstablishmentsBound>({
    asyncFn: fetchEstablishmentsBound,
  });

  const [, fetchSubscriptions] = useAsync<typeof fetchSubscriptionsBound>({
    asyncFn: fetchSubscriptionsBound,
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
        handleFetchAppointmentPasses({
          id__in: privatePassIds,
          page: 1,
          page_size: privatePassIds.length,
        }),
        fetchSubscriptions({
          id__in: subscriptionIds,
        }),
        handleFetchPasses({
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
      fetchSubscriptions,
      handleFetchPasses,
      handleFetchEmailTemplateSummaries,
      handleFetchSmartlists,
      handleFetchAppointmentPasses,
    ],
  );

  return {
    areDependenciesLoading:
      isPassesLoading ||
      isSmartlistsLoading ||
      isEmailTemplateSummariesLoading ||
      isAppointmentPassesLoading,
    fetchMarketingNotificationDependencies,
  };
}
