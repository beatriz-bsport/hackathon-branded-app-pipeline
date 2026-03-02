import { TextFieldProps } from "@bsport/kaizen-primitive-core";

import { AppointmentPassSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/AppointmentPassSelector";
import { AppointmentSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/AppointmentSelector";
import { EstablishmentGroupSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/EstablishmentGroupSelector";
import { LocationSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/LocationSelector";
import { MetaActivitySelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/MetaActivitySelector";
import { PassSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/PassSelector";
import { SubscriptionSelector } from "#src/components/MarketingNotificationBuilder/TriggerTypeSelector/SubscriptionSelector";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import type { TriggerTypeSelectorConfig } from "#src/utils/types";

function isTriggerSelectorConfigMetaActivityType(
  config: TriggerTypeSelectorConfig,
): config is TriggerTypeSelectorConfig & {
  mode: "workshop" | "all" | "groupActivity";
} {
  return "mode" in config && !!config.mode;
}

export type TriggerTypeSelectorProps = {
  selectedConfig?: TriggerTypeSelectorConfig;
  onSelectTriggerType?: ({ itemIds }: { itemIds: number[] }) => void;
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
        key={String(selectedConfig.mode)}
        defaultValues={selectedValues}
        mode={
          isTriggerSelectorConfigMetaActivityType(selectedConfig)
            ? selectedConfig.mode
            : "all"
        }
        onSelectActivity={(metaActivity) => {
          const metaActivityId = metaActivity?.id;
          onSelectTriggerType?.({
            itemIds: metaActivityId ? [metaActivityId] : [],
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
            itemIds: locationId ? [locationId] : [],
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
            itemIds: establishmentId ? [establishmentId] : [],
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.appointment) {
    return (
      <AppointmentSelector
        defaultValues={selectedValues}
        onSelectAppointment={(appointment) => {
          const appointmentId = appointment?.id;
          onSelectTriggerType?.({
            itemIds: appointmentId ? [appointmentId] : [],
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
            itemIds: subscriptionId ? [subscriptionId] : [],
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.pass) {
    return (
      <PassSelector
        defaultValues={selectedValues}
        onSelectPasses={(passes) => {
          onSelectTriggerType?.({
            itemIds: (passes || [])
              .filter((pass) => !!pass)
              .map((pass) => pass.id),
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  if (selectedConfig.type === NOTIFICATION_ADVANCED_TYPE.appointmentPass) {
    return (
      <AppointmentPassSelector
        defaultValues={selectedValues}
        onSelectAppointmentPasses={(passes) => {
          onSelectTriggerType?.({
            itemIds: (passes || [])
              .filter((pass) => !!pass)
              .map((pass) => pass?.id),
          });
        }}
        textfieldProps={textfieldProps}
      />
    );
  }

  return null;
};
