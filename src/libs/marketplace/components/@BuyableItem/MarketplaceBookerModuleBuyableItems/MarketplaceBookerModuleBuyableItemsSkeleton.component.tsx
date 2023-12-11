import React from 'react';

import Skeleton from '#csscomponents/Skeleton';

import './styles-skeleton.css';

const MarketplaceBookerModuleBuyableItemsSkeleton: React.FC = () => {
  return (
    <div className="bs-new-offer-booking__buyable_items__skeleton__container">
      <Skeleton className="bs-new-offer-booking__buyable_items__header__title--loading" />

      <Skeleton className="bs-marketplace-consumer-payment-pack-card__container--loading" />

      <div className="bs-marketplace-filter-buyable-item-category__container--loading">
        <Skeleton className="bs-marketplace-filter-buyable-item-category__button--loading-all" />
        <Skeleton className="bs-marketplace-filter-buyable-item-category__button--loading" />
        <Skeleton className="bs-marketplace-filter-buyable-item-category__button--loading" />
      </div>

      <Skeleton className="bs-marketplace-buyable-item-category__title--loading" />

      <Skeleton className="bs-marketplace-buyable-item-category__card--loading" />
      <Skeleton className="bs-marketplace-buyable-item-category__card--loading" />
    </div>
  );
};

export default MarketplaceBookerModuleBuyableItemsSkeleton;
