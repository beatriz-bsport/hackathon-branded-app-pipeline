import { TextFieldProps } from "@bsport/kaizen-primitive-core";

import { AppointmentPassSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/AppointmentPassSelector";
import { AppointmentSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/AppointmentSelector";
import { EstablishmentGroupSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/EstablishmentGroupSelector";
import { LocationSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/LocationSelector";
import { MetaActivitySelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/MetaActivitySelector";
import { PassSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/PassSelector";
import { SubscriptionSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/SubscriptionSelector";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import type {
  NotificationType,
  TriggerTypeSelectorConfig,
} from "#src/utils/types";

function isTriggerSelectorConfigMetaActivityType(
  config: TriggerTypeSelectorConfig,
): config is TriggerTypeSelectorConfig & {
  mode: "workshop" | "all" | "groupActivity";
} {
  return "mode" in config && !!config.mode;
}

export type TriggerTypeSelectorProps = {
  selectedConfig?: TriggerTypeSelectorConfig;
  onSelectTriggerType?: ({
    triggerType,
    objectIds,
  }: {
    triggerType: NotificationType;
    objectIds: number[];
  }) => void;
  selectedValues?: number[];
  textfieldProps?: TextFieldProps;
};

export const TriggerTypeSelector = ({
  selectedConfig,
  selectedValues = [],
  textfieldProps,
  onSelectTriggerType,
}: TriggerTypeSelectorProps) => {
  if (!selectedConfig) return null;

  if (
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.workshop ||
    selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.groupActivity
  ) {
    return (
      <MetaActivitySelector
        defaultValues={selectedValues}
        mode={
          isTriggerSelectorConfigMetaActivityType(selectedConfig)
            ? selectedConfig.mode
            : "all"
        }
        onSelectActivity={(metaActivity) => {
          const metaActivityId = metaActivity?.id;
          onSelectTriggerType?.({
            objectIds: metaActivityId ? [metaActivityId] : [],
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.location) {
    return (
      <LocationSelector
        defaultValues={selectedValues}
        onSelectLocation={(location) => {
          const locationId = location?.id;
          onSelectTriggerType?.({
            objectIds: locationId ? [locationId] : [],
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.establishment) {
    return (
      <EstablishmentGroupSelector
        defaultValues={selectedValues}
        onSelectEstablishmentGroup={(establishment) => {
          const establishmentId = establishment?.id;
          onSelectTriggerType?.({
            objectIds: establishmentId ? [establishmentId] : [],
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.privateService) {
    return (
      <AppointmentSelector
        defaultValues={selectedValues}
        onSelectAppointment={(appointment) => {
          const appointmentId = appointment?.id;
          onSelectTriggerType?.({
            objectIds: appointmentId ? [appointmentId] : [],
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.subscription) {
    return (
      <SubscriptionSelector
        defaultValues={selectedValues}
        onSelectSubscription={(subscription) => {
          const subscriptionId = subscription?.id;
          onSelectTriggerType?.({
            objectIds: subscriptionId ? [subscriptionId] : [],
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.paymentPack) {
    return (
      <PassSelector
        defaultValues={selectedValues}
        onSelectPasses={(passes) => {
          onSelectTriggerType?.({
            objectIds: (passes || []).map((pass) => pass.id),
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.privatePass) {
    return (
      <AppointmentPassSelector
        defaultValues={selectedValues}
        onSelectAppointmentPasses={(passes) => {
          onSelectTriggerType?.({
            objectIds: (passes || []).map((pass) => pass.id),
            triggerType: selectedConfig.type,
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  return null;
};
