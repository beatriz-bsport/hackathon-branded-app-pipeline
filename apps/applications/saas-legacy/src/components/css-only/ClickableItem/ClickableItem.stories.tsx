import React from 'react';
import { useTranslation } from 'react-i18next';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import {
  Props,
  ClickableItemForStorybook,
} from '#src/components/css-only/ClickableItem';
// @ts-expect-error
import { PaymentPackStorybookFactory } from '#src/libs/payment-packs/factory';
import { PaymentPack } from '#src/libs/payment-packs/types';
import {
  getSearchItemIndicator,
  getSearchItemPrice,
  ItemType,
} from '#src/components/css-only/Search/PassSearch/utils';

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
    <ClickableItemForStorybook
      secondary={getSearchItemIndicator(
        // @ts-expect-error
        { item: paymentPack, itemType: ItemType.PAYMENT_PACK },
        t,
      )}
      // @ts-expect-error
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
  component: ClickableItemForStorybook,
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
