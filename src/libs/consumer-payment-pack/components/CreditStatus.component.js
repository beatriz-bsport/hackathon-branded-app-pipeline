// @flow

import React from 'react';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';

import type { TFunction } from 'react-i18next';
import type { ConsumerPaymentPack } from '../types';
import type { PaymentPack } from '../../payment-packs/types';

type Props = {
  t: TFunction,
  consumerPack: ?ConsumerPaymentPack,
  paymentPack: ?PaymentPack,
};

export const CreditStatus = (props: Props) => {
  const { paymentPack, consumerPack } = props;
  if (!consumerPack || !paymentPack) {
    return (
      <Typography variant="caption" component="span" color="textSecondary">
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
      <Typography variant="caption" color="error">
        {props.t('blockedCpp', {
          blocked_from: moment(penalty_disabled_from).format('L'),
          blocked_until: moment(penalty_disabled_until).format('L'),
        })}
      </Typography>
    );
  }
  if (unlimited) {
    return (
      <Typography variant="caption" color="primary" component="span">
        {`${props.t('unlimitedCredits')}`}
      </Typography>
    );
  }
  return (
    <Typography
      component="span"
      variant="caption"
      color={available_credits / credits > 0.2 ? 'primary' : 'error'}
    >
      {`${available_credits} / ${credits} ${props.t('credits').toLowerCase()}`}
    </Typography>
  );
};

export default withTranslation(['paymentPack'])(CreditStatus);
