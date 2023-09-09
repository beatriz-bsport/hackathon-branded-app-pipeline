import React from 'react';

import './styles.css';

import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

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

  const formatedInterval =
    (interval &&
      t(`contractCard.billingInterval.${interval}`, {
        count: recurrenceBasis,
      })) ??
    '';

  if (withFees) {
    const fees = getCurrencyDisplayWithPrice(flatFee);

    return (
      <div className="bs-billing-interval">
        {!!interval &&
          (recurrenceBasis > 1
            ? `${interval} +\u00A0${fees}`
            : `/ ${interval} +\u00A0${fees}`)}
      </div>
    );
  }

  return (
    <div className="bs-billing-interval">
      {!!formatedInterval && (recurrenceBasis > 1 ? interval : `/${interval}`)}
    </div>
  );
};

export default React.memo(BillingInterval);
