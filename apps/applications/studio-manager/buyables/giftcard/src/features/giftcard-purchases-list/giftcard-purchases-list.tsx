import type { FC } from "react";

import type { Giftcard } from "@bsport/api-buyables";
import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useFetchGiftcardPurchases } from "./api/use-fetch-giftcard-purchases";
import {
  GiftcardPurchaseDetailDrawer,
  useGiftcardPurchaseDetailDrawer,
} from "./giftcard-purchase-detail";
import { GiftcardPurchasesDesktop } from "./giftcard-purchases-desktop";
import type { AvailableColumn } from "./giftcard-purchases-desktop/constants";
import { GiftcardPurchasesMobile } from "./giftcard-purchases-mobile";

type GiftcardPurchasesListProps = {
  selectedColumns: Record<AvailableColumn, boolean>;
  giftcard: Giftcard;
};

export const GiftcardPurchasesList: FC<GiftcardPurchasesListProps> = ({
  selectedColumns,
  giftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  const { giftcardPurchases, isLoading, paginationParams, totalItems } =
    useFetchGiftcardPurchases(giftcard.id);

  const { onItemClick, selectedItem, ...drawerProps } =
    useGiftcardPurchaseDetailDrawer(giftcardPurchases);

  const loadingProps = {
    isLoading: isLoading,
    message: t("purchases.loading"),
  };

  const emptyStateProps = {
    emptyConfig: {
      title: t("purchases.emptyList.title"),
      subtitle: t("purchases.emptyList.subtitle"),
    },
    isEmpty: totalItems === 0,
  };

  const isMobile = !useMatchMedia("lg");

  return (
    <>
      {isMobile ? (
        <GiftcardPurchasesMobile
          giftcardPurchases={giftcardPurchases}
          loadingProps={loadingProps}
          emptyStateProps={emptyStateProps}
          paginationProps={paginationParams}
          onItemClick={onItemClick}
          selectedItem={selectedItem}
        />
      ) : (
        <GiftcardPurchasesDesktop
          giftcardPurchases={giftcardPurchases}
          selectedColumns={selectedColumns}
          loadingProps={loadingProps}
          emptyStateProps={emptyStateProps}
          paginationProps={paginationParams}
          onItemClick={onItemClick}
          selectedItem={selectedItem}
        />
      )}

      <GiftcardPurchaseDetailDrawer
        selectedItem={selectedItem}
        giftcard={giftcard}
        {...drawerProps}
      />
    </>
  );
};
