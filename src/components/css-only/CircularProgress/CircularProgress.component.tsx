import React from 'react';

import classNames from 'classnames';

import './styles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  size?: 'xs' | 'sm';
  contrastStrokeColor?: boolean;
};

const circularProgressSizeClasses = {
  xs: 'bs-circular-progress__container--x-small',
  sm: 'bs-circular-progress__container--small',
};

const CircularProgress: React.FC<Props> = ({ size, contrastStrokeColor }) => {
  const circleContainerClass =
    circularProgressSizeClasses[size] ?? 'bs-circular-progress__container';

  return (
    <div className={circleContainerClass}>
      <svg
        viewBox="22 22 44 44"
        className="bs-circular-progress__circle__container"
      >
        <circle
          className={classNames({
            'bs-circular-progress__circle': !contrastStrokeColor,
            'bs-circular-progress__circle_contrast__color': contrastStrokeColor,
          })}
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          strokeWidth="3.6"
        />
      </svg>
    </div>
  );
};

export const CircularProgressForStorybook =
  marketplaceCssHoc()(CircularProgress);

export default React.memo(CircularProgress);
