import React from 'react';
import classNames from 'classnames';

import { SkeletonAnimation, SkeletonVariant } from '.';

import './styles.css';

export type Props = {
  variant: SkeletonVariant;
  animation?: SkeletonAnimation;
  className?: string;
};

const Skeleton: React.FC<Props> = ({ variant, animation, className }) => (
  <div
    className={classNames(
      'bs-skeleton__container',
      {
        'bs-skeleton__variant--text': variant === SkeletonVariant.TEXT,
        'bs-skeleton__variant--circle': variant === SkeletonVariant.CIRCLE,
        'bs-skeleton__variant--rectangle':
          variant === SkeletonVariant.RECTANGLE,
        'bs-skeleton__animation--pulse':
          typeof animation === 'undefined' ||
          animation === SkeletonAnimation.PULSE,
        'bs-skeleton__animation--wave': animation === SkeletonAnimation.WAVE,
      },
      className,
    )}
  />
);

export default React.memo(Skeleton);
