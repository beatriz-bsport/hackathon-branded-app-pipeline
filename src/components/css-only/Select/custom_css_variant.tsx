import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Select, { Props as SelectProps } from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceSelectCss from './style.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import {
  CountryMetaData,
  CountryOption,
} from '#marketplacecomponents/@Payment/MarketplaceCollectPaymentMethod';
import { SelectOptionWithMetaData } from './Select.component';
import { LOCALE_LIST } from '#components/input/LocaleSelector.component';

const marketplaceSelectVariationRegistry = [
  {
    label: 'version',
    choices: [
      { label: 'passTypeFilter', value: 'passTypeFilter' },
      {
        label: 'subscriptionCountrySelect',
        value: 'subscriptionCountrySelect',
      },
    ],
    default: { label: 'passTypeFilter', value: 'passTypeFilter' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<SelectProps, 'placeholder' | 'options' | 'value' | 'onChange'> => {
  const versionSelected = variationsSelected?.version?.value as
    | 'passTypeFilter'
    | 'subscriptionCountrySelect';

  return {
    fullWidth: true,
    classes: {
      buttonContainer: null,
    },
    isClearable: versionSelected === 'passTypeFilter',
    renderListItem:
      versionSelected === 'subscriptionCountrySelect'
        ? (option: SelectOptionWithMetaData<CountryMetaData>) => (
            <CountryOption option={option} />
          )
        : null,
  };
};

export const MARKETPLACE_SELECT_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.MARKETPLACE_SELECT,
  css: MarketplaceSelectCss,
  pages: [MarketplacePage.COMMON],
  defaultState: {},
  variations: marketplaceSelectVariationRegistry,
};

export const MARKETPLACE_SELECT_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation(['marketing', 'marketplace']);
  const componentProps = { ...usePropsFromVariation(variationsSelected) };
  const [selectedOption, setSelectedOption] = useState<string>(null);

  const passFilterOptions = [
    {
      label: t('marketplace:pass.filters.type.paymentPack'),
      value: 'paymentPack',
    },
    {
      label: t('marketplace:pass.filters.type.privatePass'),
      value: 'privatePass',
    },
  ];

  const countryOptions = LOCALE_LIST.map((localeContainer) => {
    const [, country] = localeContainer.locale.split('_');

    return {
      label: t(`login:country.${country}`),
      value: country,
      metaData: {
        locale: localeContainer.locale,
        icon: localeContainer.icon,
      },
    };
  });

  const handleOnChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <Select
      onChange={handleOnChange}
      options={
        componentProps.renderListItem ? countryOptions : passFilterOptions
      }
      placeholder={t('marketing:customForm.field.select_placeholder')}
      value={selectedOption}
      {...componentProps}
    />
  );
});
