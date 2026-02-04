import React from 'react';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';
import {
  establishmentGroup_factory,
  establishment_factory,
} from '#src/libs/establishment/factory';
import { coachesFactory } from '#src/libs/associated-coach/factories';
import { levelListFactory } from '#src/libs/level/factories';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Coach } from '#src/libs/associated-coach/types';
import { Level } from '#src/libs/level/types';
// @ts-expect-error
import MarketplaceFilterCss from './MarketplaceFilterCSSOnly.css?raw';
import MarketplaceFilterCSSOnly, {
  Props as MarketplaceFilterCSSOnlyProps,
} from '.';

const contractCardVariationRegistry = [
  {
    label: 'variant',
    choices: [
      { label: 'activity', value: 'activity' },
      { label: 'workshop', value: 'workshop' },
    ],
    default: { label: 'activity', value: 'activity' },
  },
  {
    label: 'hideCoach',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const establishmentList = establishment_factory(5);
const establishmentGroupList = establishmentGroup_factory(5, true);
const coachList = coachesFactory(5);
const levelList = levelListFactory(5);
const metaActivityList = meta_activity_factory(5, false, true).reduce<{
  [key: number]: MetaActivity;
}>(
  (acc, metaActivity) => ({
    ...acc,
    [metaActivity.id]: metaActivity,
  }),
  {},
);

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<MarketplaceFilterCSSOnlyProps, 'showMultiLocalization' | 'theme'> => {
  const variantSelected = variationsSelected?.variant?.value as
    | 'activity'
    | 'workshop';

  const hideCoachSelected = variationsSelected?.hideCoach?.value === 'true';

  return {
    coaches: coachList as Coach[],
    hideCoach: hideCoachSelected,
    establishments: establishmentList,
    establishmentGroupList,
    metaActivities: metaActivityList,
    customLevels: levelList as Level[],
    filters: {
      coaches: [],
      establishments: [],
      levels: [],
      activity__in: [],
      establishment_group__in: [],
    },
    variant: variantSelected,
    setFilters: () => () => {},
    onSearch: () => {},
    onClearInput: () => {},
  };
};

export const MARKETPLACE_CALENDAR_FILTER_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CALENDAR_FILTER,
    css: MarketplaceFilterCss,
    pages: [MarketplacePage.CALENDAR],
    defaultState: {},
    variations: contractCardVariationRegistry,
  };

export const MARKETPLACE_CALENDAR_FILTER_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const showMultiLocalization = theme.enable_multi_localization;
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  return (
    <MarketplaceFilterCSSOnly
      {...componentProps}
      showMultiLocalization={showMultiLocalization}
    />
  );
});
