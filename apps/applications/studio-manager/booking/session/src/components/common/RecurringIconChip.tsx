import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { IconChip } from "./IconChip";

export const RecurringIconChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.recurring");
  return <IconChip tooltip={tooltip} icon="refresh-ccw-01" />;
};
