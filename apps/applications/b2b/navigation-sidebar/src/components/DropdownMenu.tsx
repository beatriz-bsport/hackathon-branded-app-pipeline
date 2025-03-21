import type { ComponentProps } from "react";
import { Menu, Popover } from "@bsport/kaizen-primitive-core";

export type DropdownMenuItems = ComponentProps<typeof Menu>["items"];

export type DropdownProps = {
  className?: string;
  children: ComponentProps<typeof Popover.Anchor>["children"];
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
 * @param props.children - children to be rendered inside the anchor
 * @param props.items - items to be rendered inside the menu
 * @param props.onSelectOption - callback to be called when an item is selected
 * @param props.placement - placement of the popover
 **/
export default function DropdownMenu({
  className,
  children,
  onSelectOption,
  items,
  placement,
  selectedValues,
}: DropdownProps) {
  return (
    <Popover className={className}>
      <Popover.Anchor>{children}</Popover.Anchor>
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
