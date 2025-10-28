import { AppointmentSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/AppointmentSelector";
import { EstablishmentGroupSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/EstablishmentGroupSelector";
import { LocationSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/LocationSelector";
import { MetaActivitySelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/MetaActivitySelector";
import { PassSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/PassSelector";
import { SubscriptionSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/SubscriptionSelector";
import type { TriggerTypeSelectorConfig } from "#src/components/MarketingNotificationEdition/TriggerTypeStep";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import type { NotificationType } from "#src/utils/types";

export const TriggerTypeSelector = ({
  selectedConfig,
  onSelectTriggerType,
}: {
  selectedConfig?: TriggerTypeSelectorConfig;
  onSelectTriggerType?: ({
    triggerType,
    objectIds,
  }: {
    triggerType: NotificationType;
    objectIds: number[];
  }) => void;
}) => {
  if (!selectedConfig) return null;

  if (
    selectedConfig.hasSelector &&
    "mode" in selectedConfig &&
    (selectedConfig.mode === "workshop" ||
      selectedConfig.mode === "groupActivity")
  ) {
    return (
      <MetaActivitySelector
        mode={selectedConfig.mode}
        onSelectActivity={(metaActivity) => {
          const metaActivityId = metaActivity?.id;
          if (metaActivityId) {
            onSelectTriggerType?.({
              objectIds: [metaActivityId],
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  if (
    selectedConfig.hasSelector &&
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.location
  ) {
    return (
      <LocationSelector
        onSelectLocation={(location) => {
          const locationId = location?.id;
          if (locationId) {
            onSelectTriggerType?.({
              objectIds: [locationId],
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  if (
    selectedConfig.hasSelector &&
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.establishment
  ) {
    return (
      <EstablishmentGroupSelector
        onSelectEstablishmentGroup={(establishment) => {
          const establishmentId = establishment?.id;
          if (establishmentId) {
            onSelectTriggerType?.({
              objectIds: [establishmentId],
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  if (
    selectedConfig.hasSelector &&
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.privateService
  ) {
    return (
      <AppointmentSelector
        onSelectAppointment={(appointment) => {
          const appointmentId = appointment?.id;
          if (appointmentId) {
            onSelectTriggerType?.({
              objectIds: [appointmentId],
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  if (
    selectedConfig.hasSelector &&
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.subscription
  ) {
    return (
      <SubscriptionSelector
        onSelectSubscription={(subscription) => {
          const subscriptionId = subscription?.id;
          if (subscriptionId) {
            onSelectTriggerType?.({
              objectIds: [subscriptionId],
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  if (
    selectedConfig.hasSelector &&
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.paymentPack
  ) {
    return (
      <PassSelector
        onSelectPasses={(passes) => {
          if (passes?.length > 0) {
            onSelectTriggerType?.({
              objectIds: passes.map((pass) => pass.id),
              triggerType: selectedConfig.type,
            });
          }
        }}
      />
    );
  }

  return <p>{selectedConfig.translationKey} Placeholder</p>;
};
