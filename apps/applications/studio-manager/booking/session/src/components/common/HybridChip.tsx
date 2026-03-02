import React from "react";

import { Chip } from "@bsport/kaizen-primitive-core";

import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useTranslation } from "#src/utils/i18n";

export const HybridChip: React.FC = () => {
  const { t } = useTranslation("common");
  const tooltip = t("session.tooltips.hybrid");
  return (
    <ResponsiveTooltip
      label={tooltip}
      placement="bottom"
      className="whitespace-normal"
    >
      <Chip
        color="default"
        size="lg"
        label={t("session.properties.hybrid")}
        type="weak"
      />
    </ResponsiveTooltip>
  );
};
