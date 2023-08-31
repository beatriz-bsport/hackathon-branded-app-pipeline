import React from 'react';
import Skeleton, { SkeletonVariant } from '#components/css-only/Skeleton';
import './styles.css';

const MinimalCardSkeleton: React.FC = () => (
  <Skeleton
    className="bs-minimal-card__skeleton"
    variant={SkeletonVariant.RECTANGLE}
  />
);
export default MinimalCardSkeleton;
