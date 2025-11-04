import { FlowTypes } from '#src/libs/checkout/constants';
import { CheckoutItemData } from '#src/libs/checkout/types';
import { PassTypes } from '#src/libs/marketplace/types';
import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';

const BUYABLE_ITEM_IDENTIFIER_MAP: Record<PassTypes, number> = {
  [PassTypes.PAYMENTPACK]: BUYABLE_ITEM_PASS,
  [PassTypes.PRIVATEPASS]: BUYABLE_ITEM_PRIVATE_PASS,
  [PassTypes.PAYMENTCOMBO]: BUYABLE_ITEM_COMBO_ITEM,
};

export const getCheckoutItemData = ({
  id,
  passType,
  force,
}: {
  id: number;
  passType: PassTypes;
  force?: string;
}): CheckoutItemData => {
  const buyable_item_identifier = BUYABLE_ITEM_IDENTIFIER_MAP[passType];

  return {
    buyable_item_id: id,
    buyable_item_identifier,
    quantity: 1,
    extra_data: {
      flow: FlowTypes.ONE_CLICK_CHECKOUT,
      ...(force && { force }),
    },
  };
};
