import React from 'react';

import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { BuyableItemOptions } from '#libs/checkout/types';
import { checkoutItemsFactory } from '#libs/checkout/factories';
// @ts-expect-error
import MarketplaceProductItemListCss from './styles.css?raw';
import MarketplaceProductItemList, { Props } from '.';

const items = checkoutItemsFactory(4, {
  buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM,
});

const marketplaceProductItemListVariationRegistry = [
  {
    label: 'loading',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: {
      label: 'false',
      value: 'false',
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Props => {
  const isLoading = variationsSelected?.loading?.value === 'true';
  return {
    isLoading,
    items,
  };
};

export const MARKETPLACE_PRODUCT_ITEM_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PRODUCT_ITEM_LIST,
    css: MarketplaceProductItemListCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: marketplaceProductItemListVariationRegistry,
  };

export const MARKETPLACE_PRODUCT_ITEM_LIST_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const { t } = useTranslation('widget');
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.marketplaceProductItemListAlert', {
          component_name: t('widget.components.marketplace_product_item'),
        })}
      </Alert>
      <MarketplaceProductItemList {...componentProps} />
    </div>
  );
});
