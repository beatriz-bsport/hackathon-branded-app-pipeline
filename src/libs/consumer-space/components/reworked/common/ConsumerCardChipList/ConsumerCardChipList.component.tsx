import React from 'react';

import classNames from 'classnames';

import Typography from '#Fabrique/Typography';
import Chip from '#Fabrique/Chip';
import { ChipSizeEnum } from '#Fabrique/Chip/constants';

import type { ChipData } from '#libs/consumer-space/components/reworked/common/ConsumerCardChipList/types';

import './styles.css';

export type Props = {
  chipsDataList: ChipData[];
  title?: string;
  className?: string;
  classes?: { title?: string; list?: string };
};

const ConsumerCardChipList: React.FC<Props> = ({
  chipsDataList,
  title,
  className,
  classes,
}) => {
  if (!chipsDataList?.length) {
    return null;
  }

  return (
    <div className={classNames('bs-consumer-card-chip-list', className)}>
      <Typography
        className={classNames(
          'bs-consumer-card-chip-list__title',
          classes?.title,
          {
            'bs-consumer-card-chip-list__title--hidden': !title,
          },
        )}
        variant="body-md"
      >
        {title}
      </Typography>
      <div
        className={classNames(
          'bs-consumer-card-chip-list__list',
          classes?.list,
        )}
      >
        {chipsDataList?.map(
          (
            {
              shouldDisplay,
              chipClassName,
              chipColor,
              leftIcon,
              variant,
              text,
            },
            index,
          ) => (
            <Chip
              key={`${text}-${index}`}
              className={classNames(
                'bs-consumer-card-chip-list__chip',
                chipClassName,
                {
                  'bs-consumer-card-chip-list__chip--hidden':
                    !shouldDisplay || !text,
                },
              )}
              color={chipColor}
              leftIcon={leftIcon}
              size={ChipSizeEnum.SM}
              variant={variant ?? 'weak'}
            >
              {text}
            </Chip>
          ),
        )}
      </div>
    </div>
  );
};

export default React.memo(ConsumerCardChipList);
