import React from 'react';

import OfferSummary from '#src/libs/offer/OfferSummary';
import SubscriptionRecap from '#src/libs/subscription/components/new-checkout-flow/SubscriptionRecap';

import { ContractWithPaymentPack } from '#src/libs/subscription/types';
import { Offer, OfferSummaryVariant } from '#src/libs/offer/types';
import { Establishment } from '#src/libs/establishment/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

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
        <SubscriptionRecap
          contract={contract}
          hideCredits={companyTheme.hide_credits_for_customers}
          isExcludingTax={isExcludingTax}
        />
      </div>
    );
  },
);

export const SubscriptionBasketSummaryForStorybook = marketplaceCssHoc()(
  SubscriptionBasketSummary,
);

export default SubscriptionBasketSummary;
