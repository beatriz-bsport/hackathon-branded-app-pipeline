import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { prepaidLinesFactory } from '#libs/checkout/factories';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import PrepaidLineListCSS from './styles.css?raw';
import MarketplaceBasketSummaryPrepaidLineList, { Props } from '.';

const prepaidLines = prepaidLinesFactory(3);

const marketplacePrepaidLineListVariationRegistry = [
  {
    label: 'isDense',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Props => {
  const dense = variationsSelected?.isDense?.value === 'true';

  return {
    prePaidLines: prepaidLines,
    dense,
  };
};

export const MARKETPLACE_PREPAID_LINE_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PREPAID_LINE_LIST,
    css: PrepaidLineListCSS,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplacePrepaidLineListVariationRegistry,
  };

export const MARKETPLACE_PREPAID_LINE_LIST_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return <MarketplaceBasketSummaryPrepaidLineList {...componentProps} />;
});
