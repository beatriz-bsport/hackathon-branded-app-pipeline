import { ConsumerGiftcard } from "@bsport/api-buyables";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import type { PersonCell } from "../types";
import GIFTCARD_PURCHASES from "./fixture-consumer-giftcards.json";

export const useFetchGiftcardPurchases = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // @todo Replace with store retrieval + add member augmentation
  // @ts-expect-error Force typing
  const giftcardPurchases = GIFTCARD_PURCHASES as Array<
    ConsumerGiftcard<number, PersonCell, PersonCell>
  >;
  const totalItems = GIFTCARD_PURCHASES.length * 5;

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };

  return {
    // @todo Take from API loading time
    isLoading: false,
    paginationParams,
    giftcardPurchases,
    totalItems,
  };
};
