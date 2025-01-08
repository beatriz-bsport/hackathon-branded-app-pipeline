import React, { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Avatar from "#src/components/Avatar";
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
    () => (label ? <span className="pr-xs">{label}</span> : null),
    [label],
  );

  const renderedRightSlot = useMemo(
    () => (rightSlot ? <div className="flex">{rightSlot}</div> : null),
    [rightSlot],
  );

  return (
    <div className={menuItemText({ className })} {...props}>
      {renderedAvatar ?? renderedIcon}
      {renderedLabel}
      {renderedRightSlot}
    </div>
  );
};

Text.displayName = "KaizenMenuItemText";

export default Text;
