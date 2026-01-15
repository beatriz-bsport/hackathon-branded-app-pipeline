import { useId } from "react";

import { TextFieldProps, Toggle } from "@bsport/kaizen-primitive-core";

import { SmartlistsSelector } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/SmartlistsSelector";
import { useTranslation } from "#src/utils/i18n";

export type SmartlistsSelectorType = "excluded" | "included";

type SmartlistsFormFieldProps = {
  selectedIncludedSmartlists?: number[];
  selectedExcludedSmartlists?: number[];
  isIncludedSmartlistsEnabled: boolean;
  isExcludedSmartlistsEnabled: boolean;
  includedSmartlistsTextfieldProps?: TextFieldProps;
  excludedSmartlistsTextfieldProps?: TextFieldProps;
  onSmartlistsChange?: ({
    type,
    smartlistIds,
  }: {
    type: SmartlistsSelectorType;
    smartlistIds: number[];
  }) => void;
  onToggleField?: ({
    type,
    checked,
  }: {
    type: SmartlistsSelectorType;
    checked: boolean;
  }) => void;
};

type SmartlistSection = {
  key: string;
  type: SmartlistsSelectorType;
  isEnabled: boolean;
  textfieldProps?: TextFieldProps;
  labelKey: string;
  defaultValues: number[];
};

export const SmartlistsFormField = ({
  selectedIncludedSmartlists,
  selectedExcludedSmartlists,
  isIncludedSmartlistsEnabled,
  isExcludedSmartlistsEnabled,
  includedSmartlistsTextfieldProps,
  excludedSmartlistsTextfieldProps,
  onSmartlistsChange,
  onToggleField,
}: SmartlistsFormFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const id = useId();
  const sections: SmartlistSection[] = [
    {
      key: `${id}-included`,
      type: "included",
      isEnabled: isIncludedSmartlistsEnabled,
      textfieldProps: includedSmartlistsTextfieldProps,
      labelKey: t("steps.notificationRules.smartlists.included.label"),
      defaultValues: selectedIncludedSmartlists ?? [],
    },
    {
      key: `${id}-excluded`,
      type: "excluded",
      isEnabled: isExcludedSmartlistsEnabled,
      textfieldProps: excludedSmartlistsTextfieldProps,
      labelKey: t("steps.notificationRules.smartlists.excluded.label"),
      defaultValues: selectedExcludedSmartlists ?? [],
    },
  ];

  return (
    <div className="flex flex-col gap-sm">
      {sections.map(
        ({ key, type, isEnabled, textfieldProps, labelKey, defaultValues }) => (
          <div key={key}>
            <Toggle
              id={`toggle-${type}-smartlists-selector`}
              label={labelKey}
              checked={isEnabled}
              onToggleChange={(checked) => {
                onToggleField?.({ type, checked });
              }}
            />
            {isEnabled && (
              <div className="ml-sm">
                <SmartlistsSelector
                  onSelectSmartlists={(smartlists) => {
                    const ids = (smartlists || [])
                      .map((smartlist) => smartlist?.id)
                      .filter(Boolean);

                    onSmartlistsChange?.({
                      type,
                      smartlistIds: ids,
                    });
                  }}
                  textfieldProps={textfieldProps}
                  defaultValues={defaultValues}
                />
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
};
