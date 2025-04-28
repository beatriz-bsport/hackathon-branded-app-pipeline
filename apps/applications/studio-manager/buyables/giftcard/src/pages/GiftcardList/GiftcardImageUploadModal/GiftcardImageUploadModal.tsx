import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  archiveGiftcardImageAction,
  fetchGiftcardImagesAction,
  restoreGiftcardImageAction,
  selectGiftcardImages,
  selectGiftcardImagesCount,
  useGiftcardStore,
} from "@bsport/store-buyables-giftcard";

import { getCompanyTheme } from "#src/features/api";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardDisplay } from "./GiftcardDisplay";
import { GiftcardImageList } from "./GiftcardImageList";

const ROWS_PER_PAGE = 5;
const DEFAULT_PAGE = 1;

type UploadModalProps = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export const GiftcardImageUploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onCloseModal,
}) => {
  const { t } = useTranslation("imageUpload");

  // Manage the image to render on the Giftcard preview
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );

  // Pagination can not be managed in URL as it happens in a modal over a Paginated list
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);

  /** @todo Company theme should be retrieved from common store */
  const [companyTheme, setCompanyTheme] = useState<{ cover: string }>({
    cover: "",
  });

  // Data from store
  const totalItems = useGiftcardStore(selectGiftcardImagesCount);
  const giftcardImages = useGiftcardStore(selectGiftcardImages);

  // ----- Handlers -----

  const fetchGiftcardImages = useCallback(
    async ({ page }: { page: number }) => {
      return fetchGiftcardImagesAction(fetch, {
        page,
        page_size: ROWS_PER_PAGE,
        /** @todo Retrieve company id from Company store */
        company: 2,
      });
    },
    [],
  );

  const refreshGiftcardImages = useCallback(() => {
    fetchGiftcardImages({ page: DEFAULT_PAGE });
  }, [fetchGiftcardImages]);

  /** @todo Use when having true pagination */
  const fetchGiftcardImagesPage = useCallback(() => {
    fetchGiftcardImages({ page: currentPage });
  }, [currentPage, fetchGiftcardImages]);

  const handleArchive = async (id: number) => {
    const response = await archiveGiftcardImageAction(fetch, { id });

    const onSuccess = () => {
      // Refresh the list
      fetchGiftcardImagesPage();

      // Display a toast to "undo" the action
      toast({
        status: "critical",
        icon: "trash-01",
        title: t("toasts.archiveMessage.success"),
        buttonLabel: t("toasts.actions.undo"),
        onButtonClick: async () => {
          await restoreGiftcardImageAction(fetch, { id });
          await fetchGiftcardImagesPage();
        },
      });
    };

    const onFailure = () => {
      // Display a toast to inform about the failure
      toast({
        status: "critical",
        icon: "x",
        title: t("toasts.archiveMessage.error"),
        buttonLabel: t("toasts.actions.close"),
      });
    };

    response.fold(onSuccess, onFailure);
  };

  /** @todo Remove when having true pagination */
  const paginatedList = useMemo(() => {
    return giftcardImages.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE,
    );
  }, [currentPage, giftcardImages]);

  // ----- Load data -----

  useEffect(() => {
    refreshGiftcardImages();
  }, [refreshGiftcardImages]);

  useEffect(() => {
    getCompanyTheme({ setTheme: setCompanyTheme });
  }, []);

  const isEmpty = !totalItems;

  return (
    <Modal
      onCrossButtonClick={onCloseModal}
      onClickOutside={onCloseModal}
      open={isOpen}
      size="lg"
      description={t("modal.description")}
      title={t("modal.title")}
      confirmColor="main"
      confirmLabel=""
      onConfirmClick={() => {}}
    >
      <div className="flex flex-row items-stretch gap-md p-md justify-between">
        <GiftcardDisplay
          displaySelectMessage={totalItems > 0}
          selectedImage={selectedImage}
          companyCover={companyTheme.cover}
        />
        <GiftcardImageList
          currentPage={currentPage}
          itemList={paginatedList}
          onArchiveClick={handleArchive}
          onItemClick={(src: string) => setSelectedImage(src)}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          isEmpty={isEmpty}
          refreshGiftcardImageList={refreshGiftcardImages}
          rowsPerPage={ROWS_PER_PAGE}
        />
      </div>
    </Modal>
  );
};
