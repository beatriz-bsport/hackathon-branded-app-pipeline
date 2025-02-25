import React from 'react';

import clsx from 'clsx';

import Typography from '#Fabrique/Typography';
import Chip from '#Fabrique/Chip';

import type { ChipData } from '#src/libs/consumer-space/components/reworked/common/ConsumerCardChipList/types';

import '../styles.css';

type Props = {
  title: string;
  subtitle: string;
  description?: string;
  chipsDataList: ChipData[];
  className: string;
  chipsWrapperClassName: string;
};

const ConsumerGenericCardHeader: React.FC<Props> = ({
  title,
  subtitle,
  description,
  chipsDataList,
  className,
  chipsWrapperClassName,
}) => {
  return (
    <div className={clsx('bs-consumer__generic-card__header', className)}>
      <div className="bs-consumer__generic-card__header-title__container">
        <Typography
          className="bs-consumer__generic-card__header__title"
          variant="title-sm"
        >
          {title}
        </Typography>
        <Typography
          className="bs-consumer__generic-card__header__subtitle"
          variant="body-md"
        >
          {subtitle}
        </Typography>
        {description && (
          <Typography
            className="bs-consumer__generic-card__header-description"
            variant="body-md"
          >
            {description}
          </Typography>
        )}
      </div>
      <div
        className={clsx(
          'bs-consumer__generic-card__header__chips-wrapper',
          chipsWrapperClassName,
        )}
      >
        {(chipsDataList ?? []).map(
          ({
            shouldDisplay,
            chipClassName,
            chipColor,
            leftIcon,
            variant,
            text,
          }) =>
            shouldDisplay && (
              <Chip
                key={`${chipClassName}-${variant}-${chipColor}`}
                className={chipClassName}
                color={chipColor}
                leftIcon={leftIcon}
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

export default React.memo(ConsumerGenericCardHeader);
