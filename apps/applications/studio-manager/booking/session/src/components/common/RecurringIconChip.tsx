import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { IconChip } from "./IconChip";

type RecurringIconChipProps = {
  tooltip?: string;
};

export const RecurringIconChip: React.FC<RecurringIconChipProps> = ({
  tooltip,
}) => {
  const { t } = useTranslation("common");
  return (
    <IconChip
      tooltip={tooltip ?? t("session.tooltips.recurring")}
      icon="refresh-ccw-02"
    />
  );
};
