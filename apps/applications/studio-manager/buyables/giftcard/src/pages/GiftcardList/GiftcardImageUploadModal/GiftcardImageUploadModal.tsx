import React, { useCallback, useEffect, useState } from "react";

import {
  Modal,
  type PaginationProps,
  toast,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import {
  archiveGiftcardImageAction,
  fetchGiftcardImagesAction,
  restoreGiftcardImageAction,
  selectGiftcardImages,
  selectGiftcardImagesCount,
  useGiftcardStore,
} from "@bsport/store-buyables-giftcard";

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

  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyId = companyTheme?.company;

  // Data from store
  const totalItems = useGiftcardStore(selectGiftcardImagesCount);
  const giftcardImages = useGiftcardStore(selectGiftcardImages);

  // ----- Handlers -----

  const fetchGiftcardImages = useCallback(
    async ({ page }: { page: number }) => {
      if (companyId) {
        return fetchGiftcardImagesAction(fetch, {
          page,
          page_size: ROWS_PER_PAGE,
          company: companyId,
        });
      }
    },
    [companyId],
  );

  const refreshGiftcardImages = useCallback(() => {
    if (currentPage === DEFAULT_PAGE) {
      fetchGiftcardImages({ page: DEFAULT_PAGE });
    } else {
      // Changing the page will trigger an automatic fetch with the fetchGiftcardImagesPage callback
      setCurrentPage(DEFAULT_PAGE);
    }
  }, [fetchGiftcardImages, currentPage]);

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

  // ----- Load data -----

  useEffect(() => {
    fetchGiftcardImagesPage();
  }, [fetchGiftcardImagesPage]);

  const paginationParams: PaginationProps = {
    rowsPerPage: ROWS_PER_PAGE,
    currentPage,
    totalItems,
    showRowsPerPageSelector: false,
    onPageChange: setCurrentPage,
  };

  return (
    <Modal
      onCloseButtonClick={onCloseModal}
      onClickOutside={onCloseModal}
      open={isOpen}
      size="lg"
      description={t("modal.description")}
      title={t("modal.title")}
    >
      <div className="flex flex-row items-stretch gap-md p-md justify-between">
        <GiftcardDisplay
          displaySelectMessage={totalItems > 0}
          selectedImage={selectedImage}
          companyCover={companyTheme?.cover}
        />
        <GiftcardImageList
          itemList={giftcardImages}
          onArchiveClick={handleArchive}
          onItemClick={setSelectedImage}
          isEmpty={!totalItems}
          paginationParams={paginationParams}
          refreshGiftcardImageList={refreshGiftcardImages}
        />
      </div>
    </Modal>
  );
};
