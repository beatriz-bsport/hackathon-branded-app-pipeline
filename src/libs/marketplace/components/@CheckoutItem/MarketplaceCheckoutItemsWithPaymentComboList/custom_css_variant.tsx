import React from 'react';

import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import MarketplaceCheckoutItemsWithPrivatePassList, { Props } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceCheckoutItemsWithPrivatePassListCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { checkoutItemsFactory } from '#libs/checkout/factories';
import { BuyableItemOptions, CheckoutItem } from '#libs/checkout/types';
import { paymentComboListFactory } from '#libs/payment-combo/factory';

const checkoutPaymentComboItems: CheckoutItem[] = checkoutItemsFactory(
  3,
  BuyableItemOptions.BUYABLE_ITEM_COMBO_ITEM,
);

const paymentCombos = paymentComboListFactory(3);

const paymentComboById = checkoutPaymentComboItems
  .map((checkoutItem, index) => ({
    [checkoutItem.buyable_item_id]: paymentCombos[index],
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
    items: checkoutPaymentComboItems,
    paymentComboById,
  };
};

export const MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST,
    css: MarketplaceCheckoutItemsWithPrivatePassListCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: minimalPrivatePassCardRegistry,
  };

export const MARKETPLACE_CHECKOUT_ITEMS_PAYMENT_COMBO_LIST_PREVIEW: React.FC<{
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
        {t('widget.cssConfig.marketplaceCheckoutItemListPaymentCombo', {
          component_name: t('widget.components.minimal_payment_combo_card'),
          page: t('widget.page.pass'),
        })}
      </Alert>
      <MarketplaceCheckoutItemsWithPrivatePassList {...componentProps} />
    </div>
  );
});
