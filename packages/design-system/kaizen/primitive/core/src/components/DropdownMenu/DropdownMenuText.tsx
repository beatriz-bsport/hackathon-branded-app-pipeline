import React from "react";

import MenuItem from "#src/components/Menu/MenuItem";
import { extractTextFromNode } from "#src/utils/extract-text-from-node";

import type { DropdownMenuTextProps } from "./types";

/**
 * DropdownMenuText - Non-selectable text item with optional icon or avatar
 * @param props.id - Unique identifier
 * @param props.children - Text content
 * @param props.icon - Icon name to display on the left
 * @param props.avatar - Avatar configuration
 * @param props.rightSlot - Custom content on the right
 * @param props.description - Secondary text below the main content
 */
export const DropdownMenuText: React.FC<DropdownMenuTextProps> = ({
  id,
  children,
  icon,
  avatar,
  rightSlot,
  description,
}) => {
  const label = extractTextFromNode(children);

  return (
    <MenuItem
      type="text"
      id={id}
      label={label}
      iconLeft={icon}
      avatar={avatar}
      rightSlot={rightSlot}
      description={description}
    />
  );
};

DropdownMenuText.displayName = "DropdownMenuText";
