import type { FC } from "react";

import { Body, Icon } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const CreditsRow: FC<{ credits: number }> = ({ credits }) => {
  const { t } = useTranslation("sessionManagement");
  return (
    <div className="flex items-center gap-xs text-onsurface-weak">
      <Icon icon="credit-card-02" size="sm" />
      <Body htmlVariant="span" size="md" color="weak">
        {t("sessionPanel.details.credits", { count: credits })}
      </Body>
    </div>
  );
};
