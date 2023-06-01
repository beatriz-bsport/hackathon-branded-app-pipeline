import React from 'react';
import MarketPlaceCardOfferCSSOnly from './MarketPlaceCardOfferCSSOnly.component';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceCardOfferCss from '!!raw-loader!./MarketplaceCardOfferCSSOnly.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import {
  defaultisRegisteredVariation,
  defaultOfferVariation,
  defaultVariantVariation,
  isRegisteredVariation,
  offerVariation,
  variantVariation,
} from '#libs/exportable-components/CssComponentVariations';

export const MARKETPLACE_OFFER_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'cardOffer',
    css: MarketplaceCardOfferCss,
    pages: [MarketplacePage.CALENDAR],
    defaultState: {},
    variations: [variantVariation, offerVariation, isRegisteredVariation],
    defaultVariation: [
      defaultVariantVariation,
      defaultOfferVariation,
      defaultisRegisteredVariation,
    ],
  };

export const MARKETPLACE_OFFER_CARD_PREVIEW = ({
  theme,
  ...variation
}: {
  theme: CompanyTheme;
}) => {
  return (
    <MarketPlaceCardOfferCSSOnly
      theme={theme}
      showOfferFilling={theme.show_offers_filling}
      hideCoach={theme.hideCoach}
      showOfferGender={theme.show_booked_gender_offer}
      coaches={[]}
      establishments={[]}
      getLevel={{}}
      isBookingDisabled={false}
      onClickBook={() => {}}
      onClickOffer={() => {}}
      onClickBookOption={() => {}}
      offer={null}
      genderCount={{}}
      isRegistered={false}
      metaActivities={[]}
      {...variation}
    />
  );
};

export default MarketPlaceCardOfferCSSOnly;
