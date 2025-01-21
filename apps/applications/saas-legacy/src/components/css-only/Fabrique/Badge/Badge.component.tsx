import React from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import { BadgeColorEnum } from './constants';

import { BadgeColor } from './types';
import './styles.css';

type Props = {
  value: number;
  classes?: { badgeValue?: string };
  className?: string;
  color?: BadgeColor;
};

export const Badge: React.FC<Props> = ({
  value,
  classes,
  color = BadgeColorEnum.MAIN,
  className,
}) => {
  return (
    <span
      className={clsx(
        'bs-fabrique-badge-root',
        {
          [`bs-fabrique-badge-root-${color}`]: color,
        },
        className,
      )}
    >
      <Typography
        align="center"
        className={clsx(
          'bs-fabrique-badge-content-typography',
          {
            [`bs-fabrique-badge-content-${color}`]: color,
          },
          classes?.badgeValue,
        )}
        variant="body-xs"
      >
        {value > 999 ? '999+' : value}
      </Typography>
    </span>
  );
};

export const BadgeStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Badge>>()(Badge);

export default React.memo(Badge);
