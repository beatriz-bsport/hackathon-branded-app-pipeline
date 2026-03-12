import type { FC } from "react";

import { Button, Title, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  GiftcardPurchaseStatusChip,
  getStatusFromPurchasedGiftcard,
} from "../giftcard-purchase-status";
import type { GiftcardPurchase } from "../types";

type GiftcardPurchaseSectionTitleProps = {
  selectedItem: GiftcardPurchase;
};

export const GiftcardPurchaseSectionTitle: FC<
  GiftcardPurchaseSectionTitleProps
> = ({ selectedItem }) => {
  const { t } = useTranslation("giftcard-details");

  const status = getStatusFromPurchasedGiftcard(selectedItem);

  const openTabWithPDF = () => {
    if (selectedItem.pdf_link) {
      window.open(selectedItem.pdf_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="flex flex-row justify-between items-center gap-md">
      <div className="flex flex-row justify-start items-center gap-md">
        <Title htmlVariant="h2" weight="strong">
          {t("purchases.detailDrawer.title")}
        </Title>
        <GiftcardPurchaseStatusChip status={status} />
      </div>

      <Tooltip
        label={t("purchases.detailDrawer.downloadAsPdf")}
        placement="bottom-right"
      >
        <Button
          icon="download-01"
          kind="icon-button"
          label={t("purchases.detailDrawer.downloadAsPdf")}
          color="main"
          intent="default"
          size="md"
          disabled={!selectedItem.pdf_link}
          onClick={openTabWithPDF}
        />
      </Tooltip>
    </section>
  );
};
