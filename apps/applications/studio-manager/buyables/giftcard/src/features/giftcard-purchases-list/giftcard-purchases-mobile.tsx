import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  List,
  type ListItemProps,
  type ListProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  GiftcardPurchaseStatusChip,
  getStatusFromPurchasedGiftcard,
} from "./giftcard-purchase-status";
import type { GiftcardPurchase } from "./types";

type GiftcardPurchasesMobileProps = {
  giftcardPurchases: GiftcardPurchase[];
  onItemClick: (value: GiftcardPurchase) => void;
  selectedItem: GiftcardPurchase | null;
} & Pick<ListProps, "paginationProps" | "emptyStateProps" | "loadingProps">;

export const GiftcardPurchasesMobile: FC<GiftcardPurchasesMobileProps> = ({
  giftcardPurchases,
  onItemClick,
  selectedItem,
  ...listProps
}) => {
  const { t } = useTranslation("giftcard-details");

  const items: ListItemProps[] = giftcardPurchases.map((item) => {
    const balance =
      parseFloat(item.price_bought) - parseFloat(item.consumed_amount_gifted);
    const status = getStatusFromPurchasedGiftcard(item);

    return {
      id: `giftcard-purchase-${item.id}`,
      title: item.src_member?.name || "",
      description: `${t("purchases.table.columns.balance")}: ${getCurrencyDisplayWithPrice(balance)}`,
      customNode: <GiftcardPurchaseStatusChip status={status} />,
      onClick: () => onItemClick(item),
      isActive: selectedItem?.id === item.id,
    };
  });

  return (
    <List id="giftcard-purchases-mobile-list" items={items} {...listProps} />
  );
};
