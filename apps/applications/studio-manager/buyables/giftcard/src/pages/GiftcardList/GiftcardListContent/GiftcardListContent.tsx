import React, { useCallback, useEffect, useState } from "react";

import { GiftcardTable } from "#src/components/GiftcardTable";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";

import { GiftcardArchiveModal } from "./GiftcardArchiveModal";
import { GiftcardDuplicateModal } from "./GiftcardDuplicateModal";

type GiftcardListProps = {
  onAddGiftcardClick: () => void;
};

export const GiftcardListContent: React.FC<GiftcardListProps> = ({
  onAddGiftcardClick,
}) => {
  const {
    giftcardList,
    isLoading,
    paginationParams,
    fetchGiftcardsPage,
    totalItems,
  } = useFetchPaginatedList({ archived: false });

  const [giftcardToArchive, setGiftcardToArchive] = useState<{
    giftcardId: number;
    giftcardName: string;
  } | null>(null);

  const [giftcardToDuplicate, setGiftcardToDuplicate] = useState<{
    giftcardId: number;
    giftcardName: string;
  } | null>(null);

  // ----- Handlers -----

  const handleCloseArchiveModal = useCallback(() => {
    setGiftcardToArchive(null);
  }, []);

  const handleCloseDuplicateModal = useCallback(() => {
    setGiftcardToDuplicate(null);
  }, []);

  // ----- Load data -----

  useEffect(() => {
    fetchGiftcardsPage();
  }, [fetchGiftcardsPage]);

  return (
    <>
      <GiftcardTable
        mode="active"
        isEmpty={!totalItems}
        isLoading={!giftcardList?.length && isLoading}
        giftcardList={giftcardList}
        handleArchive={setGiftcardToArchive}
        handleDuplicate={setGiftcardToDuplicate}
        paginationProps={paginationParams}
        onAddGiftcardClick={onAddGiftcardClick}
      />
      {giftcardToArchive && (
        <GiftcardArchiveModal
          isOpen={!!giftcardToArchive}
          giftcardId={giftcardToArchive.giftcardId}
          giftcardName={giftcardToArchive.giftcardName}
          refreshPageList={fetchGiftcardsPage}
          onClose={handleCloseArchiveModal}
        />
      )}
      {giftcardToDuplicate && (
        <GiftcardDuplicateModal
          isOpen={!!giftcardToDuplicate}
          giftcardId={giftcardToDuplicate.giftcardId}
          giftcardName={giftcardToDuplicate.giftcardName}
          refreshPageList={fetchGiftcardsPage}
          onClose={handleCloseDuplicateModal}
        />
      )}
    </>
  );
};
