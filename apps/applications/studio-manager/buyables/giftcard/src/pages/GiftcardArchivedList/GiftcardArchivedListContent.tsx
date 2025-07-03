import React, { useEffect } from "react";

import { GiftcardTable } from "#src/components/GiftcardTable";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import { useRestoreGiftcard } from "#src/hooks/useRestoreGiftcard";

export const GiftcardArchivedListContent: React.FC = () => {
  const {
    giftcardList,
    isLoading,
    paginationParams,
    fetchGiftcardsPage,
    totalItems,
  } = useFetchPaginatedList({ archived: true });

  const { handleRestore } = useRestoreGiftcard({
    fetchGiftcards: fetchGiftcardsPage,
  });

  // ----- Load data -----

  useEffect(() => {
    fetchGiftcardsPage();
  }, [fetchGiftcardsPage]);

  return (
    <GiftcardTable
      mode="archived"
      isEmpty={!totalItems}
      isLoading={!giftcardList?.length && isLoading}
      giftcardList={giftcardList}
      handleRestore={handleRestore}
      paginationProps={paginationParams}
    />
  );
};
