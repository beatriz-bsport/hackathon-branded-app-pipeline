import React from 'react';

import './styles.css';

import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import { Subscription } from '#libs/subscription/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { PaymentCombo } from '#libs/payment-combo/types';

type SubscriptionType = Subscription<PrivatePass, PaymentPack, PaymentCombo>;

type Props = {
  subscription: SubscriptionType;
  withFees?: boolean;
};

const BillingInterval: React.FC<Props> = ({ subscription, withFees }) => {
  const { t } = useTranslation('marketplace');

  const interval =
    (subscription?.interval &&
      t(`subscriptionCard.billingInterval.${subscription?.interval}`, {
        count: subscription?.nb_interval,
      })) ??
    '';

  const fees = withFees && getCurrencyDisplayWithPrice(subscription?.flat_fee);

  if (withFees) {
    return (
      <div className="bs-billing-interval">
        {!!interval &&
          (subscription?.nb_interval > 1
            ? `${interval} +\u00A0${fees}`
            : `/ ${interval} +\u00A0${fees}`)}
      </div>
    );
  }

  return (
    <div className="bs-billing-interval">
      {!!interval &&
        (subscription?.nb_interval > 1 ? interval : `/\u00A0${interval}`)}
    </div>
  );
};

export default React.memo(BillingInterval);
