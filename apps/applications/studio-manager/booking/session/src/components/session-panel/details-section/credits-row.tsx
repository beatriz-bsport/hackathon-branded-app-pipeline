import type { FC } from "react";

import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { Body, Icon } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const CreditsRow: FC<{ credits: number }> = ({ credits }) => {
  const { t } = useTranslation("sessionManagement");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { getCreditsDividedValue } = useCreditFactor(
    companyTheme?.pass_credit_factor,
  );
  return (
    <div className="flex items-center gap-xs text-onsurface-weak">
      <span className="flex w-lg shrink-0 justify-center">
        <Icon icon="credit-card-02" size="sm" />
      </span>
      <Body htmlVariant="span" size="lg" color="default">
        {t("sessionPanel.details.credits", {
          count: getCreditsDividedValue(credits),
        })}
      </Body>
    </div>
  );
};
