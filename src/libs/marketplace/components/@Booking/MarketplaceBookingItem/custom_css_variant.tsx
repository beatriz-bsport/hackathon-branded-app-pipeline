import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import MarketplaceBookingItem, { Props } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceBookingItemCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import themeFactoryBot from '#libs/theme/factories';
import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { coachFactory } from '#libs/associated-coach/factories';
import { levelFactory } from '#libs/level/factories';

import type { CompanyTheme } from '#libs/theme/types';
import type { Establishment } from '#libs/establishment/types';
import type { Level } from '#libs/level/types';
import type { Coach } from '#libs/associated-coach/types';
import { generateRandomName } from '#utils/factories';

const fakeCompanyTheme: CompanyTheme = themeFactoryBot.companyTheme.createOne();

const fakeEstablishment: Establishment =
  establishmentFactoryBot.Establishment.createOne();

const fakeCoach: Coach = coachFactory();

const fakeLevel: Partial<Level> = levelFactory();

const title = generateRandomName(faker);

const date = 'Wed 02 Aug • 09:30 AM - 10:30 AM';

const guestName = generateRandomName(faker);

const marketplaceBookingItemVariationRegistry = [
  {
    label: 'hideCoach',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
  {
    label: 'shouldDisplayAddGuestButton',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
  {
    label: 'isWaitingList',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
  {
    label: 'displayGuestName',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
  {
    label: 'withLevel',
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
    default: {
      label: 'false',
      value: 'false',
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Props => {
  const hideCoach = variationsSelected?.hideCoach?.value === 'true';
  const shouldDisplayAddGuestButton =
    variationsSelected?.shouldDisplayAddGuestButton?.value === 'true';
  const isWaitingList = variationsSelected?.isWaitingList?.value === 'true';
  const displayGuestName =
    variationsSelected?.displayGuestName?.value === 'true';
  const withLevel = variationsSelected?.withLevel?.value === 'true';

  return {
    hideCoach,
    shouldDisplayAddGuestButton,
    isWaitingList,
    establishment: fakeEstablishment,
    coach: fakeCoach,
    level: withLevel && (fakeLevel as Level),
    companyTheme: fakeCompanyTheme,
    title,
    date,
    guestName: displayGuestName && guestName,
  };
};

export const MARKETPLACE_BOOKING_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_BOOKING_ITEM,
    css: MarketplaceBookingItemCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: marketplaceBookingItemVariationRegistry,
  };

export const MARKETPLACE_BOOKING_ITEM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ width: '100%' }}>
      <MarketplaceBookingItem {...componentProps} />
    </div>
  );
});
