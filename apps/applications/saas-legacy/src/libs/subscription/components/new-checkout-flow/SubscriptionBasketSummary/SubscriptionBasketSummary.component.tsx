import React from 'react';

import SubscriptionRecap from '#src/libs/subscription/components/new-checkout-flow/SubscriptionRecap';

import { ContractWithPaymentPack } from '#src/libs/subscription/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import './SubscriptionBasketSummaryStyles.css';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export type Props = {
  companyTheme: CompanyTheme;
  contract: ContractWithPaymentPack;
  isExcludingTax?: boolean;
};

export const SubscriptionBasketSummary: React.FC<Props> = React.memo(
  ({ companyTheme, contract, isExcludingTax }) => {
    const { t } = useTranslation('checkout');
    return (
      <div className="bs-subscription__basket-summary">
        <div className="bs-subscription__basket-summary__title">
          <Typography variant="h6">{t('myBasket.title')}</Typography>
        </div>
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
