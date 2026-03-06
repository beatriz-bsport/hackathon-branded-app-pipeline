import { useState } from "react";

import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { type AvailableColumn } from "#src/features/giftcard-purchases-list";

import { DisplaySettings } from "./display-settings";
import type { SelectedColumns } from "./types";

const INITIAL_SELECTED_COLUMNS: SelectedColumns = {
  balance: true,
  buyer: true,
  "expiry-date": true,
  "issue-date": true,
  "printable-code": true,
  recipient: true,
  status: true,
  value: true,
};

export const useGiftcardPurchasesDisplaySettings = () => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>(
    INITIAL_SELECTED_COLUMNS,
  );

  const isMobile = !useMatchMedia("lg");

  const toggleColumn = ({
    identifier,
    checked,
  }: {
    identifier: AvailableColumn;
    checked: boolean;
  }) => {
    setSelectedColumns((prev) => {
      return {
        ...prev,
        [identifier]: checked,
      };
    });
  };

  return {
    selectedColumns,
    displaySettings: isMobile
      ? undefined
      : () => (
          <DisplaySettings
            selectedColumns={selectedColumns}
            toggleColumn={toggleColumn}
          />
        ),
  };
};
