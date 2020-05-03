// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
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
  const { available_credits } = consumerPack;
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

export default withNamespaces(['paymentPack'])(CreditStatus);
