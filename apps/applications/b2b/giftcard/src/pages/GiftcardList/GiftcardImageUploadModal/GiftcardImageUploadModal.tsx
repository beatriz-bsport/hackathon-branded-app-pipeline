import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, toast } from "@bsport/kaizen-primitive-core";
import {
  getGiftcardImageList,
  archiveGiftcardImage,
  restoreGiftcardImage,
  getCompanyTheme,
  type GiftcardImage,
} from "#src/features/api";
import { useTranslation } from "#src/utils/i18n";
import { GiftcardDisplay } from "./GiftcardDisplay";
import { GiftcardImageList } from "./GiftcardImageList";

const ROWS_PER_PAGE = 5;

type UploadModalProps = {
  isOpen: boolean;
  onCloseModal: () => void;
};

export const GiftcardImageUploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onCloseModal,
}) => {
  const { t } = useTranslation("imageUpload");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [itemList, setItemList] = useState<GiftcardImage[]>([]);
  // TODO : Company theme should be a global value
  const [companyTheme, setCompanyTheme] = useState<{ cover: string }>({
    cover: "",
  });

  // ----- Handlers -----

  const refreshGiftcardImageList = useCallback(() => {
    getGiftcardImageList({
      currentPage: 1,
      rowsPerPage: ROWS_PER_PAGE,
      setItemList,
      setTotalItems,
    });
  }, []);

  // TODO : Use when having true pagination
  // ADD this in a useEffect
  const getGiftcardImagePageList = useCallback(() => {
    getGiftcardImageList({
      currentPage: currentPage,
      rowsPerPage: ROWS_PER_PAGE,
      setItemList,
      setTotalItems,
    });
  }, [currentPage]);

  const handleArchive = async (id: number) => {
    // Archive the GiftcardBackgroundImage in the backend
    await archiveGiftcardImage({ id });

    // Refresh the list once it's done
    await getGiftcardImageList({
      currentPage,
      rowsPerPage: ROWS_PER_PAGE,
      setItemList,
      setTotalItems,
    });

    // Display a toast to "undo" the action
    toast({
      status: "critical",
      icon: "trash-01",
      title: t("toasts.messageDeleted"),
      buttonLabel: t("toasts.actionUndo"),
      onButtonClick: async () => {
        await restoreGiftcardImage({ id });
        await getGiftcardImagePageList();
      },
    });
  };

  // TODO : remove when having true pagination
  const paginatedList = useMemo(() => {
    return itemList.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE,
    );
  }, [currentPage, itemList]);

  // On load component, fetch giftcards
  useEffect(refreshGiftcardImageList, [refreshGiftcardImageList]);

  // On mount, fetch company theme
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
          refreshGiftcardImageList={refreshGiftcardImageList}
          rowsPerPage={ROWS_PER_PAGE}
        />
      </div>
    </Modal>
  );
};
