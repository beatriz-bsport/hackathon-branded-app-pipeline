import { useMemo, useState } from "react";

import { Select, Title } from "@bsport/kaizen-primitive-core";

import { EstablishmentGroupSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/EstablishmentGroupSelector";
import { LocationSelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/LocationSelector";
import { MetaActivitySelector } from "#src/components/MarketingNotificationEdition/TriggerTypeSelector/MetaActivitySelector";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type { NotificationType } from "#src/utils/types";

type TriggerTypeStepProps = {
  onSelectTriggerType?: ({
    triggerType,
    objectIds,
  }: {
    triggerType: NotificationType;
    objectIds: number[];
  }) => void;
};

type ExcludedNotificationTypesFromSelector =
  | "unknown"
  | "unknown_groupActivity";

type SelectableNotificationType = Exclude<
  NotificationType,
  ExcludedNotificationTypesFromSelector
>;

type TriggerTypeSelectorConfig = {
  type: SelectableNotificationType;
  translationKey: string;
  hasSelector: boolean;
  mode?: "groupActivity" | "workshop" | "all";
};

// Centralized configuration
const TRIGGER_CONFIG: TriggerTypeSelectorConfig[] = [
  {
    type: NOTIFICATION_ADVANCED_TYPE.groupActivity,
    translationKey: "groupActivity",
    hasSelector: true, // temporary
    mode: "groupActivity" as const,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.workshop,
    translationKey: "workshop",
    hasSelector: true,
    mode: "workshop" as const,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.establishment,
    translationKey: "establishment",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.location,
    translationKey: "location",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.privateService,
    translationKey: "privateService",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.paymentPack,
    translationKey: "paymentPack",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.privatePass,
    translationKey: "privatePass",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.subscription,
    translationKey: "subscription",
    hasSelector: false,
  },
  {
    type: NOTIFICATION_ADVANCED_TYPE.birthday,
    translationKey: "birthday",
    hasSelector: false,
  },
] as const;

export const TriggerTypeStep = ({
  onSelectTriggerType,
}: TriggerTypeStepProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const [selectedTriggerType, setSelectedTriggerType] =
    useState<SelectableNotificationType>(
      NOTIFICATION_ADVANCED_TYPE.groupActivity,
    );

  // Memoized computations
  const { selectOptions, translationToTypeMap, selectedConfig } =
    useMemo(() => {
      const options = TRIGGER_CONFIG.map((config) => ({
        id: config.type,
        label: String(
          t(
            //@ts-expect-error bad management of dynamic keys
            `steps.triggerType.notificationType.choices.${config.translationKey}`,
          ),
        ),
      }));

      const translationMap = TRIGGER_CONFIG.reduce(
        (acc, config) => {
          const translation = String(
            t(
              //@ts-expect-error bad management of dynamic keys
              `steps.triggerType.notificationType.choices.${config.translationKey}`,
            ),
          );

          acc[translation] = config.type;
          return acc;
        },
        {} as Record<string, SelectableNotificationType>,
      );

      const currentConfig = TRIGGER_CONFIG.find(
        (config) => config.type === selectedTriggerType,
      );

      return {
        selectOptions: options,
        translationToTypeMap: translationMap,
        selectedConfig: currentConfig,
      };
    }, [selectedTriggerType]);

  const handleTriggerSelect = (translationLabel: string) => {
    const triggerType = translationToTypeMap[translationLabel];
    setSelectedTriggerType(triggerType);
  };

  const currentLabel = selectedConfig
    ? String(
        t(
          //@ts-expect-error bad management of dynamic keys
          `steps.triggerType.notificationType.choices.${selectedConfig.translationKey}`,
          { returnObjects: false },
        ),
      )
    : "";

  return (
    <div className="flex flex-col gap-md w-full">
      <Title htmlVariant="h3">{t("steps.triggerType.title")}</Title>
      <Select
        fullWidth
        label={t("steps.triggerType.notificationType.label")}
        id="notification-trigger-type-select"
        value={currentLabel}
        items={selectOptions}
        onSelect={handleTriggerSelect}
      />
      <TriggerTypeSelector
        selectedConfig={selectedConfig}
        onSelectTriggerType={onSelectTriggerType}
      />
    </div>
  );
};

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

  return <p>{selectedConfig.translationKey} Placeholder</p>;
};
