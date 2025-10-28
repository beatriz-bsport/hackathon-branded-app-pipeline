import type { FC } from "react";

import MenuItem from "#src/components/Menu/MenuItem";

/**
 * DropdownMenuDivider - Visual separator between menu sections
 */
export const DropdownMenuDivider: FC = () => {
  return <MenuItem type="divider" />;
};

DropdownMenuDivider.displayName = "DropdownMenuDivider";
