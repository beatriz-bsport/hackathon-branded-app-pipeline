import React from "react";

import { fromIsoString, getDaysUntil } from "@bsport/datetime-manipulation";
import { Chip } from "@bsport/kaizen-primitive-core";

import type { GlobalAlertSeverity } from "#src/components/financial-services/global-alert/types";
import { i18nInstance, useTranslation } from "#src/i18n";

type DueDateChipProps = {
  dueDate: string;
  severity: GlobalAlertSeverity;
};

/**
 * Displays a compact deadline chip next to an alert title.
 *
 * Label and color are derived from both `dueDate` and `severity`:
 * - `< 7 days` → "X days left"
 * - `7–29 days` → "X weeks left"
 * - `≥ 30 days` → "X months left"
 *
 * Returns `null` when the due date is already past.
 */
export const DueDateChip: React.FC<DueDateChipProps> = ({
  dueDate,
  severity,
}) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  const diffDays = getDaysUntil(fromIsoString(dueDate));

  if (diffDays < 0) return null;

  const getLabel = (): string => {
    if (diffDays < 7) {
      return t("globalAlertModal.dueDate.daysLeft", { count: diffDays });
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return t("globalAlertModal.dueDate.weeksLeft", { count: weeks });
    }
    const months = Math.floor(diffDays / 30);
    return t("globalAlertModal.dueDate.monthsLeft", { count: months });
  };

  const label = getLabel();
  const color =
    severity === "info"
      ? "default"
      : severity === "warning"
        ? "warning"
        : "critical";

  return <Chip type="weak" color={color} size="sm" label={label} />;
};
