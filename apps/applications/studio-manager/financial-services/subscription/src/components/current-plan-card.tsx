import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { fromIsoString, toLocaleString } from "@bsport/datetime-manipulation";
import { Body, Card, Chip, Title } from "@bsport/kaizen-primitive-core";

import type { Plan } from "#src/types/plan";
import { useTranslation } from "#src/utils/i18n";

interface CurrentPlanCardProps {
  plan: Plan;
  price: number;
  currencySymbol: string;
  renewDate: string;
}

const CurrentPlanCard: FC<CurrentPlanCardProps> = ({
  plan,
  price,
  currencySymbol,
  renewDate,
}) => {
  const { t, i18n } = useTranslation("subscription");

  const formattedDate = toLocaleString({
    datetime: fromIsoString(renewDate, { locale: i18n.language }),
    formatOptions: { year: "numeric", month: "long", day: "numeric" },
  });

  return (
    <Card elevated selected actionable padding="default">
      <div className="flex flex-col gap-sm">
        <div className="flex flex-col gap-2xs">
          <div>
            <Chip
              type="weak"
              color="main"
              size="lg"
              label={t("plan.current-plan")}
            />
          </div>
          <Title htmlVariant="h2" weight="strong">
            {plan.name}
          </Title>
        </div>
        <Body color="weak">{plan.tagline}</Body>
        <div className="flex gap-sm items-end">
          <Title htmlVariant="h3">
            {t("plan.per-month", {
              price: formatPriceWithCurrency(price, currencySymbol),
            })}
          </Title>
          <Body size="sm" color="weak">
            {t("plan.renews-on", { date: formattedDate })}
          </Body>
        </div>
      </div>
    </Card>
  );
};

export default CurrentPlanCard;
