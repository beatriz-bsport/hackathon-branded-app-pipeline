import React from 'react';

import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import './styles.css';

type Props = {
  interval: 'month' | 'week' | 'day' | 'year';
  recurrenceBasis: number;
  flatFee: string;
  withFees?: boolean;
};

const BillingInterval: React.FC<Props> = ({
  interval,
  recurrenceBasis,
  flatFee,
  withFees,
}) => {
  const { t } = useTranslation('marketplace');

  const translatedBillingInterval =
    (interval &&
      t(`contractCard.billingInterval.${interval}`, {
        count: recurrenceBasis,
      })) ??
    '';

  const prefix = recurrenceBasis > 1 ? '' : '/';

  if (withFees) {
    const fees = getCurrencyDisplayWithPrice(flatFee ?? '0');

    const feesSuffix = ` +\u00A0${fees}`;

    return (
      <div className="bs-billing-interval">
        {`${prefix}${translatedBillingInterval}${feesSuffix}`}
      </div>
    );
  }

  return (
    <div className="bs-billing-interval">
      {`${prefix}${translatedBillingInterval}`}
    </div>
  );
};

export default React.memo(BillingInterval);
