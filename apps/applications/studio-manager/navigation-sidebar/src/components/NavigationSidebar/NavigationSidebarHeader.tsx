import type { HTMLAttributes } from "react";

import {
  Avatar,
  Body,
  Button,
  Divider,
  DropdownMenu,
  type DropdownMenuItems,
  Icon,
} from "@bsport/kaizen-primitive-core";

import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { MenuSet } from "./navigation-items";

const MENU_OPTIONS = {
  settings: "settings",
  logout: "logout",
  attendance: "attendance",
  ledger: "ledger",
  tutorials: "tutorials",
  help: "help",
  feedback: "feedback",
} as const;

export type MenuOption = keyof typeof MENU_OPTIONS;

const getMenuOptions = (t: TFunction) => [
  {
    id: MENU_OPTIONS.settings,
    label: t("menus.popover.settings"),
    iconLeft: "settings-03",
  },
  {
    id: MENU_OPTIONS.attendance,
    label: t("menus.popover.attendance"),
    iconLeft: "clock",
  },
  {
    id: MENU_OPTIONS.ledger,
    label: t("menus.popover.ledger"),
    iconLeft: "book-closed",
  },
  {
    id: MENU_OPTIONS.tutorials,
    label: t("menus.popover.tutorials"),
    iconLeft: "graduation-hat-02",
  },
  {
    id: MENU_OPTIONS.help,
    label: t("menus.popover.help"),
    iconLeft: "help-circle",
  },
  {
    id: MENU_OPTIONS.feedback,
    label: t("menus.popover.feedback"),
    iconLeft: "pin-02",
  },
  {
    id: MENU_OPTIONS.logout,
    label: t("menus.popover.logout"),
    iconLeft: "log-out-01",
  },
];

type NavigationSidebarHeaderProps = {
  label: string;
  avatarUrl?: string;
  menuSet: MenuSet;
  onSelectItem?: (id: MenuOption) => void;
  onBack?: () => void;
  onSearch: () => void;
  hiddenItems: Partial<Record<MenuOption, boolean>>;
};

const NavigationSidebarHeader = ({
  menuSet,
  onSelectItem,
  onBack,
  onSearch,
  label,
  avatarUrl,
  hiddenItems,
}: NavigationSidebarHeaderProps) => {
  const { t } = useTranslation("default");

  if (menuSet === "settings" && onBack) {
    return (
      <header>
        <Button
          className="mx-xs"
          label={t("common.back")}
          intent="flat"
          size="md"
          color="default"
          iconLeft="arrow-left"
          onClick={onBack}
        />
        <Divider className="mt-xs" weight="thin" orientation="horizontal" />
      </header>
    );
  }

  return (
    <header className="flex gap-2xs px-xs pb-xs">
      <DropdownMenu
        className="flex-1"
        items={
          getMenuOptions(t).filter(
            (item) => !hiddenItems[item.id],
          ) as DropdownMenuItems
        }
        onSelectOption={({ id, setIsPopoverOpened }) => {
          onSelectItem?.(id as MenuOption);
          setIsPopoverOpened(false);
        }}
        placement="bottom-left"
        target={({ setIsPopoverOpened }) => (
          <TopStatusButton
            label={label}
            avatarUrl={avatarUrl}
            onClick={() => setIsPopoverOpened(true)}
          />
        )}
      />
      <Button
        className="shrink-0 hidden md:inline-flex"
        kind="icon-button"
        intent="default"
        size="md"
        color="main"
        icon="search-refraction"
        label={t("common.search")}
        onClick={onSearch}
      />
    </header>
  );
};

export default NavigationSidebarHeader;

type TopStatusButtonProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
  avatarUrl?: string;
};

const MAX_INITIALS_LENGTH = 2;

function TopStatusButton({
  label,
  avatarUrl,
  ...htmlProps
}: TopStatusButtonProps) {
  const initials = label
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, MAX_INITIALS_LENGTH)
    .join("");

  return (
    <button
      // TODO: decide what to do with Button component
      // we are replicating styles here because Avatar
      // is not supported
      className={
        "flex gap-xs items-center w-full p-xs rounded-md " +
        "bg-surface-action-default-elevated-rest " +
        "active:bg-surface-action-default-elevated-pressed " +
        "hover:bg-surface-action-default-elevated-hovered " +
        "shadow-action-default-rest " +
        "active:shadow-action-default-pressed " +
        "hover:shadow-action-default-hovered"
      }
      {...htmlProps}
    >
      <Avatar shape="squared" size="xs" initials={initials} src={avatarUrl} />
      <Body
        className="flex-1 text-left leading-xs"
        htmlVariant="span"
        size="lg"
      >
        {label}
      </Body>
      <Icon icon="chevron-down" size="sm" />
    </button>
  );
}
