import { type VariantProps, cva } from "class-variance-authority";
import React, { useMemo } from "react";

import Avatar from "#src/components/Avatar";
import Body from "#src/components/Body";
import Icon from "#src/components/Icon";
import {
  defaultMenuItemClasses,
  menuItemVariants,
} from "#src/components/Menu/MenuItem/constants";
import type { Text as TextType } from "#src/components/Menu/MenuItem/types";

const menuItemText = cva(["pointer-events-none", ...defaultMenuItemClasses], {
  variants: menuItemVariants,
});

export type TextProps = Omit<
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof menuItemText>,
  "children"
> &
  TextType;

const Text: React.FC<TextProps> = ({
  avatar,
  className,
  iconLeft,
  label,
  rightSlot,
  description,
  leftSlot,
  ...props
}) => {
  const renderedAvatar = useMemo(
    () =>
      avatar ? (
        <Avatar
          src={avatar.src}
          initials={avatar.initials}
          alt="Avatar"
          shape="round"
          size="sm"
        />
      ) : null,
    [avatar],
  );

  const renderedIcon = useMemo(
    () => (iconLeft ? <Icon icon={iconLeft} size="sm" /> : null),
    [iconLeft],
  );

  const renderedLabel = useMemo(
    () => (label ? <Body htmlVariant="span">{label}</Body> : null),
    [label],
  );

  const renderedDescription = useMemo(
    () =>
      description ? (
        <Body htmlVariant="span" size="md" color="weak">
          {description}
        </Body>
      ) : null,
    [description],
  );

  return (
    <div
      data-component="Kaizen-Menu-Item-Text"
      className={menuItemText({ className })}
      {...props}
    >
      <div className="flex items-center justify-between w-full gap-xs">
        <div className="flex gap-xs items-center">
          {leftSlot ?? renderedAvatar ?? renderedIcon}
          <div className="flex flex-col">
            {renderedLabel}
            {renderedDescription}
          </div>
        </div>
        {rightSlot ?? null}
      </div>
    </div>
  );
};

export default Text;
