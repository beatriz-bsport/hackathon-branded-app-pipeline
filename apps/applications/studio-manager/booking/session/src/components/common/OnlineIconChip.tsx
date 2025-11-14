import React from "react";

import { useTranslation } from "#src/utils/i18n";

import { IconChip } from "./IconChip";

export const OnlineIconChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.online");
  return <IconChip tooltip={tooltip} icon="video-recorder" />;
};
