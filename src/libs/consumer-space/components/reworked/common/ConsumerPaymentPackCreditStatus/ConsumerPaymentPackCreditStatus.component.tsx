import React from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import moment from 'moment-timezone';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCreditFactor } from '#libs/theme/selectors';
import Typography from '#Fabrique/Typography';

import './styles.css';

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
    typeof consumerPaymentPackAvailableCredits !== 'number' ||
    !paymentPackTotalCredits
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
          blocked_from: moment(consumerPaymentPackPenaltyDisabledFrom).format(
            'L',
          ),
          blocked_until: moment(consumerPaymentPackPenaltyDisabledUntil).format(
            'L',
          ),
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
      {`${
        (consumerPaymentPackAvailableCredits ||
          paymentPackTotalCredits - consumerPaymentPackUsedCredits) /
        getCreditFactor()
      }/${paymentPackTotalCredits / getCreditFactor()}\xa0${t(
        paymentPackTotalCredits / getCreditFactor() > 1
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
