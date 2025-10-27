import { useCallback } from "react";

import { fetchAppointmentsAction } from "@bsport/store-booking-appointment";
import { fetchSubscriptionsAction } from "@bsport/store-buyables-subscription";
import { useAsync } from "@bsport/use-async";

import { useFetchAppointmentPasses } from "#src/hooks/api/use-fetch-appointment-passes";
import { useFetchEmailTemplateSummaries } from "#src/hooks/api/use-fetch-email-template-summaries";
import { useFetchGroupActivities } from "#src/hooks/api/use-fetch-group-activities";
import { useFetchLocations } from "#src/hooks/api/use-fetch-location";
import { useFetchPasses } from "#src/hooks/api/use-fetch-passes";
import { useFetchSmartlists } from "#src/hooks/api/use-fetch-smartlists";
import { fetch } from "#src/utils/fetch";

import { useFetchEstablishments } from "./use-fetch-establishments";

const fetchAppointmentsBound = fetchAppointmentsAction.bind(null, fetch);

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
  const { handleFetchGroupActivities, isGroupActivitiesLoading } =
    useFetchGroupActivities();
  const { handleFetchAppointmentPasses, isAppointmentPassesLoading } =
    useFetchAppointmentPasses();
  const { handleFetchLocations, isLocationsLoading } = useFetchLocations();
  const { handleFetchEstablishments, isEstablishmentsLoading } =
    useFetchEstablishments();
  const [, fetchAppointments] = useAsync<typeof fetchAppointmentsBound>({
    asyncFn: fetchAppointmentsBound,
  });

  const [, fetchSubscriptions] = useAsync<typeof fetchSubscriptionsBound>({
    asyncFn: fetchSubscriptionsBound,
  });

  const fetchMarketingNotificationDependencies = useCallback(
    ({
      establishmentIds,
      groupActivityIds,
      privateServiceIds,
      privatePassIds,
      paymentPackIds,
      subscriptionIds,
      emailTemplateIds,
      smartlistIds,
      locationIds,
    }: {
      groupActivityIds: number[];
      locationIds: number[];
      establishmentIds: number[];
      privateServiceIds: number[];
      privatePassIds: number[];
      paymentPackIds: number[];
      subscriptionIds: number[];
      emailTemplateIds: number[];
      smartlistIds: number[];
    }) => {
      Promise.allSettled([
        handleFetchGroupActivities({
          inIdList: groupActivityIds,
          page: 1,
          pageSize: groupActivityIds.length,
        }),
        fetchAppointments({
          id__in: privateServiceIds,
        }),
        handleFetchLocations({
          id__in: locationIds,
        }),
        handleFetchEstablishments({
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
      fetchAppointments,
      fetchSubscriptions,
      handleFetchLocations,
      handleFetchPasses,
      handleFetchEmailTemplateSummaries,
      handleFetchSmartlists,
      handleFetchAppointmentPasses,
      handleFetchGroupActivities,
      handleFetchEstablishments,
    ],
  );

  return {
    areDependenciesLoading:
      isPassesLoading ||
      isSmartlistsLoading ||
      isEmailTemplateSummariesLoading ||
      isAppointmentPassesLoading ||
      isGroupActivitiesLoading ||
      isLocationsLoading ||
      isEstablishmentsLoading,
    fetchMarketingNotificationDependencies,
  };
}
