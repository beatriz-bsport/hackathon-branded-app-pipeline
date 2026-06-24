import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import { Body, Button, Card, Icon, Title } from "@bsport/kaizen-primitive-core";

import type { Pack } from "#src/types/pack";
import { useTranslation } from "#src/utils/i18n";
import { openIntercomConversation } from "#src/utils/intercom";

interface AvailableAddonCardProps {
  pack: Pack;
}

const AvailableAddonCard: FC<AvailableAddonCardProps> = ({ pack }) => {
  const { t } = useTranslation("subscription");

  const priceSuffix = pack.perLocation
    ? t("addons.per-month-per-location")
    : t("addons.per-month");

  return (
    <Card className="flex flex-col gap-sm">
      <Icon icon={pack.icon} size="md" className="text-onsurface-main-strong" />
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h3" weight="strong">
          {pack.name}
        </Title>
        <Body color="weak" size="sm">
          {pack.description}
        </Body>
      </div>
      <div className="mt-auto flex justify-between">
        <div>
          <Title htmlVariant="h4">
            {formatPriceWithCurrency(pack.price, pack.currency)}
          </Title>
          <Body size="sm" color="weak">
            {priceSuffix}
          </Body>
        </div>
        <div className="flex items-center gap-xs">
          {pack.learnMoreUrl && (
            <Button
              label={t("addons.learn-more")}
              intent="default"
              size="md"
              color="main"
              href={pack.learnMoreUrl}
              target="_blank"
            />
          )}
          <Button
            color="main"
            label={t("addons.request")}
            size="md"
            intent="call-to-action"
            onClick={openIntercomConversation}
          />
        </div>
      </div>
    </Card>
  );
};

export default AvailableAddonCard;
