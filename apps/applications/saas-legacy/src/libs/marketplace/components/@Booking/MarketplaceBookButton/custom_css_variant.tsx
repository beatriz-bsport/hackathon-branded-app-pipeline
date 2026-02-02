import React from 'react';

import { DateTime } from 'luxon';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { offerFactory } from '#src/libs/offer/factories';
import { OfferREST } from '#src/libs/offer/types';
import { OffersGroup } from '#src/libs/group-offer/types';
// @ts-expect-error
import MarketplaceBookButtonCss from './MarketplaceBookButton.css?raw';
import MarketplaceBookButton, { Props as MarketplaceBookButtonProps } from '.';

const marketplaceBookingButtonVariationRegistry = [
  {
    label: 'isRegistered',
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
    label: 'isOfferFull',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isOfferAvailable',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isOfferNotAvailableYet',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isHidden',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const offer = offerFactory({
  withLevel: true,
  withCoach: true,
  withEstablishment: true,
  withMetaActivity: true,
  offerStatus: 'bookable',
});

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceBookButtonProps => {
  const isRegistered = variationsSelected?.isRegistered?.value === 'true';
  const isHidden = variationsSelected?.isHidden?.value === 'true';
  const isOfferInThePast =
    variationsSelected?.isOfferInThePast?.value === 'true';

  const isOfferFull = variationsSelected?.isOfferFull?.value === 'true';
  const isOfferAvailable =
    variationsSelected?.isOfferAvailable?.value === 'true';

  const isOfferNotAvailableYet =
    variationsSelected?.isOfferNotAvailableYet?.value === 'true';

  const metaActivity = offer.meta_activity;

  const metaActivityOverride = {
    ...metaActivity,
    ...(isOfferNotAvailableYet ? { first_booking_minutes_until: 1 } : {}),
  };
  const group = {} as OffersGroup;

  const dateStart = isOfferInThePast
    ? DateTime.now().minus({ months: 7 }).toISO()
    : offer.date_start;
  return {
    offer: {
      ...offer,
      date_start: dateStart,
      meta_activity: offer.meta_activity.id,
      full: isOfferFull,
      available: isOfferAvailable,
      coach: offer.coach.id,
      establishment: offer.establishment.id,
    } as OfferREST,
    isRegistered,
    isHidden,
    metaActivity: metaActivityOverride,
    group,
  };
};

export const MARKETPLACE_BOOKING_BUTTON_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_BUTTON,
    css: MarketplaceBookButtonCss,
    pages: [MarketplacePage.CALENDAR, MarketplacePage.WORKSHOP],
    defaultState: {},
    variations: marketplaceBookingButtonVariationRegistry,
  };

export const MARKETPLACE_BOOKING_BUTTON_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceBookButton {...componentProps} />;
});
