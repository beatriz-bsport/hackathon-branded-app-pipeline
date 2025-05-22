import { useSelector } from 'react-redux';

import { getBasket, getCheckoutState } from '#src/libs/checkout/selectors';
import { getUsableCreditAccountBalance } from '#src/libs/membership/selectors';
import {
  getBasketClientSecret,
  getDetachPaymentMethod,
} from '#src/libs/payment/payment-module-revamped/selectors';
import { getInstalmentForBasketList } from '#src/libs/instalment-payment-configuration/selectors';

import type { RootState } from '#src/reducers';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import type { CheckoutItem } from '#src/libs/checkout/types';

type UseBasketPaymentStoreData = {
  availablePaymentMethods: number[];
  basketCheckoutItems: CheckoutItem[];
  basketTotalPriceCts: number;
  basketTotalPricePrepaidLinesCts: number;
  clientSecret: string;
  clientSecretError: Error | null | undefined;
  isClientSecretLoading: boolean;
  creditAccountBalance: number | null;
  isCurrentBasketProcessing: boolean;
  isDetachPaymentMethodLoading: boolean;
  instalmentPaymentConfigurations: InstalmentPaymentApiWithBasketId[];
  instalmentPaymentSelectedId: number | undefined;
  isBasketLoading: boolean;
  needAddress: boolean;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
};

/**
 * Custom hook to retrieve and structure data related to the basket from the Redux store.
 *
 * This hook aggregates various pieces of data related to the basket, such as payment methods,
 * billing details, and other configurations, into a single structured object.
 *
 * @param {string} basketId - The ID of the basket for which data is being retrieved.
 * @param {number} memberId - The ID of the member associated with the basket.
 *
 * @returns {UseBasketPaymentStoreData} An object containing structured data related to the basket,
 * including payment methods, billing details, loading states, and other configurations.
 *
 * @property {CheckoutItem[]} basketCheckoutItems - The items placed in the basket.
 * @property {number} basketTotalPriceCts - The total price of the basket in cents.
 * @property {number} basketTotalPricePrepaidLinesCts - The total price of prepaid lines in the basket in cents.
 * @property {string} clientSecret - The Payment Intent client secret associated with the basket. https://docs.stripe.com/payments/payment-intents#creating-a-paymentintent.
 * @property {boolean} clientSecretLoading - Indicates if the client secret is currently loading.
 * @property {Error} clientSecretError - The error object related to client secret.
 * @property {number} creditAccountBalance - The balance of the usable credit account.
 * @property {boolean} isCurrentBasketProcessing - Indicates if the current basket is being processed.
 * @property {boolean} detachPaymentMethodLoading - Indicates if the detach payment method is loading.
 * @property {Array} instalmentPaymentConfigurations - A list of instalment payment configurations for the basket.
 * @property {string|null} instalmentPaymentSelectedId - The selected instalment payment ID.
 * @property {boolean} isBasketLoading - Indicates if the basket is currently loading.
 * @property {number} paymentGroupId - The payment group ID associated with the basket.
 * @property {number} paymentGroupPriceCts - Total amount (in cents) attached to the payment-group, used by the Stripe Payment Element.
 *
 * @property {number[]} availablePaymentMethods - The payment payment methods a user can chose among.
 */

export const useBasketPaymentStoreData = (
  basketId: string,
  memberId: number,
): UseBasketPaymentStoreData => {
  const {
    total_price_cts: basketTotalPriceCts,
    total_price_prepaid_lines_cts: basketTotalPricePrepaidLinesCts,
    instalment_payment: instalmentPaymentSelectedId,
    checkout_items: basketCheckoutItems,
    available_payment_methods: availablePaymentMethods,
    need_address: needAddress,
  } = useSelector((state: RootState) => getBasket(state, basketId)) ?? {};

  const creditAccountBalance = useSelector((state: RootState) =>
    getUsableCreditAccountBalance(state, memberId),
  );

  const { loading: isDetachPaymentMethodLoading } =
    useSelector((state: RootState) =>
      getDetachPaymentMethod(state, memberId),
    ) ?? {};

  const instalmentPaymentConfigurations = useSelector((state: RootState) =>
    getInstalmentForBasketList(state),
  );

  const {
    payment_group: paymentGroupId,
    price_cts: paymentGroupPriceCts,
    client_secret: clientSecret,
    loading: isClientSecretLoading,
    error: clientSecretError,
  } = useSelector((state: RootState) =>
    getBasketClientSecret(state, basketId),
  ) ?? {};

  const { loading, current: currentBasket } =
    useSelector((state: RootState) => getCheckoutState(state).basket) ?? {};

  const {
    loading: isCurrentBasketLoading,
    updating: isCurrentBasketProcessing,
  } = currentBasket ?? {};

  const isBasketLoading = isCurrentBasketLoading || loading;

  return {
    availablePaymentMethods,
    basketCheckoutItems,
    basketTotalPriceCts,
    basketTotalPricePrepaidLinesCts,
    clientSecret,
    clientSecretError,
    isClientSecretLoading,
    creditAccountBalance,
    isCurrentBasketProcessing,
    isDetachPaymentMethodLoading,
    instalmentPaymentConfigurations,
    instalmentPaymentSelectedId,
    isBasketLoading,
    needAddress,
    paymentGroupId,
    paymentGroupPriceCts,
  };
};
