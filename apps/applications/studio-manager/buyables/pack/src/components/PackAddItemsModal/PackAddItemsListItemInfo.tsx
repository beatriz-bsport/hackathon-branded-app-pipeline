import React from "react";

import { Body, Chip, Icon, Popover } from "@bsport/kaizen-primitive-core";

type PackAddItemsListItemInfoProps = {
  category?: string;
  credits?: number | null;
  invisible: boolean | null;
  price: string;
  unavailable: boolean;
  messages: {
    credits: string;
    price: string;
    category: string;
    invisible: string;
    unavailable: string;
  };
};

export const PackAddItemsListItemInfo: React.FC<
  PackAddItemsListItemInfoProps
> = ({ credits, price, category, invisible, unavailable, messages }) => {
  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Icon
            icon="info-circle"
            color="main"
            size="md"
            onMouseEnter={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-left" className="p-xl">
        {() => (
          <div className="flex flex-col gap-xs">
            {credits !== null && credits !== undefined && (
              <Body>{`${messages.credits}: ${credits}`}</Body>
            )}

            {price && <Body>{`${messages.price}: ${price}`}</Body>}

            {category && <Body>{`${messages.category}: ${category}`}</Body>}

            {(unavailable || invisible) && (
              <div className="flex flex-row gap-xs">
                {unavailable && (
                  <Chip
                    label={messages.unavailable}
                    size="lg"
                    type="weak"
                    color="default"
                    iconLeft="package-x"
                  />
                )}

                {invisible && (
                  <Chip
                    label={messages.invisible}
                    size="lg"
                    type="weak"
                    color="default"
                    iconLeft="eye-off"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
