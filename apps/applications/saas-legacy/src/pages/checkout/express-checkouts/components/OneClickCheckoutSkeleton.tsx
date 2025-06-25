import React from 'react';
import Skeleton from '#src/components/css-only/Skeleton';

type Props = { isLoading: boolean };

export const OneClickCheckoutSkeleton: React.FC<Props> = React.memo(
  ({ isLoading }) => {
    if (!isLoading) return null;

    return (
      <>
        <div className="bs-oneclick-booking__skeleton--mobile">
          <Skeleton className="bs-oneclick-booking__skeleton--tiny" />
          <Skeleton className="bs-oneclick-booking__skeleton" />
          <Skeleton className="bs-oneclick-booking__skeleton--small" />
          <Skeleton className="bs-oneclick-booking__skeleton--small" />
          <Skeleton className="bs-oneclick-booking__skeleton" />
        </div>
        <div className="bs-oneclick-booking__skeleton--desktop">
          <div className="bs-oneclick-booking__skeleton-booking-details">
            <Skeleton className="bs-oneclick-booking__skeleton--tiny" />
            <Skeleton className="bs-oneclick-booking__skeleton" />
            <Skeleton className="bs-oneclick-booking__skeleton--small" />
          </div>
          <div className="bs-oneclick-booking__skeleton-form">
            <Skeleton className="bs-oneclick-booking__skeleton--tiny" />
            <div className="bs-oneclick-booking__skeleton-form__container">
              <Skeleton className="bs-oneclick-booking__skeleton--medium" />
              <Skeleton className="bs-oneclick-booking__skeleton--medium" />
              <Skeleton className="bs-oneclick-booking__skeleton--medium" />
              <Skeleton className="bs-oneclick-booking__skeleton--medium" />
            </div>
            <div className="bs-oneclick-booking__skeleton-form__container">
              <Skeleton className="bs-oneclick-booking__skeleton--thin" />
              <Skeleton className="bs-oneclick-booking__skeleton--thin" />
              <Skeleton className="bs-oneclick-booking__skeleton--thin" />
            </div>
          </div>
        </div>
      </>
    );
  },
);
