import React from 'react';

import './styles.css';

import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { Contract, ContractWithPaymentPack } from '#libs/subscription/types';

type Props = {
  contract: Contract | ContractWithPaymentPack;
  withFees?: boolean;
};

const BillingInterval: React.FC<Props> = ({ contract, withFees }) => {
  const { t } = useTranslation('marketplace');

  const interval =
    (contract?.interval &&
      t(`contractCard.billingInterval.${contract?.interval}`, {
        count: contract?.recurrence_basis,
      })) ??
    '';

  if (withFees) {
    const fees = getCurrencyDisplayWithPrice(contract?.flat_fee);

    return (
      <div className="bs-billing-interval">
        {!!interval &&
          (contract?.recurrence_basis > 1
            ? `${interval} +\u00A0${fees}`
            : `/ ${interval} +\u00A0${fees}`)}
      </div>
    );
  }

  return (
    <div className="bs-billing-interval">
      {!!interval &&
        (contract?.recurrence_basis > 1 ? interval : `/${interval}`)}
    </div>
  );
};

export default React.memo(BillingInterval);
