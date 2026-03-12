import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { useTranslation } from "#src/utils/i18n";

import { getStatusFromPurchasedGiftcard } from "../giftcard-purchase-status";
import type { GiftcardPurchase } from "../types";
import type { TableRowData } from "./constants";

export const useTableRows = ({
  giftcardPurchases,
  onItemClick,
  selectedItem,
}: {
  giftcardPurchases: GiftcardPurchase[];
  onItemClick: (value: GiftcardPurchase) => void;
  selectedItem: GiftcardPurchase | null;
}): TableRowData[] => {
  const { t, i18n } = useTranslation("giftcard-details");

  return giftcardPurchases.map((item) => {
    const status = getStatusFromPurchasedGiftcard(item);

    let expiryDate = "";
    if (item.expiration_date) {
      expiryDate = formatDateTime(
        item.expiration_date,
        DATETIME_FORMATS.MEDIUM_DATE,
        { locale: i18n.language },
      );
    } else {
      expiryDate =
        status === "unclaimed" ? "--" : t("purchases.table.rows.unlimited");
    }

    return {
      balance:
        parseFloat(item.price_bought) - parseFloat(item.consumed_amount_gifted),
      buyer: item.src_member,
      expiryDate,
      issueDate: item.date_created,
      printableCode:
        item.printable_code ?? t("purchases.table.rows.typeDigital"),
      recipient: item.dst_member,
      id: item.id,
      status,
      value: parseFloat(item.price_bought),
      onRowClick: () => onItemClick(item),
      isActive: selectedItem?.id === item.id,
    };
  });
};
