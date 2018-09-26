// @flow
import React, { Component } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';

type Props = {
  t: (x: string) => string,
  paymentPack: Object,
};

export class PaymentPackMinimalSummary extends Component<Props> {
  render() {
    const { t, paymentPack } = this.props;
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

    let starting_date = null;
    let ending_date = null;
    if (duration_days) {
      starting_date = Moment();
      ending_date = Moment().add('days', duration_days);
    }
    if (validity_daterange) {
      starting_date = Moment(validity_daterange.lower);
      ending_date = Moment(validity_daterange.upper);
    }

    return (
      <ListItem disableGutters divider>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <ListItemText
          primary={t('paymentPack.validity')}
          secondary={`${formatAsDate(starting_date)} - ${formatAsDate(
            ending_date,
          )}`}
        />
      </ListItem>
    );
  }
}

export default translate()(PaymentPackMinimalSummary);
