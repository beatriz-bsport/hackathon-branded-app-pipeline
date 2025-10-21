import { useState } from 'react';
import useAsyncFn from '#src/hooks/useAsyncFn';
import {
  fetchCurrentBasket,
  addItemToBasket,
  validateUnpaid,
  removeItemFromBasket,
} from '#src/libs/checkout/api';
import type {
  Basket,
  CheckoutItemData,
  AddItemToBasketParams,
} from '#src/libs/checkout/types';
import { PassTypes } from '#src/libs/marketplace/types';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
} from '@bsport/common/lib/master-data/buyable-items';
import { FlowTypes } from '#src/libs/checkout/constants';
import { trackAddToCartEvent } from '#src/events/purchase/utils';

export const useBasket = () => {
  const { companyId, passId, passType } = usePassCardDataContext();
  const [currentBasket, setCurrentBasket] = useState<Basket | undefined>();

  const [fetchBasketState, fetchBasket] = useAsyncFn(async () => {
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const { data: basket } = await fetchCurrentBasket(companyId);
    setCurrentBasket(basket);
    return basket;
  }, [companyId]);

  const [addItemState, addItemToBasketAndFetch] = useAsyncFn(
    async (params?: AddItemToBasketParams) => {
      if (!companyId || !passId) {
        throw new Error('Company ID and Pass ID are required');
      }

      const { data: basket } = await fetchCurrentBasket(companyId);

      if (!basket?.id) {
        throw new Error('No basket found');
      }

      if (
        basket.checkout_items.some((item) => item.buyable_item_id === passId)
      ) {
        setCurrentBasket(basket);
        return;
      }

      const checkoutItems = basket?.checkout_items?.map(({ id, quantity }) => ({
        checkout_item: id,
        quantity,
      }));

      if (!!checkoutItems?.length) {
        await removeItemFromBasket(basket.id, checkoutItems[0]);
      }

      const checkoutItemData: CheckoutItemData = {
        buyable_item_id: passId,
        buyable_item_identifier:
          passType === PassTypes.PAYMENTPACK
            ? BUYABLE_ITEM_PASS
            : BUYABLE_ITEM_PRIVATE_PASS,
        quantity: 1,
        extra_data: {
          flow: FlowTypes.ONE_CLICK_CHECKOUT,
        },
      };

      const { data: updatedBasket } = await addItemToBasket(
        basket.id,
        checkoutItemData,
        params,
      );
      setCurrentBasket(updatedBasket);
      trackAddToCartEvent({
        basket: updatedBasket,
        buyableItemId: checkoutItemData.buyable_item_id,
      });
      return updatedBasket;
    },
    [companyId, passId, passType],
  );

  const [validateBasketState, validateBasket] = useAsyncFn(
    async (basket: Basket) => {
      if (!basket?.checkout_items) {
        throw new Error('Invalid basket data');
      }
      const basketTotalPrice = basket.checkout_items.reduce(
        (acc, item) => acc + (item.unit_price || 0),
        0,
      );
      if (basketTotalPrice <= 0) {
        await validateUnpaid(basket.id);
        return;
      }
    },
  );

  return {
    fetchBasket: [fetchBasketState, fetchBasket] as const,
    addItemToBasket: [addItemState, addItemToBasketAndFetch] as const,
    validateBasket: [validateBasketState, validateBasket] as const,
    currentBasket,
  };
};
