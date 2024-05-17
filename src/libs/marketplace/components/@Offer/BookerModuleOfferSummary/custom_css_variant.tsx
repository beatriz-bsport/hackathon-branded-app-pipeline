import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import {
  OFFER_BOOKABLE_STATUS_BOOKABLE,
  OFFER_BOOKABLE_STATUS_FULL,
} from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/src/master-data/error-codes/buyable-item-can-not-be-bought';
import BookerModuleOfferSummary, {
  Props as BookerModuleOfferSummaryProps,
} from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import BookerModuleOfferSummaryCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import { offerFactory } from '#libs/offer/factories';

import type { CompanyTheme } from '#libs/theme/types';
import {
  type MarketplaceCSSComponentConfig,
  MarketplacePage,
  type VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { OfferStatus, Offer_FULL } from '#libs/offer/types';

const TAX = 21;

const bookerModuleVariationRegistry = [
  {
    label: 'offerStatus',
    choices: [
      {
        label: 'bookable',
        value: 'bookable',
      },
      {
        label: 'isWaitingListOpen',
        value: 'isWaitingListOpen',
      },
      {
        label: 'isWaitingListFull',
        value: 'isWaitingListFull',
      },
    ],
    default: { label: 'bookable', value: 'bookable' },
  },
  {
    label: 'showSpot',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showPrice',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showCredit',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'noStyledContainer',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showEstablishmentAddress',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: { label: 'true', value: 'true' },
  },
];

const offerStatuses: { [key: string]: OfferStatus } = {
  bookable: {
    id: 1,
    offer_status: 0,
    bookable_status: OFFER_BOOKABLE_STATUS_BOOKABLE,
    waiting_list_status: null,
    taken_spots: [] as number[],
    blocked_by_tags: false,
    is_registered: false,
  },
  isWaitingListOpen: {
    id: 2,
    offer_status: 2,
    bookable_status: OFFER_BOOKABLE_STATUS_FULL,
    waiting_list_status: OFFER_WAITING_LIST_STATUS_OPEN,
    taken_spots: [] as number[],
    blocked_by_tags: false,
    is_registered: false,
  },
  isWaitingListFull: {
    id: 3,
    offer_status: 3,
    bookable_status: OFFER_BOOKABLE_STATUS_FULL,
    waiting_list_status: OFFER_WAITING_LIST_STATUS_FULL,
    taken_spots: [] as number[],
    blocked_by_tags: false,
    is_registered: false,
  },
};

const bookableOffer: Offer_FULL = offerFactory({
  withLevel: true,
  withCoach: true,
  withEstablishment: true,
  withMetaActivity: true,
});

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  theme: CompanyTheme,
): BookerModuleOfferSummaryProps => {
  const offer = {
    ...bookableOffer,
    full: variationsSelected?.offerStatus?.value !== 'bookable',
  };
  const coach = offer.coach;
  const metaActivity = offer.meta_activity;
  const establishment = offer.establishment;
  const spotId =
    variationsSelected?.showSpot?.value === 'true'
      ? faker.number.int(10).toString()
      : null;
  const price =
    variationsSelected?.showPrice?.value === 'true'
      ? faker.number.int(150)
      : null;
  const tax = variationsSelected?.showPrice?.value === 'true' ? TAX : null;
  const showCredits = variationsSelected?.showCredit?.value === 'true';
  const noStyledContainer =
    variationsSelected?.noStyledContainer?.value === 'true';
  const showEstablishmentAddress =
    variationsSelected?.showEstablishmentAddress?.value === 'true';

  const offerStatus = offerStatuses[variationsSelected?.offerStatus?.value];

  return {
    coach,
    establishment,
    metaActivity,
    offer,
    spotId,
    price,
    tax,
    companyTheme: theme,
    offerStatus,
    showEstablishmentAddress,
    showCredits,
    noStyledContainer,
    onConfirm: () => {},
  };
};

export const MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.BOOKER_MODULE_OFFER_SUMMARY,
    css: BookerModuleOfferSummaryCss,
    pages: [MarketplacePage.BOOKING_PAGE],
    defaultState: {},
    variations: bookerModuleVariationRegistry,
  };

export const MARKETPLACE_BOOKER_MODULE_OFFER_SUMMARY_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <BookerModuleOfferSummary {...componentProps} />;
});
