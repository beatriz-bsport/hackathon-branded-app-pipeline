import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  Body,
  List,
  type PaginationProps,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import type {
  ActionButton,
  IconName,
  ListProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type {
  MemberHandler,
  MemberViewData,
  TableRequiredPermissions,
} from "./types";

const MAX_VISIBLE_PAGES = 6;

export type EmptyConfig = {
  title: string;
  subtitle?: string;
  ctaButtonConfig?: {
    label: string;
    iconLeft: IconName;
    onClick?: () => void;
  };
};

export type MemberListProps = {
  mode: "archived" | "active";
  memberViewData: MemberViewData[];
  permissions: TableRequiredPermissions;
  paginationProps: PaginationProps;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  handleArchive?: MemberHandler;
  handleRestore?: MemberHandler;
  emptyConfig: EmptyConfig;
};

export const MemberList: FC<MemberListProps> = ({
  handleArchive,
  handleRestore,
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  paginationProps,
  permissions,
  memberViewData,
  emptyConfig,
}) => {
  const { t } = useTranslation("common");

  const { copyToClipboard: copyEmail } = useCopyToClipboard({
    toastMessage: t("toasts.emailCopied"),
  });

  const listItems: ListProps["items"] = memberViewData.map((memberData) => {
    const { id, name, email, photo, initials, balance, link } = memberData;

    let primaryActionLabel: string | undefined;
    let primaryActionIcon: "archive" | "unarchive" | undefined;
    let primaryActionHandler: MemberHandler | undefined;

    if (mode === "archived" && handleRestore && permissions.restore) {
      primaryActionLabel = t("memberTable.tooltips.restore");
      primaryActionIcon = "unarchive";
      primaryActionHandler = handleRestore;
    } else if (mode === "active" && handleArchive && permissions.archive) {
      primaryActionLabel = t("memberTable.tooltips.archive");
      primaryActionIcon = "archive";
      primaryActionHandler = handleArchive;
    }

    const buttons: ActionButton[] = [];

    if (permissions.seePersonalData) {
      buttons.push({
        id: `member-copy-email-${id}`,
        iconLeft: "copy-07",
        label: t("list.actions.copyEmail"),
        size: "md",
        intent: "flat",
        color: "default",
        disabled: !email,
        onClick: () => {
          copyEmail(email);
        },
      });
    }

    if (primaryActionLabel && primaryActionIcon && primaryActionHandler) {
      buttons.push({
        id: `member-primary-${id}`,
        iconLeft: primaryActionIcon as IconName,
        label: primaryActionLabel,
        size: "md",
        intent: "flat",
        color: "default",
        onClick: () =>
          primaryActionHandler?.({
            memberId: id,
            memberName: name,
          }),
      });
    }

    const balanceColor =
      balance > 0 ? "positive" : balance < 0 ? "critical" : undefined;

    return {
      id: `member-${id}`,
      title: name,
      description: email ?? "",
      avatar: {
        src:
          photo?.includes("default_profile_picture") && initials
            ? undefined
            : (photo ?? ""),
        initials,
        shape: "round",
        alt: name,
        size: "md",
      },
      link,
      buttons,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      customNode: permissions.seeBalance ? (
        <Body htmlVariant="span" size="md" color={balanceColor}>
          {getCurrencyDisplayWithPrice(balance)}
        </Body>
      ) : undefined,
    };
  });

  const mobilePagination: PaginationProps = {
    ...paginationProps,
    showRowsPerPageSelector: false,
    maxVisiblePages: MAX_VISIBLE_PAGES,
  };

  return (
    <List
      id="member-mobile-list"
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
        message: t(
          mode === "archived"
            ? "list.loading.archivedList"
            : "list.loading.activeList",
        ),
      }}
      isCompact={false}
    />
  );
};
