import { cx } from "class-variance-authority";
import type { FC } from "react";

import Button from "#src/components/Button";
import Chip, { type ChipProps } from "#src/components/Chip";
import Popover from "#src/components/Popover";

const DEFAULT_MAX_DISPLAY = 7;

export type ChipItem = ChipProps & { id: string };

export type ChipListProps = {
  chips: Array<ChipItem>;
  maxDisplay?: number;
  disabled?: boolean;
  handleDismissChip?: (chipId: string) => void;
  className?: string;
};

export const ChipList: FC<ChipListProps> = ({
  chips,
  maxDisplay,
  disabled,
  handleDismissChip,
  className = "",
}) => {
  if (!chips || chips.length === 0) {
    return null;
  }

  const nbOfDisplayedChips = Math.max(maxDisplay ?? DEFAULT_MAX_DISPLAY, 0); // Prevent negative values

  const renderChip = ({ onClick, id, dismissible, ...chipProps }: ChipItem) => {
    return (
      <Chip
        key={`chip-list-${id}`}
        {...chipProps}
        dismissible={
          dismissible ?? (!disabled && (!!handleDismissChip || !!onClick))
        }
        onClick={() => {
          handleDismissChip?.(id);
          onClick?.();
        }}
      />
    );
  };

  return (
    <div className={cx("flex flex-wrap gap-2xs", className)}>
      {chips.slice(0, nbOfDisplayedChips).map(renderChip)}

      {chips.length > nbOfDisplayedChips && (
        <Popover>
          <Popover.Anchor>
            {({ setIsPopoverOpened }) => (
              <Button
                key="chip-list-overflow"
                label={`+${chips.length - nbOfDisplayedChips}`}
                intent="default"
                color="main"
                size="sm"
                onClick={() => setIsPopoverOpened(true)}
              />
            )}
          </Popover.Anchor>

          <Popover.Content placement="bottom-right">
            {() => (
              <div className="flex flex-row flex-wrap gap-2xs p-sm max-w-component-popover-max">
                {chips.slice(nbOfDisplayedChips).map(renderChip)}
              </div>
            )}
          </Popover.Content>
        </Popover>
      )}
    </div>
  );
};
