import React from 'react';

import OfferSummary from '#libs/offer/OfferSummary';
import SubscriptionRecap from '#libs/subscription/components/new-checkout-flow/SubscriptionRecap';

import { ContractWithPaymentPack } from '#libs/subscription/types';
import { Offer, OfferSummaryVariant } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { CompanyTheme } from '#libs/theme/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './SubscriptionBasketSummaryStyles.css';

export type Props = {
  offer: Offer<number, Establishment, MetaActivity>;
  companyTheme: CompanyTheme;
  contract: ContractWithPaymentPack;
  isExcludingTax?: boolean;
};

export const SubscriptionBasketSummary: React.FC<Props> = React.memo(
  ({ offer, companyTheme, contract, isExcludingTax }) => {
    return (
      <div className="bs-subscription__basket-summary">
        {offer && (
          <OfferSummary
            noStyledContainer
            establishment={offer?.establishment}
            metaActivity={offer?.meta_activity}
            offer={offer}
            theme={companyTheme}
            variant={OfferSummaryVariant.BASKET}
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
            hideCredits={companyTheme.hide_credits_for_customers}
            isExcludingTax={isExcludingTax}
          />
        </div>
      </div>
    );
  },
);

export const SubscriptionBasketSummaryForStorybook = marketplaceCssHoc()(
  SubscriptionBasketSummary,
);

export default SubscriptionBasketSummary;
