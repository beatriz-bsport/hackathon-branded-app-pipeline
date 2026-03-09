import type { FC } from "react";

import { CONSUMER_GIFTCARD_KIND } from "@bsport/api-buyables";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Title } from "@bsport/kaizen-primitive-core";

import { AvatarWithName } from "#src/components/avatar-with-name";
import { useTranslation } from "#src/utils/i18n";

import type { GiftcardPurchase } from "../types";
import { SectionItem } from "./section-item";

const NULL_DATE = "∅";

type GiftcardPurchaseSectionRecipientProps = {
  selectedItem: GiftcardPurchase;
};

export const GiftcardPurchaseSectionRecipient: FC<
  GiftcardPurchaseSectionRecipientProps
> = ({ selectedItem }) => {
  const { t, i18n } = useTranslation("giftcard-details");

  const recipient = selectedItem.dst_member;

  const activationDateByKind =
    selectedItem.kind === CONSUMER_GIFTCARD_KIND.PRINTABLE
      ? selectedItem.activation_datetime
      : selectedItem.date_activated;
  const activationDate = activationDateByKind
    ? formatDateTime(activationDateByKind, DATETIME_FORMATS.MEDIUM_DATE, {
        locale: i18n.language,
      })
    : NULL_DATE;

  const sendingDate =
    selectedItem.planned_date_send &&
    selectedItem.kind === CONSUMER_GIFTCARD_KIND.DIGITAL
      ? formatDateTime(
          selectedItem.planned_date_send,
          DATETIME_FORMATS.MEDIUM_DATE,
          { locale: i18n.language },
        )
      : NULL_DATE;

  const expirationDate = selectedItem.expiration_date
    ? formatDateTime(
        selectedItem.expiration_date,
        DATETIME_FORMATS.MEDIUM_DATE,
        { locale: i18n.language },
      )
    : NULL_DATE;

  return (
    <section className="grid grid-cols-2 gap-md">
      <Title htmlVariant="h3" weight="strong" className="col-span-2">
        {t("purchases.detailDrawer.sectionRecipient.title")}
      </Title>

      <SectionItem title={t("purchases.detailDrawer.sectionRecipient.name")}>
        {recipient ? (
          <AvatarWithName
            name={recipient.name}
            avatarSrc={recipient.avatarSrc}
            avatarConfig={{
              size: "sm",
            }}
            bodyConfig={{
              weight: "strong",
              color: "main",
              size: "lg",
              className: "text-ellipsis whitespace-nowrap overflow-x-hidden",
            }}
          />
        ) : (
          t("purchases.status.unclaimed")
        )}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionRecipient.sendingDate")}
      >
        {sendingDate}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionRecipient.activationDate")}
      >
        {activationDate}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionRecipient.expirationDate")}
      >
        {expirationDate}
      </SectionItem>
    </section>
  );
};
