import React from 'react';

import MarketplaceActivityDialogCSSOnly, {
  Props as MarketplaceActivityDialogCSSOnlyProps,
} from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceActivityDialogCSSOnlyCss from '!!raw-loader!./MarketplaceActivityDialogCSSOnly.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { offerFactory } from '#libs/offer/factories';
import { Offer } from '#libs/offer/types';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

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
): MarketplaceActivityDialogCSSOnlyProps => {
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
    width,
    onClickBook: () => {},
    onClickBookOption: () => {},
    onClose: () => {},
    open: true,
  };
};

export const MARKETPLACE_ACTIVITY_DIALOG_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_ACTIVITY_DIALOG,
    css: MarketplaceActivityDialogCSSOnlyCss,
    pages: [MarketplacePage.CALENDAR, MarketplacePage.WORKSHOP],
    defaultState: {},
    variations: activityVariationRegistry,
  };

export const MARKETPLACE_ACTIVITY_DIALOG_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return (
    // @ts-expect-error
    <MarketplaceActivityDialogCSSOnly {...componentProps} isCustomCssPreview />
  );
});
