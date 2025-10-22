import { type FC } from "react";

import Popover from "#src/components/Popover";

import { useDropdownMenuContext } from "./DropdownMenuContext";
import type { DropdownMenuTriggerProps } from "./types";

/**
 * DropdownMenuTrigger - Renders the trigger element that opens the dropdown menu
 * @param props.children - Render function that receives isOpen and setIsOpen
 */
export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  children,
}) => {
  const { closePopoverRef } = useDropdownMenuContext();
  return (
    <Popover.Anchor>
      {({ isPopoverOpened, setIsPopoverOpened }) => {
        closePopoverRef.current = () => setIsPopoverOpened(false);

        return children({
          isOpen: isPopoverOpened,
          setIsOpen: setIsPopoverOpened,
        });
      }}
    </Popover.Anchor>
  );
};

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
