import { useMemo } from "react";

import {
  selectAllAppointmentMappedById,
  selectSearchedAppointment,
  useAppointmentStore,
} from "@bsport/store-booking-appointment";
import {
  selectGroupActivitiesMappedById,
  selectSearchedGroupActivities,
  useGroupActivityStore,
} from "@bsport/store-booking-group-activity";
import {
  selectAppointmentPassesById,
  selectAppointmentPassesSearched,
  useAppointmentPassStore,
} from "@bsport/store-buyables-appointment-pass";
import {
  selectPassesById,
  selectSearchedPasses,
  usePassStore,
} from "@bsport/store-buyables-pass";
import {
  selectAllSubscriptionMappedById,
  selectFuzzySearchedSubscriptions,
  useSubscriptionStore,
} from "@bsport/store-buyables-subscription";
import {
  type EmailTemplateSummary,
  selectAllEmailTemplateSummaries,
  selectFuzzySearchEmailTemplateSummaries,
  useEmailTemplateStore,
} from "@bsport/store-cdp-email-template";
import {
  selectAllMappedSmartlists,
  selectSearchedSmartlists,
  useSmartlistStore,
} from "@bsport/store-cdp-smartlist";
import {
  selectEstablishmentGroupMappedById,
  selectEstablishmentMappedById,
  selectSearchedEstablishmentGroups,
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

  const appointmentsById = useAppointmentStore(selectAllAppointmentMappedById);

  const searchedAppointments = useAppointmentStore(selectSearchedAppointment);

  const searchedLocations = useEstablishmentStore(selectSearchedEstablishments);

  const locationsById = useEstablishmentStore(selectEstablishmentMappedById);

  const searchedEstablishments = useEstablishmentStore(
    selectSearchedEstablishmentGroups,
  );

  const establishmentsById = useEstablishmentStore(
    selectEstablishmentGroupMappedById,
  );

  const appointmentPassesById = useAppointmentPassStore(
    selectAppointmentPassesById,
  );

  const searchedAppointmentPasses = useAppointmentPassStore(
    selectAppointmentPassesSearched,
  );

  const subscriptionsById = useSubscriptionStore(
    selectAllSubscriptionMappedById,
  );

  const searchedSubscriptions = useSubscriptionStore(
    selectFuzzySearchedSubscriptions,
  );

  const passesById = usePassStore(selectPassesById);

  const searchedPasses = usePassStore(selectSearchedPasses);

  const emailTemplateSummaries = useEmailTemplateStore(
    selectAllEmailTemplateSummaries,
  );

  const searchedEmailTemplates = useEmailTemplateStore(
    selectFuzzySearchEmailTemplateSummaries,
  );

  const smartlistsById = useSmartlistStore(selectAllMappedSmartlists);

  const searchedSmartlists = useSmartlistStore(selectSearchedSmartlists);

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
    searchedAppointments,
    searchedAppointmentPasses,
    searchedEmailTemplates,
    searchedEstablishments,
    searchedGroupActivities,
    searchedLocations,
    searchedPasses,
    searchedSmartlists,
    searchedSubscriptions,
    appointmentsById,
    appointmentPassesById,
    emailTemplatesById,
    establishmentsById,
    groupActivitiesById,
    locationsById,
    passesById,
    smartlistsById,
    subscriptionsById,
  };
};
