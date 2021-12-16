import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';

import { ConsumerPaymentPack } from '../types';
import { PaymentPack } from '../../payment-packs/types';

type OwnProps = {
  consumerPack?: ConsumerPaymentPack<number | PaymentPack>;
  paymentPack?: PaymentPack;
  variant?: Variant;
};

type Props = OwnProps & WithTranslation;

export const CreditStatus = (props: Props) => {
  const { paymentPack, consumerPack } = props;
  if (!consumerPack || !paymentPack) {
    return (
      <Typography
        variant={props.variant || 'caption'}
        component="span"
        color="textSecondary"
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
      <Typography variant={props.variant || 'caption'} color="error">
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
        variant={props.variant || 'caption'}
        color="primary"
        component="span"
      >
        {`${props.t('unlimitedCredits')}`}
      </Typography>
    );
  }
  return (
    <Typography
      component="span"
      variant={props.variant || 'caption'}
      color={available_credits / credits > 0.2 ? 'primary' : 'error'}
    >
      {`${
        available_credits || credits - consumerPack?.used_credits
      } / ${credits} ${props.t('credits').toLowerCase()}`}
    </Typography>
  );
};

export default compose<any, OwnProps>(withTranslation(['paymentPack']))(
  CreditStatus,
);
