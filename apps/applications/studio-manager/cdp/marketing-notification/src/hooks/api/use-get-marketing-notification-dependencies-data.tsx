import { useMemo } from "react";

import {
  type Appointment,
  selectAllAppointments,
  useAppointmentStore,
} from "@bsport/store-booking-appointment";
import {
  type MetaActivity,
  selectGroupActivities,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import {
  type AppointmentPass,
  selectAppointmentPassesList,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";
import {
  type Pass,
  selectActivePasses,
  usePassStore,
} from "@bsport/store-buyables-pass";
import {
  type Subscription,
  selectAllSubscriptions,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";
import {
  type Establishment,
  selectEstablishments,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";

export const useGetMarketingNotificationDependenciesData = () => {
  const groupActivities = useGroupActivityStore((state) =>
    selectGroupActivities(state),
  );

  const appointments = useAppointmentStore((state) =>
    selectAllAppointments(state),
  );

  const establishments = useEstablishmentStore((state) =>
    selectEstablishments(state),
  );

  const appointmentPasses = useAppointmentPassStore((state) =>
    selectAppointmentPassesList(state),
  );

  const subscriptions = useSubscriptionStore((state) =>
    selectAllSubscriptions(state),
  );

  const passes = usePassStore((state) => selectActivePasses(state));

  const groupActivitiesById = useMemo(
    () =>
      groupActivities.reduce(
        (acc, activity) => {
          acc[activity.id] = activity;
          return acc;
        },
        {} as Record<number, MetaActivity>,
      ),
    [groupActivities],
  );

  const appointmentsById = useMemo(
    () =>
      appointments.reduce(
        (acc, appointment) => {
          acc[appointment.id] = appointment;
          return acc;
        },
        {} as Record<number, Appointment>,
      ),
    [appointments],
  );

  const establishmentsById = useMemo(
    () =>
      establishments.reduce(
        (acc, establishment) => {
          acc[establishment.id] = establishment;
          return acc;
        },
        {} as Record<number, Establishment>,
      ),
    [establishments],
  );

  const appointmentPassesById = useMemo(
    () =>
      appointmentPasses.reduce(
        (acc, appointmentPass) => {
          acc[appointmentPass.id] = appointmentPass;
          return acc;
        },
        {} as Record<number, AppointmentPass>,
      ),
    [appointmentPasses],
  );

  const subscriptionsById = useMemo(
    () =>
      subscriptions.reduce(
        (acc, subscription) => {
          acc[subscription.id] = subscription;
          return acc;
        },
        {} as Record<number, Subscription>,
      ),
    [subscriptions],
  );

  const passesById = useMemo(
    () =>
      passes.reduce(
        (acc, pass) => {
          acc[pass.id] = pass;
          return acc;
        },
        {} as Record<number, Pass>,
      ),
    [passes],
  );

  return {
    groupActivitiesById,
    appointmentsById,
    establishmentsById,
    appointmentPassesById,
    subscriptionsById,
    passesById,
  };
};
