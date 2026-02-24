import analyticsUtils from '#src/components/analytics/analytics';
import useAsyncFn from '#src/hooks/useAsyncFn';
import {
  fetchCurrentBasket,
  removeItemFromBasket,
} from '#src/libs/checkout/api';
import { postUserRegistration } from '#src/libs/offer/api';

type HandleUserRegistrationParams = {
  companyId: number;
  email?: string;
  offerId: number;
  paymentPackId: number;
};

export const handleUserRegistration = async ({
  companyId,
  email,
  offerId,
  paymentPackId,
}: HandleUserRegistrationParams) => {
  const { data: basket } = await fetchCurrentBasket(companyId);

  const checkoutItems = basket?.checkout_items?.map(({ id, quantity }) => ({
    checkout_item: id,
    quantity,
  }));

  if (!!checkoutItems?.length && basket?.id) {
    await removeItemFromBasket(basket.id, checkoutItems[0]);
    analyticsUtils.removeItemFromCart(basket?.checkout_items[0]);
  }

  const { data: userRegistrationResponse } = await postUserRegistration({
    payment_pack: paymentPackId,
    offers: [
      {
        offer_id: offerId,
        extra_data: { one_click_checkout: true, auto_assign_spot: true },
      },
    ],
    ...(email && { email }),
  });
  const { data: updatedBasket } = await fetchCurrentBasket(companyId);

  updatedBasket?.checkout_items.forEach((item) => {
    analyticsUtils.viewBuyableItem(item);
    analyticsUtils.addItemToCart(item);
  });

  return { basket: updatedBasket, userRegistrationResponse };
};

export const useHandleUserRegistration = () => {
  return useAsyncFn(handleUserRegistration);
};
