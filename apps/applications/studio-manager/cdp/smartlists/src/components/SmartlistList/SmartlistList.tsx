import { type FC } from "react";
import { useNavigate } from "react-router";

import {
  List,
  type ListItemProps,
  type PaginationProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { LEGACY_URLS } from "#src/urls";
import { useSmartlistFlag } from "#src/utils/feature-flags/use-smartlist-flag";
import { useTranslation } from "#src/utils/i18n";

import { VISIBLE_ACTIONS_DISPLAY_LIMIT } from "./constants";

type SmartlistListProps = {
  smartlists: Smartlist[];
  paginationProps: Pick<
    PaginationProps,
    "currentPage" | "totalItems" | "onPageSettingsChange"
  > & {
    rowsPerPage: number;
  };
  loadingProps: {
    isLoading: boolean;
  };
  emptyStateConfig: {
    isEmpty: boolean;
    isEmptySearch: boolean;
    onSearchClear: () => void;
    onCreateClick: () => void;
  };
  actions: {
    onEdit: (smartlist: Smartlist) => void;
    onDuplicate: (smartlist: Smartlist) => void;
    onDelete: (smartlist: Smartlist) => void;
  };
};

export const SmartlistList: FC<SmartlistListProps> = ({
  smartlists,
  paginationProps,
  loadingProps,
  emptyStateConfig,
  actions,
}) => {
  const { t } = useTranslation("list");
  const navigate = useNavigate();
  const isSmartlistEnabled = useSmartlistFlag();

  const { isEmpty, isEmptySearch, onSearchClear, onCreateClick } =
    emptyStateConfig;
  const { onEdit, onDuplicate, onDelete } = actions;

  const isMobile = !useMatchMedia("sm");

  const listItems: ListItemProps[] = smartlists.map((smartlist: Smartlist) => ({
    id: smartlist.id.toString(),
    title: smartlist.name,
    description: smartlist.description,
    dropdownConfig: {
      visibleActionsDisplayLimit: isMobile ? 0 : VISIBLE_ACTIONS_DISPLAY_LIMIT,
    },
    onClick: () => {
      if (isSmartlistEnabled) {
        navigate(`/${smartlist.id}`);
      } else {
        window.location.assign(LEGACY_URLS.SMARTLIST_MEMBER(smartlist.id));
      }
    },
    buttons: [
      {
        id: `smartlist-edit-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "edit-02",
        label: t("inlineActions.edit"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: isMobile ? t("dropdownActions.edit") : t("inlineActions.edit"),
          placement: "bottom",
        },
        onClick: () => onEdit(smartlist),
      },
      {
        id: `smartlist-copy-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "copy-03",
        label: isMobile
          ? t("dropdownActions.duplicate")
          : t("inlineActions.duplicate"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: t("inlineActions.duplicate"),
          placement: "bottom",
        },
        onClick: () => onDuplicate(smartlist),
      },
      {
        id: `smartlist-trash-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "trash-01",
        label: isMobile
          ? t("dropdownActions.delete")
          : t("inlineActions.delete"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: t("inlineActions.delete"),
          placement: "bottom-right",
        },
        onClick: () => onDelete(smartlist),
      },
    ],
  }));

  return (
    <div className="w-full h-full">
      <List
        id="smartlists-list"
        loadingProps={{
          isLoading: loadingProps.isLoading,
          message: t("loading"),
        }}
        items={listItems}
        paginationProps={{ ...paginationProps, showRowsPerPageSelector: true }}
        emptyStateProps={{
          emptyConfig: {
            ctaButtonConfig: {
              iconLeft: "plus",
              label: t("addSmartlist"),
              color: "main",
              size: "md",
              intent: "call-to-action",
              onClick: onCreateClick,
            },
            subtitle: t("emptyState.subtitle"),
            title: t("emptyState.title"),
          },
          emptySearchConfig: {
            secondaryButtonConfig: {
              iconLeft: "x",
              label: t("emptySearch.clearFilters"),
              color: "default",
              size: "md",
              intent: "flat",
              onClick: onSearchClear,
            },
            subtitle: t("emptySearch.subtitle"),
            title: t("emptySearch.title"),
          },
          isEmpty,
          isEmptySearch,
        }}
      />
    </div>
  );
};
