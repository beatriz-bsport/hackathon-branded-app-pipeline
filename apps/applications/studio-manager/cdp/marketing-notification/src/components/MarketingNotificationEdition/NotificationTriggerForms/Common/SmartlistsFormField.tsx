import { useId } from "react";

import { TextFieldProps, Toggle } from "@bsport/kaizen-primitive-core";

import { SmartlistsSelector } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/SmartlistsSelector";
import { useTranslation } from "#src/utils/i18n";

export type SmartlistsSelectorType = "excluded" | "included";

type SmartlistsFormFieldProps = {
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
};

export const SmartlistsFormField = ({
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
    },
    {
      key: `${id}-excluded`,
      type: "excluded",
      isEnabled: isExcludedSmartlistsEnabled,
      textfieldProps: excludedSmartlistsTextfieldProps,
      labelKey: t("steps.notificationRules.smartlists.excluded.label"),
    },
  ];

  return (
    <div className="flex flex-col gap-sm">
      {sections.map(({ key, type, isEnabled, textfieldProps, labelKey }) => (
        <div key={key}>
          <Toggle
            id={`toggle-${type}-smartlists-selector`}
            label={labelKey}
            checked={isEnabled}
            onChange={(checked) => {
              if (typeof checked === "boolean") {
                onToggleField?.({ type, checked });
              }
            }}
          />
          {isEnabled && (
            <div className="ml-sm">
              <SmartlistsSelector
                onSelectSmartlists={(smartlists) =>
                  onSmartlistsChange?.({
                    type,
                    smartlistIds: smartlists.map((smartlist) => smartlist.id),
                  })
                }
                textfieldProps={textfieldProps}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
