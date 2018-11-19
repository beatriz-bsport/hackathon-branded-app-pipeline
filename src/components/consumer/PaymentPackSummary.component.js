// @flow
import React, { Component } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';

type Props = {
  t: (x: string) => string,
  paymentPack: Object,
  noDivider: boolean,
};

export class PaymentPackMinimalSummary extends Component<Props> {
  render() {
    const { t, paymentPack, noDivider } = this.props;
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
      dateInfo = `${formatAsDate(
        Moment(validity_daterange.lower),
      )} - ${formatAsDate(Moment(validity_daterange.upper))}`;
    }

    return (
      <ListItem divider={!noDivider}>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <ListItemText
          primary={t('paymentPack.validity')}
          secondary={dateInfo}
          primaryTypographyProps={{ align: 'right' }}
          secondaryTypographyProps={{ align: 'right' }}
        />
      </ListItem>
    );
  }
}

export default translate()(PaymentPackMinimalSummary);
