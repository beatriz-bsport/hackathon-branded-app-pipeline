import type { FC } from "react";

import { useMatchMedia } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useFetchGiftcardPurchases } from "./api/use-fetch-giftcard-purchases";
import { GiftcardPurchasesDesktop } from "./giftcard-purchases-desktop";
import type { AvailableColumn } from "./giftcard-purchases-desktop/constants";
import { GiftcardPurchasesMobile } from "./giftcard-purchases-mobile";

type GiftcardPurchasesListProps = {
  selectedColumns: Record<AvailableColumn, boolean>;
  giftcardId: number;
};

export const GiftcardPurchasesList: FC<GiftcardPurchasesListProps> = ({
  selectedColumns,
  giftcardId,
}) => {
  const { t } = useTranslation("giftcard-details");

  const { giftcardPurchases, isLoading, paginationParams, totalItems } =
    useFetchGiftcardPurchases(giftcardId);

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

  if (isMobile) {
    return (
      <GiftcardPurchasesMobile
        giftcardPurchases={giftcardPurchases}
        loadingProps={loadingProps}
        emptyStateProps={emptyStateProps}
        paginationProps={paginationParams}
      />
    );
  }

  return (
    <GiftcardPurchasesDesktop
      giftcardPurchases={giftcardPurchases}
      selectedColumns={selectedColumns}
      loadingProps={loadingProps}
      emptyStateProps={emptyStateProps}
      paginationProps={paginationParams}
    />
  );
};
