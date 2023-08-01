import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';

import { ConsumerPaymentPack } from '../types';
import { PaymentPack } from '../../payment-packs/types';
import { getCreditFactor } from '#libs/theme/selectors';

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
          blocked_from: moment(penalty_disabled_from).format('L'),
          blocked_until: moment(penalty_disabled_until).format('L'),
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
  return (
    <Typography
      color={
        props.textColor ??
        (available_credits / credits > 0.2 ? 'primary' : 'error')
      }
      component="span"
      variant={props.variant || 'caption'}
    >
      {`${
        (available_credits || credits - consumerPack?.used_credits) /
        getCreditFactor()
      } / ${credits / getCreditFactor()} ${props.t('credits').toLowerCase()}`}
    </Typography>
  );
};

export default compose<any, OwnProps>(withTranslation(['paymentPack']))(
  CreditStatus,
);
