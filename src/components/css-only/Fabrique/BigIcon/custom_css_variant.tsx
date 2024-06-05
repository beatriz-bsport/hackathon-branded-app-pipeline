import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import BigIcon from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import BigIconCss from './styles.css?raw';
import { BigIconEnum } from './constants';
import type { BigIconVariantType } from './types';

const BigIconVariationRegistry = [
  {
    label: 'fabriqueVariant',
    choices: [
      { label: BigIconEnum.SUCCESS, value: BigIconEnum.SUCCESS },
      { label: BigIconEnum.INFO, value: BigIconEnum.INFO },
      { label: BigIconEnum.WARNING, value: BigIconEnum.WARNING },
      { label: BigIconEnum.ERROR, value: BigIconEnum.ERROR },
      { label: BigIconEnum.GREY, value: BigIconEnum.GREY },
    ],
    default: {
      label: BigIconEnum.SUCCESS,
      value: BigIconEnum.SUCCESS,
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): React.ComponentProps<typeof BigIcon> => {
  const variant =
    (variationsSelected?.fabriqueVariant?.value as BigIconVariantType) ??
    BigIconEnum.SUCCESS;
  return { variant };
};

export const FABRIQUE_BIGICON_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_BIGICON,
  css: BigIconCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: BigIconVariationRegistry,
};

export const FABRIQUE_BIGICON_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div>
      <BigIcon {...componentProps} />
    </div>
  );
});
