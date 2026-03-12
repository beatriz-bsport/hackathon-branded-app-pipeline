import { type FC, useEffect, useMemo } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Chip,
  type ChipProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import {
  BUYABLE_IDENTIFIERS,
  INVOICE_STATUSES,
  type InvoiceStatus,
} from "@bsport/store-financial-services-invoice";

import { AvatarWithName } from "#src/components/avatar-with-name";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { useFetchInvoiceInformation } from "../api/use-fetch-invoice-information";
import type { GiftcardPurchase } from "../types";
import { SectionItem } from "./section-item";

type GiftcardPurchaseSectionBuyerProps = {
  selectedItem: GiftcardPurchase;
};

export const GiftcardPurchaseSectionBuyer: FC<
  GiftcardPurchaseSectionBuyerProps
> = ({ selectedItem }) => {
  const { t, i18n } = useTranslation("giftcard-details");

  const purchaser = selectedItem.src_member;

  // ----- Retrieve invoice information -----
  const {
    data: invoiceDetails,
    fetchInvoiceByInvoiceItem,
    isLoading,
  } = useFetchInvoiceInformation();

  useEffect(() => {
    if (!selectedItem.id) {
      return;
    }

    fetchInvoiceByInvoiceItem({
      buyableItemId: selectedItem.id,
      buyableItemIdentifier: BUYABLE_IDENTIFIERS.GIFTCARD,
    });
  }, [selectedItem.id, fetchInvoiceByInvoiceItem]);

  const navigateToInvoiceDetails = () => {
    if (invoiceDetails) {
      window.location.assign(LEGACY_URLS.INVOICE_LINK(invoiceDetails.uuid));
    }
  };

  // ----- Define Chip config based on invoice status -----
  const status = invoiceDetails?.status;

  const chipConfigMap = useMemo((): Record<
    InvoiceStatus,
    {
      label: string;
      color: ChipProps["color"];
    }
  > => {
    return {
      [INVOICE_STATUSES.DRAFT]: {
        color: "default" as const,
        label: t(
          "purchases.detailDrawer.sectionBuyer.invoiceCard.invoiceStatus.draft",
        ),
      },
      [INVOICE_STATUSES.OPEN]: {
        color: "default" as const,
        label: t(
          "purchases.detailDrawer.sectionBuyer.invoiceCard.invoiceStatus.open",
        ),
      },
      [INVOICE_STATUSES.PAID]: {
        color: "main" as const,
        label: t(
          "purchases.detailDrawer.sectionBuyer.invoiceCard.invoiceStatus.paid",
        ),
      },
      [INVOICE_STATUSES.REFUNDED]: {
        color: "critical" as const,
        label: t(
          "purchases.detailDrawer.sectionBuyer.invoiceCard.invoiceStatus.refunded",
        ),
      },
      [INVOICE_STATUSES.VOIDED]: {
        color: "warning" as const,
        label: t(
          "purchases.detailDrawer.sectionBuyer.invoiceCard.invoiceStatus.voided",
        ),
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const chipConfig = status
    ? chipConfigMap[status]
    : {
        color: "default" as const,
        label: "...",
      };

  return (
    <section className="grid grid-cols-2 gap-md">
      <Title htmlVariant="h3" weight="strong" className="col-span-2">
        {t("purchases.detailDrawer.sectionBuyer.title")}
      </Title>

      <SectionItem title={t("purchases.detailDrawer.sectionBuyer.name")}>
        {purchaser && (
          <AvatarWithName
            name={purchaser.name}
            avatarSrc={purchaser.avatarSrc}
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
        )}
      </SectionItem>

      <SectionItem
        title={t("purchases.detailDrawer.sectionBuyer.purchaseDate")}
      >
        {formatDateTime(
          selectedItem.date_created,
          DATETIME_FORMATS.MEDIUM_DATE,
          { locale: i18n.language },
        )}
      </SectionItem>

      <Card padding="default" className="col-span-2">
        <div className="flex flex-row justify-between">
          <Chip {...chipConfig} size="sm" type="weak" />

          <Button
            label={t(
              "purchases.detailDrawer.sectionBuyer.invoiceCard.viewInvoiceButton",
            )}
            iconRight="link-external-02"
            kind="default"
            color="main"
            intent="default"
            size="md"
            disabled={isLoading || !invoiceDetails}
            onClick={navigateToInvoiceDetails}
          />
        </div>

        <Body weight="strong" size="lg" className="mt-xs">
          {t("purchases.detailDrawer.sectionBuyer.invoiceCard.invoice", {
            identifier: invoiceDetails?.invoice_legal_identifier ?? "",
          })}
        </Body>

        <Body weight="weaker" size="md" className="mt-sm">
          {t("purchases.detailDrawer.sectionBuyer.invoiceCard.totalPrice", {
            price: getCurrencyDisplayWithPrice(
              invoiceDetails?.amount_due_cts
                ? invoiceDetails.amount_due_cts / 100
                : 0,
            ),
          })}
        </Body>
      </Card>
    </section>
  );
};
