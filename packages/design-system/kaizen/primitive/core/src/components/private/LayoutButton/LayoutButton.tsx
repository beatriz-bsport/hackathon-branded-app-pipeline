import React from "react";

import Button, { type ButtonProps } from "#src/components/Button";
import type { IconName } from "#src/components/Icon";
import { useMatchMedia } from "#src/hooks/use-match-media";

export type LayoutButtonProps = {
  /**
   * Icon to display on the left side of the button in desktop mode
   */
  iconLeft?: IconName;
  /**
   * Icon to display on the right side of the button in desktop mode
   */
  iconRight?: IconName;
  /**
   * Size of the button in desktop mode
   * @default "md"
   */
  desktopSize?: ButtonProps["size"];
  /**
   * Size of the button in mobile mode (icon-only)
   * @default "md"
   */
  mobileSize?: ButtonProps["size"];
} & Omit<ButtonProps, "kind" | "icon" | "iconLeft" | "iconRight" | "size">;

/**
 * Internal layout button component that adapts based on screen size:
 * - **Desktop (≥640px)**: Shows full button with label and optional icons
 * - **Mobile (<640px)**: Shows icon-only button
 *
 * If no icon is provided, defaults to a "plus" icon in mobile mode.
 *
 * **Note:** This component is internal and should only be accessed via
 * `ListLayout.Button` or `DetailsLayout.Button`.
 *
 * @example
 * // With left icon
 * <LayoutButton
 *   label="Add Item"
 *   iconLeft="plus"
 *   intent="call-to-action"
 *   color="main"
 * />
 *
 * @example
 * // With right icon (will show in mobile)
 * <LayoutButton
 *   label="Next"
 *   iconRight="chevron-right"
 *   intent="default"
 *   color="main"
 * />
 *
 * @example
 * // No icon provided (defaults to plus in mobile)
 * <LayoutButton
 *   label="Create"
 *   intent="call-to-action"
 *   color="main"
 * />
 */
const LayoutButton: React.FC<LayoutButtonProps> = (props) => {
  const {
    iconLeft,
    iconRight,
    desktopSize = "md",
    mobileSize = "md",
    ...buttonProps
  } = props;

  const isDesktop = useMatchMedia("sm");

  const mobileIcon = iconLeft || iconRight || "plus";

  if (isDesktop) {
    const desktopButtonProps = {
      ...buttonProps,
      iconLeft,
      iconRight,
      size: desktopSize,
    } as ButtonProps;

    return <Button {...desktopButtonProps} />;
  }

  const mobileButtonProps = {
    ...buttonProps,
    kind: "icon-button",
    icon: mobileIcon,
    size: mobileSize,
  } as ButtonProps;

  return <Button {...mobileButtonProps} />;
};

LayoutButton.displayName = "KaizenLayoutButton";

export default LayoutButton;
