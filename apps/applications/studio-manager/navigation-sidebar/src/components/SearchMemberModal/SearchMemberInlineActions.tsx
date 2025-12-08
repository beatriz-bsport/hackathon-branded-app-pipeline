import type { FC } from "react";

import {
  Badge,
  Body,
  Button,
  CopyToClipboard,
  Popover,
} from "@bsport/kaizen-primitive-core";

import type { TagsMap } from "./constants";

type MemberInlineActionsProps = {
  id: number;
  phone?: string;
  email?: string;
  tags: number[];
  tagsMap: TagsMap;
  translations: {
    toastEmailCopied: string;
    toastPhoneCopied: string;
    tagsTooltip: string;
    copyEmailLabel: string;
    copyPhoneLabel: string;
  };
};

export const SearchMemberInlineActions: FC<MemberInlineActionsProps> = ({
  id,
  phone,
  email,
  translations,
  tags,
  tagsMap,
}) => (
  <div className="flex justify-end gap-sm">
    {email ? (
      <CopyToClipboard
        size="md"
        iconLeft="copy-07"
        intent="flat"
        color="default"
        label={email}
        value={email}
        tooltip={translations.copyEmailLabel}
        toastMessage={translations.toastEmailCopied}
        className="truncate max-w-[300px]"
      />
    ) : undefined}

    {phone ? (
      <CopyToClipboard
        size="md"
        iconLeft="copy-07"
        intent="flat"
        color="default"
        label={phone}
        value={phone}
        tooltip={translations.copyPhoneLabel}
        toastMessage={translations.toastPhoneCopied}
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
            label={translations.tagsTooltip}
            onMouseEnter={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}
      </Popover.Anchor>

      <Popover.Content placement="bottom-right">
        {() => (
          <div className="flex flex-col gap-xs p-sm max-w-[240px]">
            <Body htmlVariant="p" size="lg" color="weak" weight="weak">
              {translations.tagsTooltip}
            </Body>
            <div className="flex flex-row gap-xs items-center flex-wrap">
              {tags.map((tagId) => {
                const tagInfo = tagsMap.get(tagId);

                const tagText = tagInfo
                  ? formatTagName({
                      categoryName: tagInfo.categoryName,
                      tagName: tagInfo.tagName,
                    })
                  : String(tagId);

                const tagStyle = tagInfo?.color // Color, if defined, is shaped as `#XXYYZZ`
                  ? {
                      color: tagInfo.color,
                      borderColor: tagInfo.color,
                      backgroundColor: `${tagInfo.color}10`, // Reduce the opacity
                    }
                  : {};

                return (
                  <Badge
                    key={`member-${id}-tag-${tagId}`}
                    className="h-fit max-w-full"
                    textClassName="truncate"
                    color="main"
                    size="lg"
                    text={tagText}
                    style={tagStyle}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  </div>
);

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
