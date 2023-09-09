import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import MarketplaceOfferBookingItem from '#libs/marketplace/components/@Booking/MarketplaceOfferBookingItem';

import type { OfferWithSpotInformation } from '#libs/offer/types';
import type { CompanyTheme } from '#libs/theme/types';

import './styles.css';

export type Props = {
  offers: OfferWithSpotInformation[];
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  isLoading: boolean;
  classes?: { [key: string]: string | boolean };
};

const MarketplaceOfferBookingList: React.FC<Props> = ({
  offers,
  companyTheme,
  hideCoach,
  classes,
  isLoading,
}) => {
  const filteredOffers = offers.filter((offer) => !!offer);

  return (
    <div
      className={classNames('bs-offer-booking-list__container', {
        ...classes,
      })}
    >
      <ul className="bs-offer-booking-list">
        {filteredOffers.map((offer) => {
          return (
            <MarketplaceOfferBookingItem
              key={`offer-booking-item-id-${offer.id}`}
              companyTheme={companyTheme}
              hideCoach={hideCoach}
              isLoading={isLoading}
              offer={offer}
            />
          );
        })}
      </ul>
    </div>
  );
};

export const MarketplaceOfferBookingListForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingList,
);

export default React.memo(MarketplaceOfferBookingList);
