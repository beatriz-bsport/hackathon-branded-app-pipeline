import React from "react";

import {
  Avatar,
  Badge,
  Body,
  Button,
  CopyToClipboard,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { NavigationLink } from "#src/components/NavigationLink";
import { LEGACY_URLS } from "#src/urls";

import type { ListItemProps, TagConfig } from "./constants";

function formatTagName({
  categoryName,
  tagName,
}: {
  categoryName?: string;
  tagName: string;
}) {
  if (!categoryName) return tagName;
  return `${categoryName}: ${tagName}`;
}

const TagBadge: React.FC<{ tagId: number; tagInfo?: TagConfig }> = ({
  tagId,
  tagInfo,
}) => {
  return (
    <Badge
      key={tagId}
      className="h-fit"
      color="main"
      size="lg"
      text={
        tagInfo
          ? formatTagName({
              categoryName: tagInfo.categoryName,
              tagName: tagInfo.tagName,
            })
          : String(tagId)
      }
      style={
        tagInfo?.color // Color, if defined, is shaped as `#XXYYZZ`
          ? {
              color: tagInfo.color,
              borderColor: tagInfo.color,
              backgroundColor: `${tagInfo.color}10`, // Reduce the opacity
            }
          : {}
      }
    />
  );
};

export const SearchMemberListItem: React.FC<ListItemProps> = ({
  id,
  avatar,
  name,
  navigate,
  phone,
  email,
  onClick,
  tags,
  tagsTooltip,
  toastPhoneCopied,
  toastEmailCopied,
  tagsMap,
}) => {
  const renderItem = () => (
    <>
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] w-full gap-xs items-center">
        {/* Left column with title */}
        <div className="flex items-center gap-sm">
          <Avatar {...avatar} shape="round" size="md" />
          <Body>{name}</Body>
        </div>

        {/* Right column with actions */}
        <div className="flex justify-end gap-sm">
          {phone ? (
            <CopyToClipboard
              size="md"
              intent="flat"
              color="default"
              label={phone}
              toastMessage={toastPhoneCopied}
            />
          ) : undefined}
          {email ? (
            <CopyToClipboard
              size="md"
              intent="flat"
              color="default"
              label={email}
              toastMessage={toastEmailCopied}
            />
          ) : undefined}
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  kind="icon-button"
                  icon="info-circle"
                  size="md"
                  intent="flat"
                  color="default"
                  label={tagsTooltip}
                  onMouseEnter={() => setIsPopoverOpened(true)}
                  onMouseLeave={() => setIsPopoverOpened(false)}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement="bottom-left">
              {() => (
                <div className="flex flex-col gap-xs p-sm max-w-[240px]">
                  <Body htmlVariant="p" size="lg" color="weak" weight="weak">
                    {tagsTooltip}
                  </Body>
                  <div className="flex flex-row gap-xs items-center flex-wrap">
                    {tags.map((tagId) => {
                      const tagInfo = tagsMap.get(tagId);
                      return (
                        <TagBadge
                          key={`member-${id}-tag-${tagId}`}
                          tagId={tagId}
                          tagInfo={tagInfo}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </Popover.Content>
          </Popover>
        </div>
      </div>
    </>
  );

  return (
    <NavigationLink
      item={{
        id: id,
        href: `${LEGACY_URLS.member}/${id}/info`,
        revamped: false,
        navigationCallback: onClick,
      }}
      navigate={navigate}
      renderElement={renderItem}
      wrapperConfig={{
        withOnClick: true,
        tabIndex: 0,
        className: [
          "relative flex",
          "min-h-2xl py-xs px-md gap-xs",
          "border-b-stroke-thin border-b-stroke-divider",
          "hover:bg-surface-action-default-weak-hovered",
          "hover:cursor-pointer",
          "active:bg-surface-action-default-weak-pressed",
        ].join(" "),
      }}
    />
  );
};
