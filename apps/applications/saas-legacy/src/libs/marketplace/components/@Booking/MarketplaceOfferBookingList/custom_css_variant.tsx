import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

import themeFactoryBot from '#src/libs/theme/factories';

import { offerFactory } from '#src/libs/offer/factories';
import { levelFactory } from '#src/libs/level/factories';
import type { OfferWithSpotInformation } from '#src/libs/offer/types';
import { CompanyTheme } from '#src/libs/theme/types';
// @ts-expect-error
import MarketplaceOfferBookingListCss from './styles.css?raw';
import MarketplaceOfferBookingList, { Props } from '.';

const fakeCompanyTheme: CompanyTheme = themeFactoryBot.companyTheme.createOne();

const offer = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
  }),
  level: levelFactory(),
};

const offerWaitingList = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
    offerStatus: 'waitingList',
  }),
  level: levelFactory(),
};

const offerWithSpot = {
  ...offerFactory({
    withCoach: true,
    withEstablishment: true,
    withMetaActivity: true,
  }),
  spot_id: faker.number.int(),
  spot_information: {
    name: faker.word.noun(5),
    prefix: faker.word.noun(5),
    shape: faker.word.noun(5),
    fill: faker.word.noun(5),
    stroke: faker.word.noun(5),
    indexType: faker.number.int(),
  },
  level: levelFactory(),
};

const offers: OfferWithSpotInformation[] = [
  offer,
  offerWaitingList,
  offerWithSpot,
];

const marketplaceOfferBookingListRegistry = [
  {
    label: 'loading',
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
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<Props, 'getBookableStatus'> => {
  const isLoading = variationsSelected?.loading?.value === 'true';
  const hideCoach = variationsSelected?.hideCoach?.value === 'true';
  const mockedGetIsAddGuestDisabled = (offerId: number) => offerId && false;
  const getOfferWaitListPosition = (offerId: number) =>
    offerId && {
      id: faker.number.int(1000),
      waiting_list_position: {
        member_position: faker.number.int(10),
        waiting_list_size: 10,
        dynamic: 0,
      },
    };

  return {
    isLoading,
    offers,
    hideCoach,
    getGuestNameFromQueryParams: () => '',
    getOfferStatus: () => null,
    getIsAddGuestDisabled: mockedGetIsAddGuestDisabled,
    onOpenAddGuestModal: () => {},
    companyTheme: fakeCompanyTheme,
    getOfferWaitListPosition,
  };
};

export const MARKETPLACE_OFFER_BOOKING_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_OFFER_BOOKING_LIST,
    css: MarketplaceOfferBookingListCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: marketplaceOfferBookingListRegistry,
  };

export const MARKETPLACE_OFFER_BOOKING_LIST_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation('widget');
  const componentProps = usePropsFromVariation(variationsSelected);
  const mockedGetBookableStatus = (offerId: number) =>
    offerId && OFFER_BOOKABLE_STATUS_BOOKABLE;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.marketplaceOfferBookingList', {
          component_name: t('widget.components.marketplace_booking_item'),
        })}
      </Alert>
      <MarketplaceOfferBookingList
        {...componentProps}
        getBookableStatus={mockedGetBookableStatus}
      />
    </div>
  );
});
