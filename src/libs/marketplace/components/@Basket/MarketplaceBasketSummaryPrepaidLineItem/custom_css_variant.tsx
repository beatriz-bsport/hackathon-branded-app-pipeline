import React from 'react';
import PrepaidLineListItemCssOnly, { Props } from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import PrepaidLineItemCSS from './styles.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import type { PrepaidLineExtraData } from '#libs/checkout/types';
import { prepaidLineFactory } from '#libs/checkout/factories';

const prepaidLine = prepaidLineFactory();

const marketplacePrepaidLineItemVariationRegistry = [
  {
    label: 'prepaidLineKind',
    choices: [
      { label: 'giftcardPrepaidLine', value: 'giftcard' },
      { label: 'internalAccountPrepaidLine', value: 'internalAccount' },
      { label: 'defaultPrepaidLine', value: 'none' },
    ],
    default: { label: 'giftcardPrepaidLine', value: 'giftcard' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Props => {
  const isGiftcardPrepaidLine =
    variationsSelected?.prepaidLineKind?.value === 'giftcard';

  const isInternalAccountPrepaidLine =
    variationsSelected?.prepaidLineKind?.value === 'internalAccount';

  let extraData: PrepaidLineExtraData = {};

  if (isGiftcardPrepaidLine) {
    extraData = { ...extraData, consumer_giftcard_id: 1234 };
  }
  if (isInternalAccountPrepaidLine) {
    extraData = { ...extraData, internal_account: 1234 };
  }

  return {
    prePaidLine: { ...prepaidLine, extra_data: extraData },
  };
};

export const MARKETPLACE_PREPAID_LINE_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PREPAID_LINE_ITEM,
    css: PrepaidLineItemCSS,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplacePrepaidLineItemVariationRegistry,
  };

export const MARKETPLACE_PREPAID_LINE_ITEM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  return <PrepaidLineListItemCssOnly {...componentProps} />;
});
