import type { FC, ReactNode } from "react";

import {
  Body,
  Button,
  Popover,
  RadioButton,
  type RadioButtonProps,
} from "@bsport/kaizen-primitive-core";

type RadioButtonWithChildrenProps = {
  information: string;
  children: ReactNode;
} & RadioButtonProps;

export const RadioButtonWithChildren: FC<RadioButtonWithChildrenProps> = ({
  checked,
  information,
  children,
  ...radioProps
}) => {
  return (
    <div>
      <div className="flex flex-row gap-2xs items-center">
        <RadioButton checked={checked} {...radioProps} />

        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened, isPopoverOpened }) => (
              <Button
                icon="info-circle"
                color="default"
                intent="flat"
                kind="icon-button"
                size="md"
                label="Display more information"
                onClick={() => setIsPopoverOpened(!isPopoverOpened)}
              />
            )}
          </Popover.Anchor>
          <Popover.Content
            placement="bottom"
            className="max-w-component-popover-min"
          >
            {() => <Body>{information}</Body>}
          </Popover.Content>
        </Popover>
      </div>
      {checked && <div className="ml-element-md flex">{children}</div>}
    </div>
  );
};
