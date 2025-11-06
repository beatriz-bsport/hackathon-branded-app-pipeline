import { TextFieldProps, Toggle } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SmartlistsSelector } from "./SmartlistsSelector";

type SmartlistsFormFieldProps = {
  isIncludedSmartlistsSelectorToggle: boolean;
  isExcludedSmartlistsSelectorToggle: boolean;
  onSmartlistsChange?: ({
    type,
    smartlists,
  }: {
    type: "excluded" | "included";
    smartlists: number[];
  }) => void;
  onToggleField?: ({
    type,
    checked,
  }: {
    type: "excluded" | "included";
    checked: boolean;
  }) => void;
  excludedSmartlistsSelectorTextfieldProps?: TextFieldProps;
  includedSmartlistsSelectorTextfieldProps?: TextFieldProps;
};

export const SmartlistsFormField = ({
  isIncludedSmartlistsSelectorToggle,
  isExcludedSmartlistsSelectorToggle,
  excludedSmartlistsSelectorTextfieldProps,
  includedSmartlistsSelectorTextfieldProps,
  onSmartlistsChange,
  onToggleField,
}: SmartlistsFormFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <div className="flex flex-col gap-sm">
      <Toggle
        id="toggle-included-smartlists-selector"
        label={t("steps.notificationRules.smartlists.included.label")}
        checked={isIncludedSmartlistsSelectorToggle}
        onChange={(checked) => {
          if (typeof checked === "boolean") {
            onToggleField?.({ type: "included", checked });
          }
        }}
      />
      {isIncludedSmartlistsSelectorToggle ? (
        <div className="ml-sm">
          <SmartlistsSelector
            onSelectSmartlists={(smartlists) =>
              onSmartlistsChange?.({
                type: "included",
                smartlists: smartlists.map((smartlist) => smartlist.id),
              })
            }
            textfieldProps={includedSmartlistsSelectorTextfieldProps}
          />
        </div>
      ) : null}
      <Toggle
        id="toggle-excluded-smartlists-selector"
        label={t("steps.notificationRules.smartlists.excluded.label")}
        checked={isExcludedSmartlistsSelectorToggle}
        onChange={(checked) => {
          if (typeof checked === "boolean") {
            onToggleField?.({ type: "excluded", checked });
          }
        }}
      />
      {isExcludedSmartlistsSelectorToggle ? (
        <div className="ml-sm">
          <SmartlistsSelector
            onSelectSmartlists={(smartlists) =>
              onSmartlistsChange?.({
                type: "excluded",
                smartlists: smartlists.map((smartlist) => smartlist.id),
              })
            }
            textfieldProps={excludedSmartlistsSelectorTextfieldProps}
          />
        </div>
      ) : null}
    </div>
  );
};
