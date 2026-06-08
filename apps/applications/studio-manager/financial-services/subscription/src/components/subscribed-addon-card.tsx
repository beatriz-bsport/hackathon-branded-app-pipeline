import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body, Button, Card, Icon, Title } from "@bsport/kaizen-primitive-core";

import type { Pack } from "#src/types/pack";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

interface SubscribedAddonCardProps {
  pack: Pack;
}

const SubscribedAddonCard: FC<SubscribedAddonCardProps> = ({ pack }) => {
  const { t } = useTranslation("subscription");

  const priceSuffix = pack.perLocation
    ? t("addons.per-month-per-location")
    : t("addons.per-month");

  return (
    <Card elevated selected actionable padding="default">
      <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:gap-md">
        <div className="flex flex-1 items-center gap-md">
          <Icon
            icon={pack.icon}
            size="lg"
            className="shrink-0 text-onsurface-main-strong"
          />
          <div className="flex flex-col gap-2xs">
            <Title htmlVariant="h3" weight="strong">
              {pack.name}
            </Title>
            <Body color="weak" size="sm">
              {pack.description}
            </Body>
          </div>
        </div>
        <div className="flex items-center justify-between gap-md sm:justify-end">
          <div className="flex flex-col gap-2xs sm:items-end">
            <Title htmlVariant="h4">
              {formatPriceWithCurrency(pack.price, pack.currency)}
            </Title>
            <Body size="sm" color="weak">
              {priceSuffix}
            </Body>
          </div>
          <Button
            color="critical"
            label={t("addons.request-removal")}
            size="md"
            intent="flat"
            onClick={openIntercomConversation}
          />
        </div>
      </div>
    </Card>
  );
};

export default SubscribedAddonCard;
