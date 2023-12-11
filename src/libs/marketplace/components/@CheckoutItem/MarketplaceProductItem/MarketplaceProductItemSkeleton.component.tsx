import React from 'react';
import Skeleton from '#components/css-only/Skeleton';

import './styles-skeleton.css';

const MarketplaceProductItemSkeleton: React.FC = () => (
  <Skeleton className="bs-product-item__skeleton" />
);
export default MarketplaceProductItemSkeleton;
