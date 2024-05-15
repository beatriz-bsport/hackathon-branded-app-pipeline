import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import type { PaymentPack } from '#libs/payment-packs/types';
import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';
import { formatAsDate } from '#src/utils/datetime';

import './styles.css';

export type Props = {
  consumerPaymentPack: ConsumerPaymentPack<number | PaymentPack>;
  paymentPack: PaymentPack;
  classes?: { [key: string]: boolean | string };
};

const MarketplacePaymentPackCreditStatus: React.FC<Props> = ({
  consumerPaymentPack,
  paymentPack,
  classes,
}) => {
  const { t } = useTranslation('paymentPack');

  const consumerPackHasPenalty =
    consumerPaymentPack?.disabled &&
    consumerPaymentPack?.penalty_disabled_from &&
    consumerPaymentPack?.penalty_disabled_until;

  const isErrorStatus =
    consumerPaymentPack?.available_credits / paymentPack?.credits <= 0.2;

  if (!consumerPaymentPack || !paymentPack) {
    return <></>;
  }

  if (paymentPack.unlimited) {
    return (
      <span
        className={classNames('bs-consumer-pack-credit-status', { ...classes })}
      >
        {t('paymentPack:unlimitedCredits')}
      </span>
    );
  }

  if (consumerPackHasPenalty) {
    return (
      <span
        className={classNames('bs-consumer-pack-credit-status__error', {
          ...classes,
        })}
      >
        {t('paymentPack:blockedCpp', {
          blocked_from: formatAsDate(consumerPaymentPack.penalty_disabled_from),
          blocked_until: formatAsDate(
            consumerPaymentPack.penalty_disabled_until,
          ),
        })}
      </span>
    );
  }

  return (
    <span
      className={classNames('bs-consumer-pack-credit-status', {
        'bs-consumer-pack-credit-status__error': isErrorStatus,
        ...classes,
      })}
    >
      {`${getCreditsDividedDisplay(
        consumerPaymentPack.available_credits ||
          paymentPack.credits - consumerPaymentPack.used_credits,
      )} / ${getCreditsDividedDisplay(paymentPack.credits)} ${t(
        'paymentPack:credits',
        { count: getCreditsDividedValue(paymentPack.credits) },
      ).toLowerCase()}`}
    </span>
  );
};

export const MarketplacePaymentPackCreditStatusForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackCreditStatus);

export default React.memo(MarketplacePaymentPackCreditStatus);
