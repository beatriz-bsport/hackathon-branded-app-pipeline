import { cx } from "class-variance-authority";
import React from "react";

import Divider from "#src/components/Divider";

export interface DividerProps extends React.ComponentProps<typeof Divider> {
  className?: string;
}

/**
 * NavigationMenu.Divider
 *
 * A divider component specifically styled for use within NavigationMenu.
 * Provides consistent spacing and styling for visual separation between menu items.
 */
const NavigationMenuDivider: React.FC<DividerProps> = ({
  className,
  ...props
}) => {
  return (
    <Divider
      className={cx("border-stroke-thin mt-2xs mb-xs last:mb-[0px]", className)}
      {...props}
    />
  );
};

NavigationMenuDivider.displayName = "KaizenNavigationMenuDivider";

export default NavigationMenuDivider;
