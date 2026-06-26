import type { KeyboardEvent } from "react";

import {
  Avatar,
  Body,
  Button,
  DropdownMenu,
  Indicator,
  cva,
  cx,
} from "@bsport/kaizen-primitive-core";

import { Channel, type ChannelType } from "#src/components/channel/channel";
import { useTranslation } from "#src/utils/i18n";

const TOGGLE_READ_ACTION = "toggle-read";

const threadListItemStyles = cva(
  "group flex w-full cursor-pointer items-center gap-xs border-b-stroke-thin border-b-stroke-divider px-xs py-sm text-left outline-none focus-visible:bg-surface-action-default-weak-hovered",
  {
    variants: {
      tone: {
        selected:
          "border-l-stroke-bold border-l-stroke-action-main-selected bg-surface-action-main-selected-rest hover:bg-surface-action-main-selected-hovered active:bg-surface-action-main-selected-pressed",
        unread:
          "bg-surface-action-default-elevated-rest hover:bg-surface-action-default-elevated-hovered active:bg-surface-action-default-elevated-pressed",
        read: "hover:bg-surface-action-default-weak-hovered active:bg-surface-action-default-weak-pressed",
      },
    },
    defaultVariants: {
      tone: "read",
    },
  },
);

const overflowTriggerStyles = cva(
  "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
  {
    variants: {
      menuOpen: {
        true: "opacity-100",
      },
    },
  },
);

export type ThreadListItemProps = {
  /** Display name of the contact the thread belongs to. */
  contactName: string;
  /** Latest message snippet shown under the name. */
  preview: string;
  /** Channel the latest message came through (drives the preview icon). */
  channel: ChannelType;
  /** Pre-formatted timestamp; this component does no date formatting. */
  timestamp: string;
  /** Whether the thread has unread messages (bold styling + count indicator). */
  isUnread?: boolean;
  /** Number of unread messages, shown as an indicator when `isUnread`. */
  unreadCount?: number;
  /** Whether the thread is the currently selected one. */
  isSelected?: boolean;
  /** Avatar image URL. */
  avatarSrc?: string;
  /** Initials shown when no avatar image is available. */
  avatarInitials?: string;
  /** Called when the row is activated (click / Enter / Space). */
  onClick?: () => void;
  /** Called when "Mark as read" is selected. */
  onMarkRead?: () => void;
  /** Called when "Mark as unread" is selected. */
  onMarkUnread?: () => void;
  className?: string;
};

/**
 * A single row in the Inbox thread list: avatar, contact name, channel + message
 * preview, timestamp and an unread indicator. On hover (or while its menu is open)
 * it reveals a 3-dots overflow menu to mark the thread as read / unread.
 *
 * Presentational only — all state is controlled through props and callbacks.
 */
export function ThreadListItem({
  contactName,
  preview,
  channel,
  timestamp,
  isUnread = false,
  unreadCount,
  isSelected = false,
  avatarSrc,
  avatarInitials,
  onClick,
  onMarkRead,
  onMarkUnread,
  className,
}: ThreadListItemProps) {
  const { t } = useTranslation("thread-list");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  const tone = isSelected ? "selected" : isUnread ? "unread" : "read";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cx(threadListItemStyles({ tone }), className)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-xs">
        <Avatar
          shape="round"
          size="sm"
          src={avatarSrc}
          initials={avatarInitials}
          alt={contactName}
          className="shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Body
            size="lg"
            color={isUnread ? "default" : "weak"}
            weight={isUnread ? "strong" : "weak"}
            className="w-full truncate"
          >
            {contactName}
          </Body>
          <div className="flex w-full items-center gap-2xs">
            <Channel
              channel={channel}
              kind="icon-only"
              className={cx(
                "shrink-0",
                isUnread ? "text-onsurface-default" : "text-onsurface-weak",
              )}
            />
            <Body
              htmlVariant="span"
              size="sm"
              color={isUnread ? "default" : "weak"}
              className="min-w-0 flex-1 truncate"
            >
              {preview}
            </Body>
          </div>
        </div>
      </div>

      <div className="flex h-component-list-item-min shrink-0 flex-col items-end justify-between">
        <div className="flex items-center gap-2xs">
          <Body
            htmlVariant="span"
            size="sm"
            color="weak"
            className="whitespace-nowrap text-body-xs"
          >
            {timestamp}
          </Body>
          {isUnread && unreadCount ? (
            <Indicator color="main" size="sm" position="top" />
          ) : null}
        </div>

        <div className="flex min-h-px w-full items-end justify-end">
          <DropdownMenu
            placement="bottom-right"
            items={[
              {
                id: TOGGLE_READ_ACTION,
                label: isUnread
                  ? t("threadListItem.markAsRead")
                  : t("threadListItem.markAsUnread"),
                iconLeft: isUnread ? "check-circle" : "mail-01",
              },
            ]}
            onSelectOption={({ id, setIsPopoverOpened }) => {
              if (id === TOGGLE_READ_ACTION) {
                if (isUnread) onMarkRead?.();
                else onMarkUnread?.();
              }
              setIsPopoverOpened(false);
            }}
            target={({ isPopoverOpened, setIsPopoverOpened }) => (
              <Button
                kind="icon-button"
                icon="dots-horizontal"
                intent="flat"
                color="default"
                size="sm"
                label={t("threadListItem.moreActionsLabel")}
                className={overflowTriggerStyles({ menuOpen: isPopoverOpened })}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsPopoverOpened(true);
                }}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
