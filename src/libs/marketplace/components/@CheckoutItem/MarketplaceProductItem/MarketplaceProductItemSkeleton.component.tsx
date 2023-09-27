import React from 'react';
import Skeleton, { SkeletonVariant } from '#components/css-only/Skeleton';

import './styles-skeleton.css';

const MarketplaceProductItemSkeleton: React.FC = () => (
  <Skeleton
    className="bs-product-item__skeleton"
    variant={SkeletonVariant.RECTANGLE}
  />
);
export default MarketplaceProductItemSkeleton;
