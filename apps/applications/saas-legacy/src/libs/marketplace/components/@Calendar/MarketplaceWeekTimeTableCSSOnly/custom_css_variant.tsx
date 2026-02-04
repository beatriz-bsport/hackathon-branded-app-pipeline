import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { establishment_factory } from '#src/libs/establishment/factory';
import { coachesFactory } from '#src/libs/associated-coach/factories';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { Coach } from '#src/libs/associated-coach/types';
// @ts-expect-error
import WeekTimeTableCss from './MarketplaceWeekTimeTableCSSOnly.css?raw';

import MarketplaceWeekTimeTableCSSOnly, {
  Props as MarketplaceWeekTimeTableCSSOnlyProps,
} from '.';

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
    offersByDay: {},
    isSearching: false,
    genderCount: {
      nb_booked_male: faker.number.int(10),
      nb_booked_female: faker.number.int(10),
      nb_booked_other: faker.number.int(10),
    },
    establishments,
    metaActivities: metaActivityList,
    coaches: coaches as Coach[],
    date: DateTime.now(),
    bookedOffers: [],
    showOfferGender: false,
    isCardModeDisplay: true,
    showDayParts: false,
    forceDayDisplayOnly: false,
    onClickOffer: () => {},
    onClickBook: () => {},
    onSelectDate: () => {},
    getLevel: {},
    loading: false,
    showOfferFilling: false,
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
      hideCoach={false}
      showOfferFilling={theme.show_offers_filling}
      showOfferGender={theme.show_booked_gender_offer}
      theme={theme}
      {...componentProps}
    />
  );
});
