import React from "react";

import Popover from "#src/components/Popover";

import type { DropdownMenuContentProps } from "./types";

/**
 * DropdownMenuContent - Wraps the menu items and other content
 * @param props.children - Menu items and other content
 * @param props.className - Additional CSS classes
 * @param props.popoverContentClassName - CSS classes for the Popover.Content wrapper
 * @param props.placement - Popover placement
 * @param props.maxHeightPx - Maximum height in pixels
 * @param props.maxWidthPx - Maximum width in pixels
 */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  popoverContentClassName,
  placement = "bottom-left",
  maxHeightPx,
  maxWidthPx,
}) => {
  return (
    <Popover.Content
      className={popoverContentClassName}
      placement={placement}
      maxHeightPx={maxHeightPx}
      maxWidthPx={maxWidthPx}
    >
      {() => (
        <div className={className}>
          <ul role="menu" className="flex flex-col gap-xs">
            {children}
          </ul>
        </div>
      )}
    </Popover.Content>
  );
};

DropdownMenuContent.displayName = "DropdownMenuContent";
