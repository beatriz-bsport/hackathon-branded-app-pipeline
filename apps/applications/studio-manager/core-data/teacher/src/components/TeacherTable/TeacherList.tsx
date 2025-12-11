import type { FC } from "react";

import type { Teacher } from "@bsport/api-core";
import {
  List,
  type PaginationProps,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import type {
  ActionButton,
  IconName,
  ListProps,
} from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import type { TableRequiredPermissions, TeacherHandler } from "./types";

export type EmptyConfig = {
  title: string;
  subtitle?: string;
  ctaButtonConfig?: {
    label: string;
    iconLeft: IconName;
    onClick?: () => void;
  };
};

export type TeacherMobileListProps = {
  mode: "archived" | "active";
  teachers: Array<Teacher>;
  permissions: TableRequiredPermissions;
  paginationProps: PaginationProps;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  handleArchive?: TeacherHandler;
  handleRestore?: TeacherHandler;
  emptyConfig: EmptyConfig;
};

export const TeacherList: FC<TeacherMobileListProps> = ({
  handleArchive,
  handleRestore,
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  paginationProps,
  permissions,
  teachers,
  emptyConfig,
}) => {
  const { t } = useTranslation("common");

  const { copyToClipboard: copyEmail } = useCopyToClipboard({
    toastMessage: t("toasts.emailCopied"),
  });

  const { copyToClipboard: copyPhone } = useCopyToClipboard({
    toastMessage: t("toasts.phoneCopied"),
  });

  const listItems: ListProps["items"] = teachers.map((value) => {
    const initials =
      `${value.firstname?.[0] ?? ""}${value.lastname?.[0] ?? ""}`.toUpperCase();

    // Determine primary action (archive / restore)
    let primaryActionLabel: string | undefined;
    let primaryActionIcon: "archive" | "unarchive" | undefined;
    let primaryActionHandler: TeacherHandler | undefined;

    if (mode === "archived" && handleRestore) {
      primaryActionLabel = t("table.tooltips.restore");
      primaryActionIcon = "unarchive";
      primaryActionHandler = handleRestore;
    } else if (mode === "active" && handleArchive) {
      primaryActionLabel = t("table.tooltips.archive");
      primaryActionIcon = "archive";
      primaryActionHandler = handleArchive;
    }

    const buttons: ActionButton[] = [];

    if (primaryActionLabel && primaryActionIcon && primaryActionHandler) {
      buttons.push({
        id: `teacher-primary-${value.id}`,
        iconLeft: primaryActionIcon as IconName,
        label: primaryActionLabel,
        size: "md",
        intent: "flat",
        color: "default",
        onClick: () =>
          primaryActionHandler?.({
            teacherId: value.id,
            teacherName: value.name,
          }),
      });
    }

    buttons.push({
      id: `teacher-copy-email-${value.id}`,
      iconLeft: "copy-07",
      label: t("list.actions.copyEmail"),
      size: "md",
      intent: "flat",
      color: "default",
      disabled: !value.email,
      onClick: () => {
        copyEmail(value.email);
      },
    });

    buttons.push({
      id: `teacher-copy-phone-${value.id}`,
      iconLeft: "copy-07",
      label: t("list.actions.copyPhone"),
      size: "md",
      intent: "flat",
      color: "default",
      disabled: !value.phone,
      onClick: () => {
        copyPhone(value.phone);
      },
    });

    return {
      id: `teacher-${value.id}`,
      title: value.name,
      description: value.email ?? "",
      avatar: {
        src: value.photo ?? "",
        initials,
        shape: "round",
        alt: value.name,
        size: "md",
      },
      link: permissions.edit ? LEGACY_URLS.DETAILS(value.id) : undefined,
      buttons,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
    };
  });

  return (
    <List
      id="teacher-mobile-list"
      items={listItems}
      paginationProps={paginationProps}
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
            ? "table.loading.archivedList"
            : "table.loading.activeList",
        ),
      }}
      isCompact={false}
    />
  );
};
