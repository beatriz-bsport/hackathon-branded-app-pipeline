import type { FC } from "react";

import type { Giftcard } from "@bsport/api-buyables";
import { DetailDrawer, Divider } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardPurchase } from "../types";
import { GiftcardPurchaseSectionBuyer } from "./section-buyer";
import { GiftcardPurchaseSectionDescription } from "./section-description";
import { GiftcardPurchaseSectionRecipient } from "./section-recipient";
import { GiftcardPurchaseSectionTitle } from "./section-title";

type GiftcardPurchaseDetailDrawerProps = {
  giftcard: Giftcard;
  isOpen: boolean;
  selectedItem: GiftcardPurchase | null;
  closeDrawer: () => void;
  selectNextItem: () => void;
  selectPreviousItem: () => void;
};

export const GiftcardPurchaseDetailDrawer: FC<
  GiftcardPurchaseDetailDrawerProps
> = ({
  giftcard,
  isOpen,
  selectedItem,
  closeDrawer,
  selectNextItem,
  selectPreviousItem,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <DetailDrawer
      id="giftcard-purchase-detail-drawer"
      isOpen={isOpen}
      onClose={closeDrawer}
      className="lg:w-[420px]"
      actionsConfig={[
        {
          id: "select-previous-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-up",
          kind: "icon-button",
          label: t("purchases.detailDrawer.navigation.selectPreviousItem"),
          onClick: selectPreviousItem,
        },
        {
          id: "select-next-item",
          color: "main",
          intent: "default",
          size: "sm",
          icon: "chevron-down",
          kind: "icon-button",
          label: t("purchases.detailDrawer.navigation.selectNextItem"),
          onClick: selectNextItem,
        },
      ]}
    >
      {selectedItem ? (
        <>
          <GiftcardPurchaseSectionTitle selectedItem={selectedItem} />

          <Divider weight="extra-thin" />

          <GiftcardPurchaseSectionDescription
            giftcard={giftcard}
            selectedItem={selectedItem}
          />

          <Divider weight="extra-thin" />

          <GiftcardPurchaseSectionBuyer selectedItem={selectedItem} />

          <Divider weight="extra-thin" />

          <GiftcardPurchaseSectionRecipient selectedItem={selectedItem} />
        </>
      ) : null}
    </DetailDrawer>
  );
};
