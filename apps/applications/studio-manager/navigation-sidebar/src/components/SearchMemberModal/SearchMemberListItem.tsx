import React from "react";

import {
  Avatar,
  Badge,
  Body,
  Button,
  DropdownMenu,
  Popover,
  useCopyToClipboard,
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
  copyEmailLabel,
  copyPhoneLabel,
  toastPhoneCopied,
  toastEmailCopied,
  tagsMap,
  isMobile = false,
}) => {
  const { copyToClipboard: copyEmail } = useCopyToClipboard({
    toastMessage: toastEmailCopied,
  });
  const { copyToClipboard: copyPhone } = useCopyToClipboard({
    toastMessage: toastPhoneCopied,
  });

  const renderItem = () => (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] w-full gap-xs items-center">
        {/* Left column with title */}
        <div className="flex items-center gap-sm">
          <Avatar {...avatar} shape="round" size="md" />
          <Body>{name}</Body>
        </div>

        {/* Right column with actions */}
        {!isMobile && (
          <div className="flex justify-end gap-sm">
            {phone ? (
              <Button
                kind="icon-button"
                icon="copy-07"
                size="md"
                intent="flat"
                color="default"
                label={toastPhoneCopied}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyPhone(phone);
                }}
              />
            ) : undefined}
            {email ? (
              <Button
                kind="icon-button"
                icon="copy-07"
                size="md"
                intent="flat"
                color="default"
                label={toastEmailCopied}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyEmail(email);
                }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
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
        )}
        {/* Mobile: dropdown menu */}
        {isMobile && (
          <DropdownMenu
            onSelectItem={(itemId) => {
              if (itemId === `member-copy-email-${id}` && email) {
                copyEmail(email);
              } else if (itemId === `member-copy-phone-${id}` && phone) {
                copyPhone(phone);
              }
            }}
          >
            <DropdownMenu.Trigger>
              {({ setIsOpen, isOpen }) => (
                <Button
                  kind="icon-button"
                  icon="dots-vertical"
                  size="md"
                  intent="flat"
                  color="default"
                  label="Actions"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                  }}
                />
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content placement="bottom-right">
              <DropdownMenu.Item
                id={`member-copy-email-${id}`}
                icon="copy-07"
                disabled={!email}
              >
                {copyEmailLabel}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                id={`member-copy-phone-${id}`}
                icon="copy-07"
                disabled={!phone}
              >
                {copyPhoneLabel}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
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
