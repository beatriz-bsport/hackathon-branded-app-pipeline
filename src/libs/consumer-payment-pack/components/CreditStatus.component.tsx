import React from 'react';
import { DateTime } from 'luxon';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';

import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { ConsumerPaymentPack } from '#libs/consumer-payment-pack/types';
import type { FranchiseUserPassWithPaymentPack } from '#libs/franchise/types';
import type { PaymentPack } from '#libs/payment-packs/types';

type Props = {
  consumerPack?:
    | ConsumerPaymentPack<number | PaymentPack>
    | FranchiseUserPassWithPaymentPack;
  paymentPack?: PaymentPack;
  textColor?: TypographyProps['color'];
  variant?: Variant;
};

/**
 * Type guard to check if the given object is of type ConsumerPaymentPack<number | PaymentPack>.
 *
 * This function helps TypeScript narrow down the type of the provided object to ConsumerPaymentPack<number | PaymentPack>
 * by checking for the presence of a property specific to this type: `available_credits`
 *
 * @param pass - The object to check, which can be either a ConsumerPaymentPack<number | PaymentPack> or a FranchiseUserPassWithPaymentPack.
 * @returns A boolean indicating whether the object is of type ConsumerPaymentPack<number | PaymentPack>.
 */
function isConsumerPaymentPack(
  pass:
    | ConsumerPaymentPack<number | PaymentPack>
    | FranchiseUserPassWithPaymentPack,
): pass is ConsumerPaymentPack<number | PaymentPack> {
  return (pass as any).available_credits !== undefined;
}

export const CreditStatus: React.FC<Props> = ({
  consumerPack,
  paymentPack,
  textColor,
  variant,
}) => {
  const { t } = useTranslation('paymentPack');

  if (!consumerPack || !paymentPack) {
    return (
      <Typography
        color="textSecondary"
        component="span"
        variant={variant || 'caption'}
      >
        {' '}
        -{' '}
      </Typography>
    );
  }

  let consumerPaymentPackAvailableCredit: number | null = null;
  let priceToDisplay: string | null = null;

  if (isConsumerPaymentPack(consumerPack)) {
    const {
      available_credits,
      disabled,
      penalty_disabled_from,
      penalty_disabled_until,
    } = consumerPack;
    consumerPaymentPackAvailableCredit = available_credits;

    if (disabled && penalty_disabled_from && penalty_disabled_until) {
      return (
        <Typography color="error" variant={variant || 'caption'}>
          {t('blockedCpp', {
            blocked_from: DateTime.fromISO(penalty_disabled_from).toFormat('D'),
            blocked_until: DateTime.fromISO(penalty_disabled_until).toFormat(
              'D',
            ),
          })}
        </Typography>
      );
    }
  } else {
    priceToDisplay = getCurrencyDisplayWithPrice(
      consumerPack.initial_price ?? 0,
    );
  }

  if (paymentPack.unlimited) {
    const unlimitedDisplay = t('unlimitedCredits');
    return (
      <Typography
        color={textColor ?? 'primary'}
        component="span"
        variant={variant || 'caption'}
      >
        {priceToDisplay
          ? `${unlimitedDisplay} - ${priceToDisplay}`
          : unlimitedDisplay}
      </Typography>
    );
  }

  const availableCredits =
    consumerPaymentPackAvailableCredit ||
    paymentPack.credits - consumerPack?.used_credits;
  const creditsDisplay = `${getCreditsDividedDisplay(
    availableCredits,
  )} / ${getCreditsDividedDisplay(paymentPack.credits)} ${t('credits', {
    count: getCreditsDividedValue(availableCredits),
  }).toLowerCase()}`;
  return (
    <Typography
      color={
        textColor ??
        (availableCredits / paymentPack.credits > 0.2 ? 'primary' : 'error')
      }
      component="span"
      variant={variant || 'caption'}
    >
      {priceToDisplay
        ? `${creditsDisplay} - ${priceToDisplay}`
        : creditsDisplay}
    </Typography>
  );
};

export default React.memo(CreditStatus);
