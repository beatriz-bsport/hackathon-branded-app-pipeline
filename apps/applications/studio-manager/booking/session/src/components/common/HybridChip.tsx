import React from "react";

import { Chip, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const HybridChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.hybrid");
  return (
    <Tooltip label={tooltip} placement="bottom" className="whitespace-normal">
      <Chip
        color="default"
        size="lg"
        label={t("session.properties.hybrid")}
        type="weak"
      />
    </Tooltip>
  );
};
