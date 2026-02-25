import { useEffect } from "react";

import { Button, Chip, Popover, Tooltip } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

type GiftcardHiddenPopoverContentProps = {
  onClose: () => void;
  tooltipLabel: string;
  chipLabel: string;
};

const GiftcardHiddenPopoverContent = ({
  onClose,
  tooltipLabel,
  chipLabel,
}: GiftcardHiddenPopoverContentProps) => {
  /** Closes the popover when the user scrolls (e.g. list or scrollbar). */
  useEffect(() => {
    const handleScroll = () => onClose();
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [onClose]);

  return (
    <Tooltip label={tooltipLabel} placement="bottom-left">
      <Chip
        label={chipLabel}
        iconLeft="package-x"
        type="weak"
        color="default"
        size="lg"
      />
    </Tooltip>
  );
};

/**
 * Info slot for giftcard items that are hidden from the Member Area.
 *
 * TODO: Extend this component (or introduce a shared item-info-slot) to support
 * other chips and other item types (e.g. pass, pack, product) in a later iteration.
 */
export const GiftcardHiddenInfoSlot = () => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            icon="info-circle"
            size="md"
            intent="flat"
            color="default"
            label={t("itemAutocomplete.hiddenGiftcardTooltip")}
            onClick={() => setIsPopoverOpened((v) => !v)}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-left">
        {({ setIsPopoverOpened }) => (
          <GiftcardHiddenPopoverContent
            onClose={() => setIsPopoverOpened(false)}
            tooltipLabel={t("itemAutocomplete.hiddenGiftcardTooltip")}
            chipLabel={t("itemAutocomplete.hiddenChipLabel")}
          />
        )}
      </Popover.Content>
    </Popover>
  );
};
