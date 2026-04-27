import React from "react";

import { Button, Item, Menu, Popover } from "@bsport/kaizen-primitive-core";

type ActionsMenuButtonProps = {
  label: string;
  items: (
    setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Item[];
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  prominent?: boolean;
  intent?: "flat" | "default";
  color?: "default" | "main";
};

export const ActionsMenuButton: React.FC<ActionsMenuButtonProps> = ({
  label,
  items,
  onButtonClick,
  prominent = false,
}) => (
  <Popover>
    <Popover.Anchor>
      {({ setIsPopoverOpened }) => (
        <Button
          kind="icon-button"
          icon="dots-vertical"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick?.(e);
            setIsPopoverOpened(true);
          }}
          size="md"
          {...(prominent
            ? { intent: "default", color: "main" }
            : { intent: "flat", color: "default" })}
          label={label}
        />
      )}
    </Popover.Anchor>
    <Popover.Content placement="bottom-right">
      {({ setIsPopoverOpened }) => (
        <div className="flex flex-col gap-sm">
          <Menu items={items(setIsPopoverOpened)} />
        </div>
      )}
    </Popover.Content>
  </Popover>
);
