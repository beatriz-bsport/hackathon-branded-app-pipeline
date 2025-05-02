import React, { useCallback, useEffect } from "react";

import { toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGiftcardAction,
  restoreGiftcardAction,
} from "@bsport/store-buyables-giftcard";

import { GiftcardTable } from "#src/components/GiftcardTable";
import { useFetchPaginatedList } from "#src/hooks/useFetchPaginatedList";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const GiftcardArchivedListContent: React.FC = () => {
  const { t } = useTranslation("common");

  const {
    giftcardList,
    isLoading,
    paginationParams,
    fetchGiftcardsPage,
    totalItems,
  } = useFetchPaginatedList({ archived: true });

  // ----- Handlers -----

  const handleArchive = useCallback(
    async ({
      giftcardId,
      giftcardName,
    }: {
      giftcardId: number;
      giftcardName: string;
    }) => {
      const response = await archiveGiftcardAction(fetch, { id: giftcardId });

      const onSuccess = () => {
        fetchGiftcardsPage();
      };

      const onFailure = () => {
        // Display a toast to inform about the failure
        toast({
          status: "critical",
          icon: "x",
          title: t("toasts.errorMessages.archive", {
            name: giftcardName,
          }),
          buttonLabel: t("toasts.actions.close"),
        });
      };

      response.fold(onSuccess, onFailure);
    },
    [fetchGiftcardsPage],
  );

  const handleRestore = useCallback(
    async ({
      giftcardId,
      giftcardName,
    }: {
      giftcardId: number;
      giftcardName: string;
    }) => {
      const response = await restoreGiftcardAction(fetch, { id: giftcardId });

      const onSuccess = () => {
        // Refresh the list page once the request has finished
        fetchGiftcardsPage();

        // Display a toast to "undo" the action
        toast({
          status: "default",
          icon: "unarchive",
          title: t("toasts.successMessages.unarchive", {
            name: giftcardName,
          }),
          buttonLabel: t("toasts.actions.undo"),
          onButtonClick: () => handleArchive({ giftcardId, giftcardName }),
        });
      };

      const onFailure = () => {
        // Display a toast to inform about the failure
        toast({
          status: "critical",
          icon: "x",
          title: t("toasts.errorMessages.archive", {
            name: giftcardName,
          }),
          buttonLabel: t("toasts.actions.close"),
        });
      };

      response.fold(onSuccess, onFailure);
    },
    [fetchGiftcardsPage, handleArchive],
  );

  // ----- Load data -----

  useEffect(() => {
    fetchGiftcardsPage();
  }, [fetchGiftcardsPage]);

  return (
    <GiftcardTable
      mode="archived"
      isEmpty={!totalItems}
      isLoading={isLoading}
      giftcardList={giftcardList}
      handleArchive={handleArchive}
      handleRestore={handleRestore}
      paginationProps={paginationParams}
    />
  );
};
