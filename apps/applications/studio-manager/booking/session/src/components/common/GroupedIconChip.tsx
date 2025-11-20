import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { IconChip } from "./IconChip";

export const GroupedIconChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.groupedSession");
  return <IconChip tooltip={tooltip} icon="folder" />;
};
