import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { establishment_factory } from '#libs/establishment/factory';
import { coachesFactory } from '#libs/associated-coach/factories';
import { levelListFactory } from '#libs/level/factories';
import { meta_activity_factory } from '#libs/meta-activity/factory';
import { getGroupedEstablishmentOptions } from '#libs/establishment/components/EstablishmentSelector.component';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceFilterCss from './MarketplaceFilter.css?raw';
import MarketplaceFilter, { Props as MarketplaceFilterProps } from '.';

const marketplaceFilterVariationRegistry = [
  {
    label: 'variant',
    choices: [
      { label: 'level', value: 'level' },
      { label: 'coach', value: 'coach' },
      { label: 'establishment', value: 'establishment' },
      { label: 'activityName', value: 'metaActivity' },
    ],
    default: { label: 'level', value: 'level' },
  },
];

const establishmentList = establishment_factory(10);
const coachList = coachesFactory(10);
const levelList = levelListFactory(10);
const metaActivityList = meta_activity_factory(5, false, true);

const levelsOptions = levelList.map((level) => ({
  value: level.id,
  label: level.name,
  levelColor: level.color,
}));

const coachesOptions = coachList.map((coach) => ({
  value: coach.id,
  label: coach.name,
}));

const establishmentsOptions = getGroupedEstablishmentOptions([
  ...(establishmentList || []),
]).map((option) => {
  return { ...option, icon: true };
});

const metaActivitiesOption = metaActivityList
  .filter((metaActivity) => metaActivity.customer_enabled)
  .map((metaActivity) => ({
    label: metaActivity.name,
    value: metaActivity.id,
  }));

const availableOptions = {
  level: levelsOptions,
  coach: coachesOptions,
  establishment: establishmentsOptions,
  metaActivity: metaActivitiesOption,
};

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<MarketplaceFilterProps, 'text' | 'selectedOptions' | 'onSelect'> => {
  const variantSelected = variationsSelected?.variant?.value as
    | 'level'
    | 'coach'
    | 'establishment'
    | 'metaActivity';

  return {
    options: availableOptions[variantSelected],
    levelVariant: variantSelected === 'level',
  };
};

export const MARKETPLACE_FILTER_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.MARKETPLACE_FILTER,
  css: MarketplaceFilterCss,
  pages: [MarketplacePage.COMMON],
  defaultState: {},
  variations: marketplaceFilterVariationRegistry,
};

export const MARKETPLACE_FILTER_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation('marketing');
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectOptions = (selectedOptionValues: number[]) => {
    const selectedValues = componentProps.options
      .map((option: { label: string; value: number }) =>
        option.value && selectedOptionValues.includes(option.value)
          ? option.value
          : false,
      )
      .filter((option) => !!option);
    setSelectedOptions(selectedValues);
  };

  return (
    <MarketplaceFilter
      onSelect={handleSelectOptions}
      selectedOptions={selectedOptions}
      text={t('marketing:customForm.field.select_placeholder')}
      {...componentProps}
    />
  );
});
