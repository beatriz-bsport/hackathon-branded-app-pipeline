import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
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
      className={classNames(
        'bs-fabrique-badge-root',
        {
          [`bs-fabrique-badge-root-${color}`]: color,
        },
        className,
      )}
    >
      <Typography
        align="center"
        className={classNames(
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
