// @flow
import React, { Component } from 'react';

import { ListItem, ListItemText, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

const styles = () => ({
  container: {},
});

type Props = {
  t: (x: string) => string,
  paymentPack: Object,
};

export class PaymentPackMinimalSummary extends Component<Props> {
  render() {
    const { t, paymentPack } = this.props;
    const { name, credits, ending_date, unlimited } = paymentPack;

    const creditsFormatted = unlimited
      ? t('paymentPack.unlimitedCredits')
      : `${t('paymentPack.credits')}: ${credits}`;

    const endingDateFormatted = ending_date || t('paymentPack.never');

    return (
      <ListItem>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <ListItemText
          primary={t('paymentPack.expirationDate')}
          secondary={endingDateFormatted}
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPackMinimalSummary));
