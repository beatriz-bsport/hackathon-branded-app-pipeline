import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body, Button, Card, Icon, Title } from "@bsport/kaizen-primitive-core";

import type { Plan } from "#src/types/plan";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

interface OtherPlanCardProps {
  plan: Plan;
  price: number;
  currencySymbol: string;
  learnMoreUrl?: string;
}

const OtherPlanCard: FC<OtherPlanCardProps> = ({
  plan,
  price,
  currencySymbol,
  learnMoreUrl,
}) => {
  const { t } = useTranslation("subscription");

  return (
    <Card className="flex flex-col gap-sm">
      <div className="flex flex-col gap-2xs">
        <div className="flex items-center">
          <Title htmlVariant="h3" weight="strong">
            {plan.name}
          </Title>
        </div>
        <Title htmlVariant="h4">
          {t("plan.per-month", {
            price: formatPriceWithCurrency(price, currencySymbol),
          })}
        </Title>
        <Body color="weak" size="sm">
          {plan.tagline}
        </Body>
      </div>
      <ul className="flex flex-col gap-2xs">
        {plan.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-xs">
            <Icon
              icon="check"
              size="sm"
              className="mt-[2px] shrink-0 text-onsurface-main-strong"
            />
            <Body size="sm">{highlight}</Body>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-xs pt-sm">
        <Button
          color="main"
          label={t("plan.select-plan")}
          size="md"
          intent="call-to-action"
          onClick={openIntercomConversation}
        />
        {learnMoreUrl && (
          <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer">
            <Button
              label={t("plan.learn-more")}
              intent="default"
              size="md"
              color="main"
            />
          </a>
        )}
      </div>
    </Card>
  );
};

export default OtherPlanCard;
