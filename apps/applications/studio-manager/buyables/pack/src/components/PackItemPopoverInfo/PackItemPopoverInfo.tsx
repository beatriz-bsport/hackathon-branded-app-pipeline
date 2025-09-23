import React from "react";

import { Body, Chip, Icon, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type PackItemPopoverInfoProps = {
  category?: string;
  credits?: number | null;
  invisible: boolean | null;
  price: string;
  unavailable: boolean;
};

export const PackItemPopoverInfo: React.FC<PackItemPopoverInfoProps> = ({
  credits,
  price,
  category,
  invisible,
  unavailable,
}) => {
  const { t } = useTranslation("details");

  const messages = {
    credits: t("addItemsModal.items.tooltips.credits"),
    price: t("addItemsModal.items.tooltips.price"),
    category: t("addItemsModal.items.tooltips.category"),
    unavailable: t("addItemsModal.items.tooltips.unavailableForMember"),
    invisible: t("addItemsModal.items.tooltips.invisibleToStaff"),
  };

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
