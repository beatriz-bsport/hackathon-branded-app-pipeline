import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import SadSmileyIcon from '#components/icons/SadSmileyIcon.component';

import './styles.css';

const MarketplaceContractNotFound: React.FC = React.memo(() => {
  const { t } = useTranslation('subscription');

  return (
    <div className="bs-contract-payment-page__not__found__container">
      <SadSmileyIcon />

      <span className="bs-contract-payment-page__not__found__title">
        {t('subscription:subscriptionNotFound.title')}
      </span>

      <span className="bs-contract-payment-page__not__found__description">
        {t('subscription:subscriptionNotFound.explanation')}
      </span>
    </div>
  );
});

export const MarketplaceContractNotFoundForStorybook = marketplaceCssHoc()(
  MarketplaceContractNotFound,
);

export default MarketplaceContractNotFound;
