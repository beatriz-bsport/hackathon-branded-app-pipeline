import type { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import type { Market, Plan, PlanKey } from "#src/types/plan";
import { useTranslation } from "#src/utils/i18n";

import CurrentPlanCard from "./current-plan-card";
import OtherPlanCard from "./other-plan-card";

interface PlanOverviewSectionProps {
  plans: Plan[];
  currentPlanId?: PlanKey;
  market: Market;
  renewDate?: string;
}

const PlanOverviewSection: FC<PlanOverviewSectionProps> = ({
  plans,
  currentPlanId,
  market,
  renewDate,
}) => {
  const { t } = useTranslation("subscription");
  const currentPlan =
    currentPlanId !== undefined
      ? plans.find((p) => p.id === currentPlanId)
      : undefined;
  const otherPlans = plans.filter((p) => p.id !== currentPlanId);

  if (!currentPlan || !renewDate) {
    return (
      <div className="grid gap-md lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <OtherPlanCard
            key={plan.id}
            plan={plan}
            price={plan.pricePerMarket[market.id]}
            currencySymbol={market.currencySymbol}
            learnMoreUrl={plan.learnMoreUrl}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <CurrentPlanCard
        plan={currentPlan}
        price={currentPlan.pricePerMarket[market.id]}
        currencySymbol={market.currencySymbol}
        renewDate={renewDate}
      />
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h3" weight="strong">
          {t("plan.other-plans")}
        </Title>
        <div className="grid gap-md lg:grid-cols-3">
          {otherPlans.map((plan) => (
            <OtherPlanCard
              key={plan.id}
              plan={plan}
              price={plan.pricePerMarket[market.id]}
              currencySymbol={market.currencySymbol}
              learnMoreUrl={plan.learnMoreUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanOverviewSection;
