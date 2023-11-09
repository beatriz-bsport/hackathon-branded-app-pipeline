import React from 'react';

import Skeleton, { SkeletonVariant } from '#csscomponents/Skeleton';

import './styles-skeleton.css';

const MarketplaceBookerModuleBuyableItemsSkeleton: React.FC = () => {
  return (
    <div className="bs-new-offer-booking__buyable_items__skeleton__container">
      <Skeleton
        className="bs-new-offer-booking__buyable_items__header__title--loading"
        variant={SkeletonVariant.RECTANGLE}
      />

      <Skeleton
        className="bs-marketplace-consumer-payment-pack-card__container--loading"
        variant={SkeletonVariant.RECTANGLE}
      />

      <div className="bs-marketplace-filter-buyable-item-category__container--loading">
        <Skeleton
          className="bs-marketplace-filter-buyable-item-category__button--loading-all"
          variant={SkeletonVariant.RECTANGLE}
        />
        <Skeleton
          className="bs-marketplace-filter-buyable-item-category__button--loading"
          variant={SkeletonVariant.RECTANGLE}
        />
        <Skeleton
          className="bs-marketplace-filter-buyable-item-category__button--loading"
          variant={SkeletonVariant.RECTANGLE}
        />
      </div>

      <Skeleton
        className="bs-marketplace-buyable-item-category__title--loading"
        variant={SkeletonVariant.RECTANGLE}
      />

      <Skeleton
        className="bs-marketplace-buyable-item-category__card--loading"
        variant={SkeletonVariant.RECTANGLE}
      />
      <Skeleton
        className="bs-marketplace-buyable-item-category__card--loading"
        variant={SkeletonVariant.RECTANGLE}
      />
    </div>
  );
};

export default MarketplaceBookerModuleBuyableItemsSkeleton;
