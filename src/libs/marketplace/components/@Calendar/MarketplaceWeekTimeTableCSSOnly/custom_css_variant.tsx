import React from 'react';
import moment from 'moment-timezone';
import { fakerEN as faker } from '@faker-js/faker';

import MarketplaceWeekTimeTableCSSOnly, {
  Props as MarketplaceWeekTimeTableCSSOnlyProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import WeekTimeTableCss from '!!raw-loader!./MarketplaceWeekTimeTableCSSOnly.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { establishment_factory } from '#libs/establishment/factory';
import { coachesFactory } from '#libs/associated-coach/factories';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { Coach } from '#libs/associated-coach/types';

const establishments = establishment_factory(5);
const coaches = coachesFactory(5);
const metaActivityList = meta_activity_factory(5, false, true);

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<MarketplaceWeekTimeTableCSSOnlyProps, 'theme' | 't' | 'hideCoach'> => {
  const variantSelected = variationsSelected?.variant?.value as
    | 'activityName'
    | 'coach'
    | 'time';

  return {
    variant: variantSelected,
    offers: [],
    genderCount: {
      nb_booked_male: faker.number.int(10),
      nb_booked_female: faker.number.int(10),
      nb_booked_other: faker.number.int(10),
    },
    establishments,
    metaActivities: metaActivityList,
    coaches: coaches as Coach[],
    date: moment().format(),
    bookedOffers: [],
    showOfferGender: false,
    isCompact: false,
    isLarge: false,
    showDayParts: false,
    forceDayDisplayOnly: false,
    searchedOffers: null,
    onClickOffer: () => {},
    onClickBook: () => {},
    onClickBookOption: () => {},
    onSelectDate: () => {},
    getLevel: {},
    loading: false,
    activityLoading: false,
    showOfferFilling: false,
    establishmentLoading: false,
    coachLoading: false,
    group: {},
  };
};

export const MARKETPLACE_WEEK_TIME_TABLE_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_WEEK_TIME_TABLE,
    css: WeekTimeTableCss,
    pages: [MarketplacePage.CALENDAR],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_WEEK_TIME_TABLE_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <MarketplaceWeekTimeTableCSSOnly
      showOfferFilling={theme.show_offers_filling}
      showOfferGender={theme.show_booked_gender_offer}
      {...componentProps}
    />
  );
});
