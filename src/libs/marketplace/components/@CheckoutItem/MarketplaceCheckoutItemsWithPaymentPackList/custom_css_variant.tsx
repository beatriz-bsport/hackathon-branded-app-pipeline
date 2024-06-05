import React from 'react';

import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { checkoutItemsFactory } from '#libs/checkout/factories';
import { BuyableItemOptions, CheckoutItem } from '#libs/checkout/types';
import { paymentPackListFactory } from '#libs/payment-packs/factory';
// @ts-expect-error
import MarketplaceCheckoutItemsWithPaymentPackListCss from './styles.css?raw';
import MarketplaceCheckoutItemsWithPaymentPackList, { type Props } from '.';

const checkoutPaymentPackItems: CheckoutItem[] = checkoutItemsFactory(3, {
  buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_PASS,
});

const paymentPacks = paymentPackListFactory(3);

const paymentPacksById = checkoutPaymentPackItems
  .map((checkoutItem, index) => ({
    [checkoutItem.buyable_item_id]: paymentPacks[index],
  }))
  .reduce((acc, curr) => ({ ...acc, ...curr }), {});

const minimalPrivatePassCardRegistry = [
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
    items: checkoutPaymentPackItems,
    paymentPacksById,
  };
};

export const MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST,
    css: MarketplaceCheckoutItemsWithPaymentPackListCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: minimalPrivatePassCardRegistry,
  };

export const MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_PACK_LIST_LIST_PREVIEW: React.FC<{
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
        {t('widget.cssConfig.marketplaceCheckoutItemListPaymentPack', {
          component_name: t('widget.components.minimal_payment_pack_card'),
          page: t('widget.page.pass'),
        })}
      </Alert>
      <MarketplaceCheckoutItemsWithPaymentPackList {...componentProps} />
    </div>
  );
});
