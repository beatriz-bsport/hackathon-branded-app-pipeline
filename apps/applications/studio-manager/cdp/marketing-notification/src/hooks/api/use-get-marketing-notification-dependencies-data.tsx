import { useMemo } from "react";

import {
  type Appointment,
  selectAllAppointments,
  useAppointmentStore,
} from "@bsport/store-booking-appointment";
import {
  selectGroupActivitiesMappedById,
  selectSearchedGroupActivities,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import {
  selectAppointmentPassesById,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";
import { selectPassesById, usePassStore } from "@bsport/store-buyables-pass";
import {
  type Subscription,
  selectAllSubscriptions,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";
import {
  type EmailTemplateSummary,
  selectAllEmailTemplateSummaries,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import {
  selectAllMappedSmartlists,
  useSmartlistStore,
} from "@bsport/store-cdp-smartlist";
import {
  selectEstablishmentGroupMappedById,
  selectEstablishmentMappedById,
  selectSearchedEstablishments,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";

export const useGetMarketingNotificationDependenciesData = () => {
  const groupActivitiesById = useGroupActivityStore(
    selectGroupActivitiesMappedById,
  );

  const searchedGroupActivities = useGroupActivityStore(
    selectSearchedGroupActivities,
  );

  const appointments = useAppointmentStore(selectAllAppointments);

  const searchedEstablishments = useEstablishmentStore(
    selectSearchedEstablishments,
  );

  const establishmentsById = useEstablishmentStore(
    selectEstablishmentMappedById,
  );

  const establishmentGroupsById = useEstablishmentStore(
    selectEstablishmentGroupMappedById,
  );

  const appointmentPassesById = useAppointmentPassStore(
    selectAppointmentPassesById,
  );

  const subscriptions = useSubscriptionStore(selectAllSubscriptions);

  const passesById = usePassStore(selectPassesById);

  const emailTemplateSummaries = useEmailTemplateStore(
    selectAllEmailTemplateSummaries,
  );

  const smartlistsById = useSmartlistStore(selectAllMappedSmartlists);

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

  const emailTemplatesById = useMemo(
    () =>
      emailTemplateSummaries.reduce(
        (acc, template) => {
          acc[template.id] = template;
          return acc;
        },
        {} as Record<number, EmailTemplateSummary>,
      ),
    [emailTemplateSummaries],
  );

  return {
    searchedGroupActivities,
    groupActivitiesById,
    appointmentsById,
    searchedLocations: searchedEstablishments,
    locationsById: establishmentsById,
    establishmentsById: establishmentGroupsById,
    appointmentPassesById,
    subscriptionsById,
    passesById,
    emailTemplatesById,
    smartlistsById,
  };
};
