import React from 'react';

import { useTranslation } from 'react-i18next';
import OfferSummary from '#libs/offer/OfferSummary';
import SubscriptionRecap from '#libs/subscription/components/new-checkout-flow/SubscriptionRecap';
import CouponCodeInput from '#libs/checkout/components/new-checkout-flow/CouponCodeInput.component';
import PriceCount from '#libs/checkout/components/new-checkout-flow/PriceCount.component';

import { ContractWithPaymentPack } from '#libs/subscription/types';
import { Offer } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { CompanyTheme } from '#libs/theme/types';
import {
  Basket,
  OnRemoveCheckoutItemData,
  PrepaidLine,
} from '#libs/checkout/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './SubscriptionBasketSummaryStyles.css';

export type Props = {
  offer: Offer<number, Establishment, MetaActivity>;
  companyTheme: CompanyTheme;
  contract: ContractWithPaymentPack;
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
  hideCredits: boolean;
  handlePayNow: () => void;
};

export const SubscriptionBasketSummary: React.FC<Props> = React.memo(
  ({
    offer,
    companyTheme,
    contract,
    subscriptionPseudoBasket,
    handleSubmitCouponCode,
    onRemoveCoupon,
    showCouponInput,
    isExcludingTax,
    isPayButtonDisabled,
    hideCredits,
    handlePayNow,
  }) => {
    const { t } = useTranslation('subscription');

    return (
      <div className="bs-subscription__basket-summary">
        {offer && (
          <OfferSummary
            establishment={offer?.establishment}
            metaActivity={offer?.meta_activity}
            offer={offer}
            theme={companyTheme}
            variant="basket"
          />
        )}
        <div
          className={
            offer
              ? 'bs-subscription__recap-with-offer'
              : 'bs-subscription__recap'
          }
        >
          <SubscriptionRecap
            contract={contract}
            hideCredits={hideCredits}
            isExcludingTax={isExcludingTax}
          />
        </div>
        {showCouponInput && (
          <CouponCodeInput
            isBasketModificationDisabled={false}
            onSubmit={handleSubmitCouponCode}
          />
        )}
        <div className="bs-subscription__pricing">
          <PriceCount
            basket={subscriptionPseudoBasket}
            isDeleteButtonDisabled={false}
            isExcludingTax={isExcludingTax}
            onRemoveCheckoutItem={onRemoveCoupon}
          />
        </div>
        <div className="bs-subscription__bottom__container">
          <button
            className="bs-subscription__bottom__submit-button"
            disabled={isPayButtonDisabled}
            onClick={handlePayNow}
            type="submit"
          >
            {t('newCheckout.subscriptionBasketSummary.payNow')}
          </button>
          <div className="bs-subscription__bottom__info-text">
            {t('newCheckout.subscriptionBasketSummary.message')}
          </div>
        </div>
      </div>
    );
  },
);

export const SubscriptionBasketSummaryForStorybook = marketplaceCssHoc()(
  SubscriptionBasketSummary,
);

export default SubscriptionBasketSummary;
