import React from "react";

import MenuItem from "#src/components/Menu/MenuItem";
import { extractTextFromNode } from "#src/utils/extract-text-from-node";

import type { DropdownMenuTitleProps } from "./types";

/**
 * DropdownMenuTitle - Non-interactive title/header for sections within the menu
 * @param props.children - Title text
 */
export const DropdownMenuTitle: React.FC<DropdownMenuTitleProps> = ({
  children,
}) => {
  const label = extractTextFromNode(children);

  return <MenuItem type="title" label={label} />;
};

DropdownMenuTitle.displayName = "DropdownMenuTitle";
