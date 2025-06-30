import classNames from "classnames";
import React from "react";

import {
  List,
  type ListItemProps,
  type PaginationProps,
} from "@bsport/kaizen-primitive-core";
import type { GiftcardImage } from "@bsport/store-buyables-giftcard";

import { useTranslation } from "#src/utils/i18n";

import { GiftcardImageUploader } from "./GiftcardImageUploader";

type GiftcardImageListProps = {
  itemList: Array<GiftcardImage>;
  onArchiveClick: (id: number) => void;
  onItemClick: (src: string) => void;
  isEmpty: boolean;
  paginationParams: PaginationProps;
  refreshGiftcardImageList: () => void;
  isLoading?: boolean;
};

export const GiftcardImageList: React.FC<GiftcardImageListProps> = ({
  onItemClick,
  onArchiveClick,
  paginationParams,
  itemList,
  isEmpty,
  isLoading = false,
  refreshGiftcardImageList,
}) => {
  const { t } = useTranslation("common");

  const items: ListItemProps[] = itemList.map((item) => ({
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
        id: `giftcard-image-preview-action-${item.id}`,
        size: "md",
        intent: "flat",
        color: "default",
        iconLeft: "trash-01",
        onClick: () => {
          onArchiveClick(item.id);
        },
        disabled: isLoading,
      },
    ],
    onClick: () => onItemClick(item.image),
    className: "hover:cursor-pointer text-ellipsis",
  }));

  return (
    <div className="w-1/2">
      {!isEmpty && (
        <GiftcardImageUploader
          refreshGiftcardImageList={refreshGiftcardImageList}
        />
      )}
      <div
        className={classNames("flex flex-col items-stretch flex-1", {
          "mt-md justify-start w-full": !isEmpty,
          "justify-center h-full max-w-3/4 gap-md": isEmpty,
        })}
      >
        <List
          id="background-image-list"
          items={items}
          className="w-full"
          paginationProps={paginationParams}
          emptyStateProps={{
            isEmpty: isEmpty,
            emptyConfig: {
              title: t("imageUploadModal.emptyList"),
            },
          }}
        />
        {isEmpty && (
          <GiftcardImageUploader
            refreshGiftcardImageList={refreshGiftcardImageList}
            isEmpty
          />
        )}
      </div>
    </div>
  );
};
