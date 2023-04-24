// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import ClickableItem, { Props } from '#components/css-only/ClickableItem';
import { PaymentPackStorybookFactory } from '#libs/payment-packs/factory';
import { PaymentPack } from '#libs/payment-packs/types';
import {
  getSearchItemIndicator,
  getSearchItemPrice,
  ItemType,
} from '#components/css-only/Search/PassSearch/utils';

const paymentPack: Partial<PaymentPack> = PaymentPackStorybookFactory();
const showPaymentPackDetail = (_id: number) => {};
const addPaymentPackToBasket = (_id: number) => {};

export const PassClickableItem = (args: Props) => {
  const { t } = useTranslation([
    'paymentPack',
    'notificationRule',
    'platformBilling',
  ]);

  return (
    <ClickableItem
      secondary={getSearchItemIndicator(
        { item: paymentPack, itemType: ItemType.PAYMENT_PACK },
        t,
      )}
      tertiary={getSearchItemPrice(
        { item: paymentPack, itemType: ItemType.PAYMENT_PACK },
        t,
      )}
      onClick={() => showPaymentPackDetail(paymentPack.id)}
      onActionClick={() => addPaymentPackToBasket(paymentPack.id)}
      {...args}
    />
  );
};
PassClickableItem.args = {
  primary: paymentPack.name,
  actionIcon: <ShoppingCartIcon className="bs-search__item__icon" />,
};

export default {
  title: 'Components/CssOnly/ClickableItem',
  component: ClickableItem,
  argTypes: {
    onClick: { action: 'onClick' },
    onActionClick: { actions: 'onActionClick' },
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      page: null,
    },
  },
};
