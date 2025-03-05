import React, { useState, useEffect, useCallback } from "react";
import { GiftcardTable } from "#src/components/GiftcardTable";
import { useTranslation } from "#src/utils/i18n";
import {
  getGiftcardArchivedList,
  restoreGiftcard,
  archiveGiftcard,
  type Giftcard,
} from "#src/features/api";
import { toast } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

export const GiftcardArchivedListContent: React.FC = () => {
  const { t } = useTranslation("common");
  const [giftcardList, setGiftcardList] = useState<Giftcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // ----- Handlers -----

  const getGiftcardArchivedPageList = useCallback(async () => {
    setIsLoading(true);
    await getGiftcardArchivedList({
      currentPage: currentPage,
      rowsPerPage: currentPageSize,
      setGiftcardList,
      setTotalItems,
    });
    setIsLoading(false);
  }, [currentPage, currentPageSize]);

  const handleArchive = useCallback(
    async ({ giftcardId }: { giftcardId: number }) => {
      await archiveGiftcard({ giftcardId });
      await getGiftcardArchivedPageList();
    },
    [getGiftcardArchivedPageList, archiveGiftcard],
  );

  const handleRestore = useCallback(
    async ({
      giftcardId,
      giftcardName,
    }: {
      giftcardId: number;
      giftcardName: string;
    }) => {
      // Restore the giftcard
      await restoreGiftcard({ giftcardId });

      // Refresh the list page once the request has finished
      getGiftcardArchivedPageList();

      // Display a toast to "undo" the action
      toast({
        status: "default",
        icon: "unarchive",
        title: t("archivedListPage.toasts.messageUnarchived", {
          name: giftcardName,
        }),
        buttonLabel: t("archivedListPage.toasts.actionUndo"),
        onButtonClick: () => handleArchive({ giftcardId }),
      });
    },
    [archiveGiftcard, restoreGiftcard, handleArchive],
  );

  // On load, fetch Giftcard paginated list
  useEffect(() => {
    getGiftcardArchivedPageList();
  }, [getGiftcardArchivedPageList]);

  return (
    <GiftcardTable
      mode="archived"
      isEmpty={!totalItems}
      isLoading={isLoading}
      giftcardList={giftcardList}
      handleArchive={handleArchive}
      handleRestore={handleRestore}
      paginationProps={{
        currentPage: currentPage,
        rowsPerPage: currentPageSize,
        totalItems,
        onPageSettingsChange: setPageSettings,
        showRowsPerPageSelector: true,
      }}
    />
  );
};
