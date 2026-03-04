import type { FC } from "react";

import { Body, ToggleButton } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { AvailableColumn, SelectedColumns } from "./types";

type DisplaySettingsProps = {
  selectedColumns: SelectedColumns;
  toggleColumn: ({
    identifier,
    checked,
  }: {
    identifier: AvailableColumn;
    checked: boolean;
  }) => void;
};

export const DisplaySettings: FC<DisplaySettingsProps> = ({
  selectedColumns,
  toggleColumn,
}) => {
  const { t } = useTranslation("giftcard-details");

  const getLabel = (identifier: AvailableColumn) => {
    switch (identifier) {
      case "balance":
        return t("purchases.table.columns.balance");
      case "buyer":
        return t("purchases.table.columns.buyer");
      case "expiry-date":
        return t("purchases.table.columns.expiryDate");
      case "issue-date":
        return t("purchases.table.columns.issueDate");
      case "printable-code":
        return t("purchases.table.columns.printableCode");
      case "recipient":
        return t("purchases.table.columns.recipient");
      case "status":
        return t("purchases.table.columns.status");
      case "value":
        return t("purchases.table.columns.value");
      default:
        return "";
    }
  };

  return (
    <div className="w-component-popover-min">
      <Body size="md" weight="strong" className="mb-md">
        {t("purchases.displaySettings.visibleColumns")}
      </Body>

      <div className="flex flex-wrap gap-xs">
        {Object.keys(selectedColumns).map((columnId) => {
          const identifier = columnId as AvailableColumn;
          const label = getLabel(identifier);
          const id = `display-settings-${identifier}`;
          return (
            <ToggleButton
              key={id}
              id={id}
              checkedConfig={{ label }}
              uncheckedConfig={{ label }}
              size="sm"
              checked={selectedColumns[identifier]}
              onChange={({ checked }) => toggleColumn({ identifier, checked })}
            />
          );
        })}
      </div>
    </div>
  );
};
