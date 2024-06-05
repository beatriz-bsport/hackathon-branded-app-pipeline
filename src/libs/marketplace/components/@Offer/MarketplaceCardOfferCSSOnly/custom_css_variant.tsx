import React from 'react';
import { DateTime } from 'luxon';
import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { offerFactory } from '#libs/offer/factories';
import { formatAsDate } from '#src/utils/datetime';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceCardOfferCss from './MarketplaceCardOfferCSSOnly.css?raw';
import MarketPlaceCardOfferCSSOnly, {
  Props as MarketplaceOfferCardProps,
} from './MarketPlaceCardOfferCSSOnly.component';

const offerCardVariationRegistry = [
  {
    label: 'variant',
    choices: [
      { label: 'activityName', value: 'activityName' },
      { label: 'time', value: 'time' },
      { label: 'coach', value: 'coach' },
    ],
    default: { label: 'activityName', value: 'activityName' },
  },
  {
    label: 'isRegistered',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isBookingDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isOfferInThePast',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'offerStatus',
    choices: [
      {
        label: 'bookable',
        value: 'bookable',
      },
      {
        label: 'waitingList',
        value: 'waitingList',
      },
      {
        label: 'cancel',
        value: 'cancel',
      },
      {
        label: 'past',
        value: 'past',
      },
      {
        label: 'future',
        value: 'future',
      },
    ],
    default: { label: 'bookable', value: 'bookable' },
  },
];

const bookableOffer = offerFactory({
  withLevel: true,
  withCoach: true,
  withEstablishment: true,
  withMetaActivity: true,
  offerStatus: 'bookable',
});
/*
Each component hook used to inject props must be type safe to ensure that 
any modification of component (additional props, removed props, props changed)
must throw a Typescript Error.
*/
const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<
  MarketplaceOfferCardProps,
  'theme' | 'showOfferFilling' | 'hideCoach' | 'showOfferGender'
> => {
  // TODO : would be nice to have better type inheritance.
  const variantSelected = variationsSelected?.variant?.value as
    | 'activityName'
    | 'time'
    | 'coach';

  const isRegisteredSelected =
    variationsSelected?.isRegistered?.value === 'true';

  const isBookingDisabledSelected =
    variationsSelected?.isBookingDisabled?.value === 'true';

  const isOfferInThePastSelected =
    variationsSelected?.isOfferInThePast?.value === 'true';

  // Let's avoid including the factory is a React.useMemo here, leading to ugly
  // changes and renders everytime a settings is changed.
  const offerStatusSelected = variationsSelected?.offerStatus?.value;

  const offer = React.useMemo(() => {
    if (offerStatusSelected === 'waitingList') {
      return {
        ...bookableOffer,
        is_full: true,
        full: true,
      };
    }

    if (offerStatusSelected === 'past') {
      return {
        ...bookableOffer,
        date_start: formatAsDate(
          DateTime.now().minus({ weeks: 1 }).toISODate(),
        ),
      };
    }

    if (offerStatusSelected === 'cancel') {
      return {
        ...bookableOffer,
        is_full: true,
        available: false,
      };
    }

    if (offerStatusSelected === 'future') {
      const metaActivity = bookableOffer.meta_activity;

      return {
        ...bookableOffer,
        date_start: formatAsDate(DateTime.now().plus({ years: 1 }).toISODate()),
        // TODO WAIT FOR FIX ON OFFER FOR THIS TO ACTUALLY WORK.
        meta_activity: { ...metaActivity, first_booking_minutes_until: 1 },
      };
    }
    return bookableOffer;
  }, [offerStatusSelected]);

  const coach = bookableOffer.coach;
  const establishment = bookableOffer.establishment;
  const meta_activity = bookableOffer.meta_activity;

  return {
    offer: {
      ...offer,
      coach: coach.id,
      establishment: establishment.id,
      meta_activity: meta_activity.id,
    },
    coaches: [coach],
    establishments: [establishment],
    metaActivities: { [meta_activity.id]: bookableOffer.meta_activity },
    isBookingDisabled: isBookingDisabledSelected,
    isOfferPassed: isOfferInThePastSelected,
    getLevel: { [bookableOffer.id]: bookableOffer.level },
    variant: variantSelected,
    isRegistered: isRegisteredSelected,
    genderCount: {
      nb_booked_male: faker.number.int(10),
      nb_booked_female: faker.number.int(10),
      nb_booked_other: faker.number.int(10),
    },
    onClickBook: () => {},
    onClickOffer: () => {},
  };
};

export const MARKETPLACE_OFFER_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_OFFER_CARD,
    css: MarketplaceCardOfferCss,
    pages: [MarketplacePage.CALENDAR],
    defaultState: {},
    variations: offerCardVariationRegistry,
  };

export const MARKETPLACE_OFFER_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <MarketPlaceCardOfferCSSOnly
      hideCoach={theme.hideCoach}
      showOfferFilling={theme.show_offers_filling}
      showOfferGender={theme.show_booked_gender_offer}
      theme={theme}
      {...componentProps}
    />
  );
});

export default MarketPlaceCardOfferCSSOnly;
