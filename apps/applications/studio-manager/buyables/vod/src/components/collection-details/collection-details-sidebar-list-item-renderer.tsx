import type { FC } from "react";

import {
  Avatar,
  Body,
  Button,
  Icon,
  Tooltip,
  cx,
} from "@bsport/kaizen-primitive-core";

type CollectionDetailsSidebarListItemBase = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  durationLabel?: string;
  isActive: boolean;
  isEbook: boolean;
  onItemClick: () => void;
};

type CollectionDetailsSidebarListItemRemovable =
  | {
      onRemoveClick: () => void;
      removeLabel: string;
    }
  | {
      onRemoveClick?: undefined;
      removeLabel?: undefined;
    };

export type CollectionDetailsSidebarListItem =
  CollectionDetailsSidebarListItemBase &
    CollectionDetailsSidebarListItemRemovable;

export const CollectionDetailsSidebarListItemRenderer: FC<
  CollectionDetailsSidebarListItem
> = ({
  durationLabel,
  isActive,
  isEbook,
  onItemClick,
  onRemoveClick,
  removeLabel,
  thumbnailUrl,
  title,
}) => {
  const mediaIcon = (
    <Icon
      icon={isEbook ? "book-closed" : "video-recorder"}
      size="sm"
      className="text-onsurface-weak"
    />
  );

  return (
    <div
      className={cx(
        "flex w-full items-center gap-xs border-b-stroke-thin border-b-stroke-divider px-md py-xs transition-colors",
        isActive
          ? "bg-surface-action-main-selected-rest"
          : "bg-surface-default hover:bg-surface-default-weaker active:bg-surface-default-weak",
      )}
    >
      <button
        type="button"
        onClick={onItemClick}
        aria-pressed={isActive}
        className="flex min-w-0 flex-1 items-center gap-sm text-left"
      >
        <div className="flex shrink-0 items-center gap-xs">
          {durationLabel ? (
            <Tooltip label={durationLabel} placement="bottom">
              <span className="inline-flex">{mediaIcon}</span>
            </Tooltip>
          ) : (
            mediaIcon
          )}
          <Avatar
            shape="squared"
            size="lg"
            src={thumbnailUrl}
            alt={title}
            iconName={thumbnailUrl ? undefined : "image-03"}
            className={
              thumbnailUrl
                ? "border-none opacity-80"
                : "border-none bg-surface-default-weaker text-onsurface-weaker"
            }
          />
        </div>
        <Body
          htmlVariant="span"
          size="sm"
          weight="strong"
          color="default"
          className="truncate"
        >
          {title}
        </Body>
      </button>
      {onRemoveClick ? (
        <Button
          color="default"
          intent="flat"
          size="sm"
          kind="icon-button"
          icon="trash-01"
          label={removeLabel}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemoveClick();
          }}
        />
      ) : null}
    </div>
  );
};
