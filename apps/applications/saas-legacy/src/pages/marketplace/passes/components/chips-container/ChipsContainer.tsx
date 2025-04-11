import React, { memo } from 'react';
import clsx from 'clsx';
import Chip from '#src/components/css-only/Fabrique/Chip';
import {
  ChipColorEnum,
  ChipSizeEnum,
  ChipVariantEnum,
} from '#src/components/css-only/Fabrique/Chip/constants';
import Typography from '#src/components/css-only/Fabrique/Typography';
import './style.css';

export type ChipData = {
  label: string;
  size?: ChipSizeEnum;
  color?: ChipColorEnum;
  variant?: ChipVariantEnum;
};

type ChipsContainerProps = {
  title?: string;
  chips: ChipData[];
  classname?: string;
};

/**
 * A container component that renders a list of chips with optional title.
 */
const ChipsContainer: React.FC<ChipsContainerProps> = ({
  title,
  chips,
  classname,
}) => {
  if (!chips.length) return null;

  return (
    <div className={clsx('bs-marketplace-chips-container', classname)}>
      {title && (
        <Typography
          className="bs-marketplace-chips-container__title"
          variant="body-md"
        >
          {title}
        </Typography>
      )}
      <div className="bs-marketplace-chips-container__list">
        {chips.map((chip, index) => {
          return (
            <Chip
              key={index}
              color={chip.color ?? ChipColorEnum.GREY}
              size={chip.size ?? ChipSizeEnum.SM}
              variant={chip.variant ?? ChipVariantEnum.WEAK}
            >
              {chip.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ChipsContainer);
