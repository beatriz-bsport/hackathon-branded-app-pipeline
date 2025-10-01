import { useCallback, useMemo } from "react";

import {
  type Appointment,
  fetchAppointmentsAction,
  selectAllAppointments,
  useAppointmentStore,
} from "@bsport/store-booking-appointment";
import {
  type MetaActivity,
  fetchGroupActivitiesAction,
  selectGroupActivities,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import {
  type AppointmentPass,
  fetchPaginatedAppointmentPassListAction,
  selectAppointmentPassesList,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";
import {
  type Subscription,
  fetchSubscriptionsAction,
  selectAllSubscriptions,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";
import {
  type Establishment,
  fetchEstablishmentsAction,
  selectEstablishments,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchGroupActivities = fetchGroupActivitiesAction.bind(null, fetch);
const _fetchAppointments = fetchAppointmentsAction.bind(null, fetch);
const _fetchEstablishments = fetchEstablishmentsAction.bind(null, fetch);
const _fetchPaginatedAppointmentPasses =
  fetchPaginatedAppointmentPassListAction.bind(null, fetch);
const _fetchSubscriptions = fetchSubscriptionsAction.bind(null, fetch);

/**
 * Hook for fetching marketing notification dependencies.
 *
 * This hook retrieves related entities (group activities, private services, establishments,
 * private passes, and subscriptions) that are referenced by marketing notifications.
 *
 * @return Object containing ID-to-entity maps for each dependency type and a fetch function
 */
export function useFetchMarketingNotificationDependencies() {
  const [, fetchGroupActivities] = useAsync<typeof _fetchGroupActivities>({
    asyncFn: _fetchGroupActivities,
  });

  const [, fetchAppointments] = useAsync<typeof _fetchAppointments>({
    asyncFn: _fetchAppointments,
  });

  const [, fetchEstablishments] = useAsync<typeof _fetchEstablishments>({
    asyncFn: _fetchEstablishments,
  });

  const [, fetchPaginatedAppointmentPasses] = useAsync<
    typeof _fetchPaginatedAppointmentPasses
  >({
    asyncFn: _fetchPaginatedAppointmentPasses,
  });

  const [, fetchSubscriptions] = useAsync<typeof _fetchSubscriptions>({
    asyncFn: _fetchSubscriptions,
  });

  const groupActivitiesList = useGroupActivityStore((state) =>
    selectGroupActivities(state),
  );

  const appointmentsList = useAppointmentStore((state) =>
    selectAllAppointments(state),
  );

  const establishmentsList = useEstablishmentStore((state) =>
    selectEstablishments(state),
  );

  const appointmentPassList = useAppointmentPassStore((state) =>
    selectAppointmentPassesList(state),
  );

  const subscriptionsList = useSubscriptionStore((state) =>
    selectAllSubscriptions(state),
  );

  const fetchMarketingNotificationDependencies = useCallback(
    ({
      groupActivityIds,
      establishmentIds,
      privateServiceIds,
      privatePassIds,
      subscriptionIds,
    }: {
      groupActivityIds: number[];
      establishmentIds: number[];
      privateServiceIds: number[];
      privatePassIds: number[];
      subscriptionIds: number[];
    }) => {
      Promise.allSettled([
        fetchGroupActivities({
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
      ]);
    },
    [
      fetchGroupActivities,
      fetchAppointments,
      fetchEstablishments,
      fetchPaginatedAppointmentPasses,
      fetchSubscriptions,
    ],
  );

  const groupActivityMapById = useMemo(
    () =>
      groupActivitiesList.reduce(
        (acc, activity) => {
          acc[activity.id] = activity;
          return acc;
        },
        {} as Record<number, MetaActivity>,
      ),
    [groupActivitiesList],
  );

  const appointmentMapById = useMemo(
    () =>
      appointmentsList.reduce(
        (acc, appointment) => {
          acc[appointment.id] = appointment;
          return acc;
        },
        {} as Record<number, Appointment>,
      ),
    [appointmentsList],
  );

  const establishmentMapById = useMemo(
    () =>
      establishmentsList.reduce(
        (acc, establishment) => {
          acc[establishment.id] = establishment;
          return acc;
        },
        {} as Record<number, Establishment>,
      ),
    [establishmentsList],
  );

  const appointmentPassMapById = useMemo(
    () =>
      appointmentPassList.reduce(
        (acc, appointmentPass) => {
          acc[appointmentPass.id] = appointmentPass;
          return acc;
        },
        {} as Record<number, AppointmentPass>,
      ),
    [appointmentPassList],
  );

  const subscriptionMapById = useMemo(
    () =>
      subscriptionsList.reduce(
        (acc, subscription) => {
          acc[subscription.id] = subscription;
          return acc;
        },
        {} as Record<number, Subscription>,
      ),
    [subscriptionsList],
  );

  return {
    groupActivityMapById,
    appointmentMapById,
    establishmentMapById,
    appointmentPassMapById,
    subscriptionMapById,
    fetchMarketingNotificationDependencies,
  };
}
