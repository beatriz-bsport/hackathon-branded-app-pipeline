import type { FC } from "react";

import { formatPriceWithCurrency } from "@bsport/currency";
import {
  Body,
  Button,
  Card,
  Chip,
  Icon,
  Title,
} from "@bsport/kaizen-primitive-core";

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
      <div className="flex items-center justify-between">
        <Icon
          icon={pack.icon}
          size="md"
          className="text-onsurface-main-strong"
        />
        <Chip
          type="weak"
          color="default"
          size="lg"
          label={t(`addons.categories.${pack.category}`)}
        />
      </div>
      <div className="flex flex-col gap-2xs">
        <Title htmlVariant="h3" weight="strong">
          {pack.name}
        </Title>
        <Body color="weak" size="sm">
          {pack.description}
        </Body>
      </div>
      <ul className="flex flex-col gap-2xs">
        {pack.features.map((feature) => (
          <li key={feature} className="flex items-start gap-xs">
            <Icon
              icon="check"
              size="sm"
              className="mt-[2px] shrink-0 text-onsurface-main-strong"
            />
            <Body size="sm">{feature}</Body>
          </li>
        ))}
      </ul>
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
