import type { FC } from "react";

import { CONSUMER_GIFTCARD_KIND, type Giftcard } from "@bsport/api-buyables";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  calculateDiffDuration,
  fromIsoString,
} from "@bsport/datetime-manipulation";
import {
  Body,
  CopyToClipboard,
  Icon,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardPurchase } from "../types";
import { SectionItem } from "./section-item";

function toAmount(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

type GiftcardPurchaseSectionDescriptionProps = {
  selectedItem: GiftcardPurchase;
  giftcard: Giftcard;
};

export const GiftcardPurchaseSectionDescription: FC<
  GiftcardPurchaseSectionDescriptionProps
> = ({ selectedItem, giftcard }) => {
  const { t } = useTranslation("giftcard-details");

  // ----- Balance item -----
  const initialValue = toAmount(selectedItem.price_bought);
  const consumedValue = toAmount(selectedItem.consumed_amount_gifted);
  const balance = initialValue - consumedValue;

  // ----- Validity period item -----
  const activationDate =
    selectedItem.kind === CONSUMER_GIFTCARD_KIND.PRINTABLE
      ? selectedItem.activation_datetime
      : selectedItem.date_activated;
  const isUnlimited = activationDate && !selectedItem.expiration_date;
  let validityPeriod = "";
  {
    if (isUnlimited) {
      validityPeriod = t(
        "purchases.detailDrawer.sectionDescription.validityPeriod.unlimited",
      );
    } else if (activationDate && selectedItem.expiration_date) {
      // Infer validity period from the difference
      const activationDateStart = fromIsoString(activationDate).startOf("day");
      const expirationDate = fromIsoString(
        selectedItem.expiration_date,
      ).startOf("day");

      const rawDaysValidity = calculateDiffDuration({
        lowerDatetime: activationDateStart,
        upperDatetime: expirationDate,
        units: "days",
      }).as("days");
      const daysValidity = Math.max(0, Math.round(rawDaysValidity));

      validityPeriod = t(
        "purchases.detailDrawer.sectionDescription.validityPeriod.numberOfDays",
        { count: daysValidity },
      );
    } else {
      // Fallback to the current giftcard validity
      validityPeriod =
        giftcard.expiration_days == null
          ? t(
              "purchases.detailDrawer.sectionDescription.validityPeriod.unlimited",
            )
          : t(
              "purchases.detailDrawer.sectionDescription.validityPeriod.numberOfDays",
              { count: giftcard.expiration_days },
            );
    }
  }

  return (
    <section className="grid grid-cols-2 gap-md">
      <SectionItem
        title={t("purchases.detailDrawer.sectionDescription.name")}
        className="col-span-2"
      >
        <Body weight="stronger" size="lg">
          {selectedItem.name}
        </Body>

        {!!selectedItem.incremental_identifier && (
          <Body weight="weaker" size="md" className="mt-2xs">
            {t("purchases.detailDrawer.sectionDescription.id", {
              identifier: selectedItem.incremental_identifier,
            })}
          </Body>
        )}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionDescription.balance")}
      >
        {`${getCurrencyDisplayWithPrice(balance)} / ${getCurrencyDisplayWithPrice(initialValue)}`}
      </SectionItem>

      <SectionItem
        title={t(
          "purchases.detailDrawer.sectionDescription.validityPeriod.label",
        )}
      >
        {validityPeriod}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionDescription.type.label")}
        className="min-h-[52px]" // trick to prevent layout shift when next item is not rendered
      >
        {selectedItem.kind === CONSUMER_GIFTCARD_KIND.PRINTABLE
          ? t("purchases.detailDrawer.sectionDescription.type.print")
          : t("purchases.detailDrawer.sectionDescription.type.digital")}
      </SectionItem>

      {selectedItem.kind === CONSUMER_GIFTCARD_KIND.PRINTABLE &&
        selectedItem.printable_code && (
          <SectionItem
            title={t("purchases.detailDrawer.sectionDescription.code.label")}
            titleNode={
              <Tooltip
                label={t(
                  "purchases.detailDrawer.sectionDescription.code.tooltip",
                )}
                placement="top-right"
              >
                <Icon
                  icon="info-circle"
                  size="sm"
                  className="text-onsurface-weak"
                />
              </Tooltip>
            }
          >
            <CopyToClipboard
              iconLeft="ticket-01"
              color="default"
              intent="flat"
              label={selectedItem.printable_code}
              size="md"
            />
          </SectionItem>
        )}
    </section>
  );
};
