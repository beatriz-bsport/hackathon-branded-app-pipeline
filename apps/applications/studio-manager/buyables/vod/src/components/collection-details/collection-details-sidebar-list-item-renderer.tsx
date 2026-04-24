import type { FC } from "react";

import { Avatar, Body, Icon, Tooltip, cx } from "@bsport/kaizen-primitive-core";

export type CollectionDetailsSidebarListItem = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  durationLabel?: string;
  isActive: boolean;
  isEbook: boolean;
  onItemClick: () => void;
};

export const CollectionDetailsSidebarListItemRenderer: FC<
  CollectionDetailsSidebarListItem
> = ({
  durationLabel,
  isActive,
  isEbook,
  onItemClick,
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
    <button
      type="button"
      onClick={onItemClick}
      aria-pressed={isActive}
      className={cx(
        "flex w-full items-center gap-sm border-b-stroke-thin border-b-stroke-divider px-md py-xs text-left transition-colors",
        isActive
          ? "bg-surface-action-main-selected-rest"
          : "bg-surface-default hover:bg-surface-default-weaker active:bg-surface-default-weak",
      )}
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
  );
};
