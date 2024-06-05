import React from 'react';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import { CompanyTheme } from '#libs/theme/types';
import { offerFactory } from '#libs/offer/factories';
import { Offer } from '#libs/offer/types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceActivityCSSOnlyCss from './MarketplaceActivity.css?raw';
import MarketplaceActivityCSSOnly, {
  Props as MarketplaceActivityCSSOnlyProps,
} from '.';

const activityVariationRegistry = [
  {
    label: 'hideCoach',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'width',
    choices: [
      { label: 'mobile', value: 'mobile' },
      { label: 'desktop', value: 'desktop' },
    ],
    default: { label: 'mobile', value: 'mobile' },
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
  theme: CompanyTheme,
): MarketplaceActivityCSSOnlyProps => {
  const hideCoachSelected = variationsSelected?.hideCoach?.value === 'true';
  const metaActivities = { [offer.meta_activity.id]: offer.meta_activity };
  const establishments = [offer.establishment];
  const customLevels = [offer.custom_level];
  const coaches = [offer.coach];
  const group = {};

  const width = variationsSelected?.width?.value === 'mobile' ? 'xs' : 'lg';
  return {
    offer: {
      ...offer,
      meta_activity: offer.meta_activity.id,
      coach: offer.coach.id,
      establishment: offer.establishment.id,
    } as Offer,
    hideCoach: hideCoachSelected,
    metaActivities,
    establishments,
    customLevels,
    coaches,
    group,
    companyTheme: theme,
    coachDisplay: theme?.coach_display,
    width,
    onClickBook: () => {},
    onClickBookOption: () => {},
    onClose: () => {},
  };
};

export const MARKETPLACE_ACTIVITY_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_ACTIVITY,
    css: MarketplaceActivityCSSOnlyCss,
    pages: [MarketplacePage.CALENDAR, MarketplacePage.WORKSHOP],
    defaultState: {},
    variations: activityVariationRegistry,
  };

export const MARKETPLACE_ACTIVITY_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplaceActivityCSSOnly {...componentProps} />;
});
