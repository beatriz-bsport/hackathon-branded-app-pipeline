import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import MarketplaceOfferListItemCSSOnly, {
  Props as MarketplaceOfferListItemCSSOnlyProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import OfferListItemCss from '!!raw-loader!./MarketplaceOfferListItemCSSOnly.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { establishment_factory } from '#libs/establishment/factory';
import { coachesFactory } from '#libs/associated-coach/factories';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { offerFactory } from '#libs/offer/factory';
import { Coach } from '#libs/associated-coach/types';

const contractCardVariationRegistry = [
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
    label: 'isWorkshop',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'showDate',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'withoutBookButton',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const metaActivity = meta_activity_factory(1)[0];
const establishment = establishment_factory(1)[0];
const coach = coachesFactory(1)[0];

const bookableOffer = offerFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceOfferListItemCSSOnlyProps => {
  const variantSelected = variationsSelected?.variant?.value as
    | 'activityName'
    | 'time'
    | 'coach';

  const isRegisteredSelected =
    variationsSelected?.isRegistered?.value === 'true';

  const isWorkshopSelected = variationsSelected?.isWorkshop?.value === 'true';

  const showDateSelected = variationsSelected?.showDate?.value === 'true';

  const withoutBookButtonSelected =
    variationsSelected?.withoutBookButton?.value === 'true';

  return {
    showOfferFilling: false,
    // @ts-expect-error
    offer: bookableOffer,
    genderCount: {
      nb_booked_male: faker.number.int(10),
      nb_booked_female: faker.number.int(10),
      nb_booked_other: faker.number.int(10),
    },
    metaActivity,
    variant: variantSelected,
    establishment,
    coach: coach as Coach,
    withoutCTA: false,
    isRegistered: isRegisteredSelected,
    getLevel: {},
    isBookingDisabled: false,
    isWorkshop: isWorkshopSelected,
    showDate: showDateSelected,
    withoutBookButton: withoutBookButtonSelected,
    isOfferPassed: false,
    position: ['first'],
    onClick: () => {},
    onBook: () => {},
  };
};

export const MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'offerListItem',
    css: OfferListItemCss,
    pages: [MarketplacePage.CALENDAR],
    defaultState: {},
    variations: contractCardVariationRegistry,
  };

export const MARKETPLACE_OFFER_LIST_ITEM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  return (
    <MarketplaceOfferListItemCSSOnly
      hideCoach={theme.hideCoach}
      showOfferFilling={theme.show_offers_filling}
      showOfferGender={theme.show_booked_gender_offer}
      theme={theme}
      {...componentProps}
    />
  );
});
