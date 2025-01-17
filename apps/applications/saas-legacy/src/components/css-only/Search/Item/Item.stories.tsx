import React from 'react';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

// @ts-expect-error
import { PaymentPackStorybookFactory } from '#src/libs/payment-packs/factory';
import { PaymentPack } from '#src/libs/payment-packs/types';
import { Props, ItemForStorybook } from '#src/components/css-only/Search/Item';
import ClickableItem from '#src/components/css-only/ClickableItem';
import {
  getSearchItemIndicator,
  getSearchItemPrice,
  ItemType,
} from '#src/components/css-only/Search/PassSearch/utils';

const randomItem: Partial<PaymentPack> = PaymentPackStorybookFactory();

export const ItemWithRenderProp = (args: Props) => {
  const { t } = useTranslation([
    'paymentPack',
    'notificationRule',
    'platformBilling',
  ]);

  return (
    // @ts-expect-error
    <ItemForStorybook
      renderItem={(item: Partial<PaymentPack>) => (
        <ClickableItem
          primary={item.name}
          secondary={getSearchItemIndicator(
            // @ts-expect-error
            { item: item, itemType: ItemType.PAYMENT_PACK },
            t,
          )}
          // @ts-expect-error
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
  component: ItemForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
