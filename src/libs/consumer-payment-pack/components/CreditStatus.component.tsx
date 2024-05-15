import React from 'react';
import { compose } from 'recompose';
import { DateTime } from 'luxon';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';

import { ConsumerPaymentPack } from '../types';
import { PaymentPack } from '../../payment-packs/types';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';

type OwnProps = {
  consumerPack?: ConsumerPaymentPack<number | PaymentPack>;
  paymentPack?: PaymentPack;
  variant?: Variant;
  textColor?: TypographyProps['color'];
};

type Props = OwnProps & WithTranslation;

export const CreditStatus = (props: Props) => {
  const { paymentPack, consumerPack } = props;
  if (!consumerPack || !paymentPack) {
    return (
      <Typography
        color="textSecondary"
        component="span"
        variant={props.variant || 'caption'}
      >
        {' '}
        -{' '}
      </Typography>
    );
  }
  const { credits, unlimited } = paymentPack;
  const {
    available_credits,
    disabled,
    penalty_disabled_from,
    penalty_disabled_until,
  } = consumerPack;
  if (disabled && penalty_disabled_from && penalty_disabled_until) {
    return (
      <Typography color="error" variant={props.variant || 'caption'}>
        {props.t('blockedCpp', {
          blocked_from: DateTime.fromISO(penalty_disabled_from).toFormat('D'),
          blocked_until: DateTime.fromISO(penalty_disabled_until).toFormat('D'),
        })}
      </Typography>
    );
  }
  if (unlimited) {
    return (
      <Typography
        color={props.textColor ?? 'primary'}
        component="span"
        variant={props.variant || 'caption'}
      >
        {`${props.t('unlimitedCredits')}`}
      </Typography>
    );
  }

  const availableCredits =
    available_credits || credits - consumerPack?.used_credits;
  return (
    <Typography
      color={
        props.textColor ??
        (available_credits / credits > 0.2 ? 'primary' : 'error')
      }
      component="span"
      variant={props.variant || 'caption'}
    >
      {`${getCreditsDividedDisplay(
        availableCredits,
      )} / ${getCreditsDividedDisplay(credits)} ${props
        .t('credits', { count: getCreditsDividedValue(availableCredits) })
        .toLowerCase()}`}
    </Typography>
  );
};

export default compose<any, OwnProps>(withTranslation(['paymentPack']))(
  CreditStatus,
);
