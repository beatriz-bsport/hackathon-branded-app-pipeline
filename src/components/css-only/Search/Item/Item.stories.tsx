// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { PaymentPackStorybookFactory } from '#libs/payment-packs/factory';
import { PaymentPack } from '#libs/payment-packs/types';
import Item, { Props } from '#components/css-only/Search/Item';
import ClickableItem from '#components/css-only/ClickableItem';
import {
  getSearchItemIndicator,
  getSearchItemPrice,
  ItemType,
} from '#components/css-only/Search/PassSearch/utils';

const randomItem: Partial<PaymentPack> = PaymentPackStorybookFactory();

export const ItemWithRenderProp = (args: Props) => {
  const { t } = useTranslation([
    'paymentPack',
    'notificationRule',
    'platformBilling',
  ]);

  return (
    <Item
      renderItem={(item: Partial<PaymentPack>) => (
        <ClickableItem
          primary={item.name}
          secondary={getSearchItemIndicator(
            { item: item, itemType: ItemType.PAYMENT_PACK },
            t,
          )}
          tertiary={getSearchItemPrice(
            { item: item, itemType: ItemType.PAYMENT_PACK },
            t,
          )}
          actionIcon={<ShoppingCartIcon />}
          onClick={() => {}}
          onActionClick={() => {}}
        />
      )}
      {...args}
    />
  );
};
ItemWithRenderProp.args = {
  item: randomItem,
};

export default {
  title: 'Components/CssOnly/Search/Item',
  component: Item,
  parameters: {
    docs: {
      page: null,
    },
  },
};
