import React from 'react';

import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './styles.css';

export type Props = {
  size?: 'xs' | 'sm';
  contrastStrokeColor?: boolean;
  className?: string;
};

const circularProgressSizeClasses = {
  xs: 'bs-circular-progress__container--x-small',
  sm: 'bs-circular-progress__container--small',
};

const CircularProgress: React.FC<Props> = ({
  size,
  contrastStrokeColor,
  className,
}) => {
  const circleContainerClass =
    circularProgressSizeClasses[size] ?? 'bs-circular-progress__container';

  return (
    <div className={classNames(circleContainerClass, className)}>
      <svg
        className="bs-circular-progress__circle__container"
        viewBox="22 22 44 44"
      >
        <circle
          className={classNames({
            'bs-circular-progress__circle': !contrastStrokeColor,
            'bs-circular-progress__circle_contrast__color': contrastStrokeColor,
          })}
          cx="44"
          cy="44"
          fill="none"
          r="20.2"
          strokeWidth="3.6"
        />
      </svg>
    </div>
  );
};

export const CircularProgressForStorybook =
  marketplaceCssHoc()(CircularProgress);

export default React.memo(CircularProgress);
