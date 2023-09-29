import React from 'react';

import { useTranslation } from 'react-i18next';
import CouponCodeInput from '#libs/checkout/components/new-checkout-flow/CouponCodeInput.component';
import PriceCount from '#libs/checkout/components/new-checkout-flow/PriceCount.component';
import { CheckoutContext } from '../../../../../pages/checkout/basket/CheckoutContext';

import {
  Basket,
  OnRemoveCheckoutItemData,
  PrepaidLine,
} from '#libs/checkout/types';

import './styles.css';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

export type Props = {
  subscriptionPseudoBasket: Basket<string, PrepaidLine>;
  handleSubmitCouponCode: (
    formCouponCode: string,
    options: {
      onSuccess?: () => void;
      onError?: (error?: Error) => void;
    },
  ) => void;
  onRemoveCoupon: (onRemoveItemdata: OnRemoveCheckoutItemData) => void;
  showCouponInput: boolean;
  isExcludingTax?: boolean;
  isPayButtonDisabled: boolean;
  handlePayNow: () => void;
};

export const SubscriptionBillingInfo: React.FC<Props> = React.memo(
  ({
    subscriptionPseudoBasket,
    handleSubmitCouponCode,
    onRemoveCoupon,
    showCouponInput,
    isExcludingTax,
    isPayButtonDisabled,
    handlePayNow,
  }) => {
    const { t } = useTranslation(['subscription', 'checkout']);

    return (
      <>
        {showCouponInput && (
          <div className="bs-subscription__coupon_container">
            <CouponCodeInput
              isBasketModificationDisabled={false}
              onSubmit={handleSubmitCouponCode}
            />
          </div>
        )}
        <CheckoutContext.Provider value>
          <PriceCount
            hideTotal
            basket={subscriptionPseudoBasket}
            isDeleteButtonDisabled={false}
            isExcludingTax={isExcludingTax}
            onRemoveCheckoutItem={onRemoveCoupon}
          />
        </CheckoutContext.Provider>
        <div className="bs-subscription__bottom__container">
          <div className="bs-subcription--bottom__container__total">
            <span className="bs-subscription--bottom__container__total__title">
              {t('checkout:payment.totalHiddingTax')}
            </span>
            <span>
              {getCurrencyDisplayWithPrice(
                parseFloat(subscriptionPseudoBasket.total_price) -
                  parseFloat(
                    subscriptionPseudoBasket.total_price_prepaid_lines,
                  ),
              )}
            </span>
          </div>
          <button
            className="bs-subscription__bottom__submit-button"
            disabled={isPayButtonDisabled}
            onClick={handlePayNow}
            type="submit"
          >
            {t('subscription:newCheckout.subscriptionBasketSummary.payNow')}
          </button>
          <div className="bs-subscription__bottom__info-text">
            {t('subscription:newCheckout.subscriptionBasketSummary.message')}
          </div>
        </div>
      </>
    );
  },
);

export default SubscriptionBillingInfo;
