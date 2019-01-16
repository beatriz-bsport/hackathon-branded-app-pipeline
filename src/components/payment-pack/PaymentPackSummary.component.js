// @flow
import React, { Component } from 'react';
import type { Node } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';

type Props = {
  t: (x: string) => string,
  paymentPack: Object,
  noDivider: boolean,
  buyButton: ?Node,
};

export class PaymentPackMinimalSummary extends Component<Props> {
  render() {
    const { t, paymentPack, noDivider, buyButton } = this.props;
    const {
      name,
      credits,
      validity_daterange,
      duration_days,
      unlimited,
    } = paymentPack;

    const creditsFormatted = unlimited
      ? t('paymentPack.unlimitedCredits')
      : `${t('paymentPack.credits')}: ${credits}`;

    let dateInfo = '';
    if (duration_days) {
      dateInfo = `${t('paymentPack.validForNdays1')} ${duration_days} ${t(
        'paymentPack.validForNdays2',
      )}`;
    } else {
      dateInfo = `${t('paymentPack.validity')} ${formatAsDate(
        Moment(validity_daterange.lower),
      )} - ${formatAsDate(Moment(JSON.parse(validity_daterange).upper))}`;
    }

    return (
      <ListItem divider={!noDivider}>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <ListItemText
          primary={dateInfo}
          primaryTypographyProps={{ align: 'right', variant: 'caption' }}
        />
        {buyButton}
      </ListItem>
    );
  }
}

export default translate()(PaymentPackMinimalSummary);
