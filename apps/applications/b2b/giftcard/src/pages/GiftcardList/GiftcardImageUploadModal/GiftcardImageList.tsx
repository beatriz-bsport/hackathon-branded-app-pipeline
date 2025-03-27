import classNames from "classnames";
import React from "react";

import { type ButtonProps, List } from "@bsport/kaizen-primitive-core";

import type { GiftcardImage } from "#src/features/api";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardImageUploader } from "./GiftcardImageUploader";

type GiftcardImageListProps = {
  currentPage: number;
  rowsPerPage: number;
  itemList: Array<GiftcardImage>;
  onArchiveClick: (id: number) => void;
  onItemClick: (src: string) => void;
  onPageChange: (nextPage: number) => void;
  totalItems: number;
  isEmpty: boolean;
  refreshGiftcardImageList: () => void;
};

type ItemButtons =
  | [ButtonProps]
  | [ButtonProps, ButtonProps]
  | [ButtonProps, ButtonProps, ButtonProps];

export const GiftcardImageList: React.FC<GiftcardImageListProps> = ({
  onItemClick,
  onArchiveClick,
  currentPage,
  rowsPerPage,
  totalItems,
  onPageChange,
  itemList,
  isEmpty,
  refreshGiftcardImageList,
}) => {
  const { t } = useTranslation("imageUpload");

  const items = itemList.map((item) => ({
    id: `list-item-${item.id}`,
    // For the title, keep the name after the domain URL
    title: item.image ? item.image.split("/").pop() || "" : "",
    avatar: {
      src: item.image,
      shape: "squared" as const,
      size: "md" as const,
    },
    buttons: [
      {
        size: "md",
        intent: "flat",
        color: "default",
        iconLeft: "trash-01",
        onClick: () => onArchiveClick(item.id),
      },
    ] as ItemButtons,
    onClick: () => onItemClick(item.image),
    className: "hover:cursor-pointer text-ellipsis",
  }));

  return (
    <div className="w-1/2">
      {!isEmpty && (
        <GiftcardImageUploader
          fetchGiftcardImageList={refreshGiftcardImageList}
        />
      )}
      <div
        className={classNames("flex flex-col items-center flex-1", {
          "mt-md justify-start w-full": !isEmpty,
          "justify-center h-full max-w-3/4 gap-md": isEmpty,
        })}
      >
        <List
          id="background-image-list"
          items={items}
          className="w-full"
          paginationProps={{
            rowsPerPage,
            currentPage,
            totalItems,
            showRowsPerPageSelector: false,
            onPageChange,
          }}
          emptyStateProps={{
            isEmpty: isEmpty,
            emptyConfig: {
              title: t("emptyList"),
            },
          }}
        />
        {isEmpty && (
          <GiftcardImageUploader
            fetchGiftcardImageList={refreshGiftcardImageList}
            isEmpty
          />
        )}
      </div>
    </div>
  );
};
