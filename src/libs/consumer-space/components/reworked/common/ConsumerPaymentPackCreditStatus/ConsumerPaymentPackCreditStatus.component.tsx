import React from 'react';
import { DateTime } from 'luxon';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';

import './styles.css';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';

export type Props = {
  className?: string;
  isConsumerPaymentPackDisabled?: boolean;
  consumerPaymentPackPenaltyDisabledFrom?: string;
  consumerPaymentPackPenaltyDisabledUntil?: string;
  consumerPaymentPackAvailableCredits: number;
  consumerPaymentPackUsedCredits: number;
  paymentPackTotalCredits: number;
  isPaymentPackUnlimited?: boolean;
};

const ConsumerPaymentPackCreditStatus: React.FC<Props> = ({
  className,
  isConsumerPaymentPackDisabled,
  consumerPaymentPackPenaltyDisabledFrom,
  consumerPaymentPackPenaltyDisabledUntil,
  consumerPaymentPackAvailableCredits,
  consumerPaymentPackUsedCredits,
  paymentPackTotalCredits,
  isPaymentPackUnlimited,
}) => {
  const { t } = useTranslation('paymentPack');

  const consumerPackHasPenalty =
    isConsumerPaymentPackDisabled &&
    !!consumerPaymentPackPenaltyDisabledFrom &&
    !!consumerPaymentPackPenaltyDisabledUntil;

  /**
   * If the member has 20% credits or less on his pass, then we display the status in red
   */
  const isErrorStatus =
    consumerPaymentPackAvailableCredits / paymentPackTotalCredits <= 0.2;

  if (
    !isPaymentPackUnlimited &&
    ((!consumerPaymentPackAvailableCredits &&
      consumerPaymentPackAvailableCredits !== 0) ||
      (!paymentPackTotalCredits && paymentPackTotalCredits !== 0))
  ) {
    return <></>;
  }

  if (isPaymentPackUnlimited) {
    return (
      <Typography
        className={classNames(
          'bs-consumer-payment-pack-credit-status',
          className,
        )}
        variant="body-sm"
      >
        {t('paymentPack:unlimitedCredits')}
      </Typography>
    );
  }

  if (consumerPackHasPenalty) {
    return (
      <Typography
        className={classNames(
          'bs-consumer-payment-pack-credit-status--error',
          className,
        )}
        variant="body-sm"
      >
        {t('paymentPack:blockedCpp', {
          blocked_from: DateTime.fromISO(
            consumerPaymentPackPenaltyDisabledFrom,
          ).toFormat('D'),
          blocked_until: DateTime.fromISO(
            consumerPaymentPackPenaltyDisabledUntil,
          ).toFormat('D'),
        })}
      </Typography>
    );
  }

  return (
    <Typography
      className={classNames(
        'bs-consumer-payment-pack-credit-status',
        {
          'bs-consumer-payment-pack-credit-status--error': isErrorStatus,
        },
        className,
      )}
      variant="body-sm"
    >
      {`${getCreditsDividedDisplay(
        consumerPaymentPackAvailableCredits ||
          paymentPackTotalCredits - consumerPaymentPackUsedCredits,
      )}/${getCreditsDividedDisplay(paymentPackTotalCredits)}\xa0${t(
        getCreditsDividedValue(paymentPackTotalCredits) > 1
          ? 'paymentPack:credits_plural'
          : 'paymentPack:credits',
      ).toLowerCase()}`}
    </Typography>
  );
};

export const ConsumerPaymentPackCreditStatusForStorybook = marketplaceCssHoc()(
  ConsumerPaymentPackCreditStatus,
);

export default React.memo(ConsumerPaymentPackCreditStatus);
