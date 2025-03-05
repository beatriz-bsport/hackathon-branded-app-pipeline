import React, { useState, useEffect, useCallback } from "react";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";
import { GiftcardTable } from "#src/components/GiftcardTable";
import { getGiftcardList, type Giftcard } from "#src/features/api";
import { GiftcardArchiveModal } from "./GiftcardArchiveModal";
import { GiftcardDuplicateModal } from "./GiftcardDuplicateModal";

type GiftcardListProps = {
  onAddGiftcardClick: () => void;
};

export const GiftcardListContent: React.FC<GiftcardListProps> = ({
  onAddGiftcardClick,
}) => {
  const [giftcardList, setGiftcardList] = useState<Giftcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const [giftcardToArchive, setGiftcardToArchive] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [giftcardToDuplicate, setGiftcardToDuplicate] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // ----- Handlers -----

  const getGiftcardPageList = useCallback(async () => {
    setIsLoading(true);
    await getGiftcardList({
      currentPage,
      rowsPerPage: currentPageSize,
      setGiftcardList,
      setTotalItems,
    });
    setIsLoading(false);
  }, [setIsLoading, setTotalItems]);

  const handleArchive = ({
    giftcardId,
    giftcardName,
  }: {
    giftcardId: number;
    giftcardName: string;
  }) => {
    setGiftcardToArchive({ id: giftcardId, name: giftcardName });
  };

  const handleCloseArchiveModal = useCallback(() => {
    setGiftcardToArchive(null);
  }, []);

  const handleDuplicate = ({
    giftcardId,
    giftcardName,
  }: {
    giftcardId: number;
    giftcardName: string;
  }) => {
    setGiftcardToDuplicate({ id: giftcardId, name: giftcardName });
  };

  const handleCloseDuplicateModal = useCallback(() => {
    setGiftcardToDuplicate(null);
  }, []);

  useEffect(() => {
    getGiftcardPageList();
  }, [getGiftcardPageList]);

  return (
    <>
      <GiftcardTable
        mode="active"
        isEmpty={!totalItems}
        isLoading={isLoading}
        giftcardList={giftcardList}
        handleArchive={handleArchive}
        handleDuplicate={handleDuplicate}
        paginationProps={{
          currentPage: currentPage,
          rowsPerPage: currentPageSize,
          totalItems,
          onPageSettingsChange: setPageSettings,
          showRowsPerPageSelector: true,
        }}
        onAddGiftcardClick={onAddGiftcardClick}
      />
      {giftcardToArchive && (
        <GiftcardArchiveModal
          isOpen={!!giftcardToArchive}
          giftcardId={giftcardToArchive.id}
          giftcardName={giftcardToArchive.name}
          refreshPageList={getGiftcardPageList}
          onClose={handleCloseArchiveModal}
        />
      )}
      {giftcardToDuplicate && (
        <GiftcardDuplicateModal
          isOpen={!!giftcardToDuplicate}
          giftcardId={giftcardToDuplicate.id}
          giftcardName={giftcardToDuplicate.name}
          refreshPageList={getGiftcardPageList}
          onClose={handleCloseDuplicateModal}
        />
      )}
    </>
  );
};
