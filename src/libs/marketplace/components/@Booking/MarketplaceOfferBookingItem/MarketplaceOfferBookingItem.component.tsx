import React from 'react';
import { useTranslation } from 'react-i18next';
import { OfferWithSpotInformation } from '#libs/offer/types';
import { CompanyTheme } from '#libs/theme/types';
import MarketplaceBookingItem from '../MarketplaceBookingItem';
import { useOfferFormattedDate, useOfferHours } from '#libs/marketplace/hooks';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceOfferBookingItemSkeleton from './MarketplaceOfferBookingItemSkeleton.component';

export type Props = {
  offer: OfferWithSpotInformation;
  hideCoach: boolean;
  companyTheme: CompanyTheme;
  isLoading: boolean;
};

const MarketplaceOfferBookingItem: React.FC<Props> = ({
  companyTheme,
  hideCoach,
  offer,
  isLoading,
}) => {
  const formattedDate = useOfferFormattedDate(offer, companyTheme);
  const { t } = useTranslation('booking');

  const offerHours = useOfferHours(
    offer,
    offer.establishment,
    offer.meta_activity,
    companyTheme,
  );

  const date = `${formattedDate} • ${offerHours}`;

  if (isLoading) {
    return <MarketplaceOfferBookingItemSkeleton />;
  }

  return (
    <MarketplaceBookingItem
      coach={offer.coach}
      companyTheme={companyTheme}
      date={date}
      establishment={offer.establishment}
      hideCoach={hideCoach}
      isWaitingList={offer.full}
      level={offer.customLevel}
      spotName={`${t('place')} ${offer.spot_information?.prefix}${
        offer.spot_information?.indexType
      }`}
      title={offer.meta_activity?.name}
    />
  );
};

export const MarketplaceOfferBookingItemForStorybook = marketplaceCssHoc()(
  MarketplaceOfferBookingItem,
);

export default React.memo(MarketplaceOfferBookingItem);
