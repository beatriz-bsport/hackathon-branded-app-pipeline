import type { FC } from "react";

import { Body, Icon } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const LevelsRow: FC<{ level: number }> = ({ level }) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <div className="flex items-center gap-xs text-onsurface-weak">
      <Icon icon="bar-chart-10" size="sm" />
      <Body htmlVariant="span" size="md" color="weak">
        {level === 0
          ? t("sessionPanel.details.allLevels")
          : t("sessionPanel.details.levelPlaceholder", { id: level })}
      </Body>
    </div>
  );
};
