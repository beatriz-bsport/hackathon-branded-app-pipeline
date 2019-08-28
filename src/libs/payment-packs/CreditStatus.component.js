// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
  unlimited: boolean,
  credits: ?number,
  available_credits: ?number,
};

export const CreditStatus = (props: Props) => {
  if (props.unlimited) {
    return (
      <Typography variant="caption" color="primary" component="span">
        {`${props.t('paymentPack.unlimitedCredits')}`}
      </Typography>
    );
  }
  return (
    <Typography
      component="span"
      variant="caption"
      color={
        props.available_credits / props.credits > 0.2 ? 'primary' : 'error'
      }
    >
      {`${props.available_credits} / ${props.credits} ${props
        .t('paymentPack.credits')
        .toLowerCase()}`}
    </Typography>
  );
};

export default withNamespaces()(CreditStatus);
