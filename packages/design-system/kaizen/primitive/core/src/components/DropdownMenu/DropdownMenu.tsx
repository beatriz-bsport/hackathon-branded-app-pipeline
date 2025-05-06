import type { ComponentProps } from "react";

import Menu from "#src/components/Menu";
import Popover from "#src/components/Popover";

export type DropdownMenuItems = ComponentProps<typeof Menu>["items"];

export type DropdownMenuProps = {
  className?: string;
  target: ComponentProps<typeof Popover.Anchor>["children"];
  items: DropdownMenuItems;
  onSelectOption: (params: {
    id: string;
    setIsPopoverOpened: (value: boolean) => void;
  }) => void;
  placement?: ComponentProps<typeof Popover.Content>["placement"];
  selectedValues?: ComponentProps<typeof Menu>["selectedValues"];
};

/**
 * DropdownMenu
 * @param props.className - className to be applied to the component
 * @param props.target - render callback for the popover anchor
 * @param props.items - items to be rendered inside the menu
 * @param props.onSelectOption - callback to be called when an item is selected
 * @param props.placement - placement of the popover
 **/
export default function DropdownMenu({
  className,
  target,
  onSelectOption,
  items,
  placement,
  selectedValues,
}: DropdownMenuProps) {
  return (
    <Popover className={className}>
      <Popover.Anchor>{target}</Popover.Anchor>
      <Popover.Content placement={placement}>
        {({
          setIsPopoverOpened,
        }: {
          setIsPopoverOpened: (value: boolean) => void;
        }) => (
          <Menu
            items={items}
            onSelectOption={(id: string) => {
              onSelectOption({
                id,
                setIsPopoverOpened,
              });
            }}
            selectedValues={selectedValues}
          />
        )}
      </Popover.Content>
    </Popover>
  );
}
