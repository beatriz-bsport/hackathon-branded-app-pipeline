import React from 'react';

import classNames from 'classnames';

import Typography from '#Fabrique/Typography';
import Chip, { ChipColor, ChipVariant } from '#Fabrique/Chip';

import '../styles.css';

type Props = {
  title: string;
  subtitle: string;
  chipsDataList: {
    shouldDisplay: boolean;
    chipColor: ChipColor;
    leftIcon: React.ReactNode;
    variant?: ChipVariant;
    text: string;
    chipClassName: string;
  }[];
  className: string;
  chipsWrapperClassName: string;
};

const ConsumerGenericCardHeader: React.FC<Props> = ({
  title,
  subtitle,
  chipsDataList,
  className,
  chipsWrapperClassName,
}) => {
  return (
    <div className={classNames('bs-consumer__generic-card__header', className)}>
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
      </div>
      <div
        className={classNames(
          'bs-consumer__generic-card__header__chips-wrapper',
          chipsWrapperClassName,
        )}
      >
        {(chipsDataList || []).map(
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
