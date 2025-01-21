import React from 'react';
import clsx from 'clsx';

import {
  SkeletonAnimation,
  SkeletonAnimationEnum,
  SkeletonVariant,
  SkeletonVariantEnum,
} from '.';

import './styles.css';

export type Props = {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  className?: string;
};

const Skeleton: React.FC<Props> = ({
  variant = SkeletonVariantEnum.RECTANGLE,
  animation,
  className,
}) => (
  <div
    className={clsx(
      'bs-skeleton__container',
      {
        'bs-skeleton__variant--text': variant === SkeletonVariantEnum.TEXT,
        'bs-skeleton__variant--circle': variant === SkeletonVariantEnum.CIRCLE,
        'bs-skeleton__variant--rectangle':
          variant === SkeletonVariantEnum.RECTANGLE,
        'bs-skeleton__animation--pulse':
          typeof animation === 'undefined' ||
          animation === SkeletonAnimationEnum.PULSE,
        'bs-skeleton__animation--wave':
          animation === SkeletonAnimationEnum.WAVE,
      },
      className,
    )}
  />
);

export default React.memo(Skeleton);
