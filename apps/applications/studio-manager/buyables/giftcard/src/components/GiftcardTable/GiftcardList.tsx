import type { FC } from "react";

import {
  type ActionButton,
  List,
  type ListItemProps,
  type PaginationProps,
} from "@bsport/kaizen-primitive-core";
import { type Giftcard } from "@bsport/store-buyables-giftcard";

import { LEGACY_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import type { EmptyConfig, GiftcardHandler } from "./types";

const MAX_VISIBLE_PAGES = 6;

// Helper function to create a chip configuration
const createChip = (iconLeft: string, tooltipLabel: string) => ({
  label: "",
  size: "lg",
  type: "weak",
  color: "default",
  iconLeft,
  tooltipProps: {
    label: tooltipLabel,
    placement: "bottom",
  },
});

export type GiftcardListProps = {
  mode: "archived" | "active";
  giftcardList: Array<Giftcard>;
  paginationProps?: PaginationProps;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  handleArchive?: GiftcardHandler;
  handleDuplicate?: GiftcardHandler;
  handleRestore?: GiftcardHandler;
  emptyConfig: EmptyConfig;
};

export const GiftcardList: FC<GiftcardListProps> = ({
  handleArchive,
  handleDuplicate,
  handleRestore,
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  paginationProps,
  giftcardList,
  emptyConfig,
}) => {
  const { t } = useTranslation("common");

  const listItems: ListItemProps[] = giftcardList.map((giftcard) => {
    const buttons: ActionButton[] = [];

    // Don't show actions for shared giftcards
    if (!giftcard.is_shared_giftcard) {
      if (mode === "archived" && handleRestore) {
        buttons.push({
          id: `giftcard-restore-${giftcard.id}`,
          iconLeft: "unarchive",
          label: t("list.actions.restore"),
          size: "md",
          intent: "flat",
          color: "default",
          onClick: () =>
            handleRestore({
              giftcardId: giftcard.id,
              giftcardName: giftcard.name,
            }),
        });
      } else if (mode === "active") {
        if (handleDuplicate) {
          buttons.push({
            id: `giftcard-duplicate-${giftcard.id}`,
            iconLeft: "copy-03",
            label: t("list.actions.duplicate"),
            size: "md",
            intent: "flat",
            color: "default",
            onClick: () =>
              handleDuplicate({
                giftcardId: giftcard.id,
                giftcardName: giftcard.name,
              }),
          });
        }

        if (handleArchive) {
          buttons.push({
            id: `giftcard-archive-${giftcard.id}`,
            iconLeft: "archive",
            label: t("list.actions.archive"),
            size: "md",
            intent: "flat",
            color: "default",
            onClick: () =>
              handleArchive({
                giftcardId: giftcard.id,
                giftcardName: giftcard.name,
              }),
          });
        }
      }
    }

    // Format price as subtitle
    const priceSubtitle = giftcard.price ?? "";

    // Build status chips (icon only, no label)
    const chips: ListItemProps["chips"] = (() => {
      if (giftcard.is_shared_giftcard && giftcard.manager_only) {
        return [
          createChip("eye", t("giftcardTable.tooltips.shared")),
          createChip("eye-off", t("giftcardTable.tooltips.unavailable")),
        ];
      }

      if (giftcard.is_shared_giftcard) {
        return [createChip("eye", t("giftcardTable.tooltips.shared"))];
      }

      if (giftcard.manager_only) {
        return [createChip("eye-off", t("giftcardTable.tooltips.unavailable"))];
      }

      return undefined;
    })();

    return {
      id: `giftcard-${giftcard.id}`,
      title: giftcard.name,
      description: priceSubtitle,
      avatar: {
        src: giftcard.cover ?? "",
        iconName: "image-03",
        shape: "squared",
        alt: giftcard.name,
        size: "md",
      },
      link: mode === "active" ? LEGACY_ROUTES.DETAILS(giftcard.id) : undefined,
      buttons,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      chips,
      chipsDirection: "end",
    };
  });

  const mobilePagination: PaginationProps | undefined = paginationProps
    ? {
        ...paginationProps,
        showRowsPerPageSelector: false,
        maxVisiblePages: MAX_VISIBLE_PAGES,
      }
    : undefined;

  return (
    <List
      id="giftcard-mobile-list"
      items={listItems}
      paginationProps={mobilePagination}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig,
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading: isLoading,
        message: t("giftcardTable.loading"),
      }}
      isCompact={false}
    />
  );
};
