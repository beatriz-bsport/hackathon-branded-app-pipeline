import React from "react";

import { Badge, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const HybridChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.hybrid");
  return (
    <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
      <Badge color="default" size="sm" text={t("session.properties.hybrid")} />
    </Tooltip>
  );
};
