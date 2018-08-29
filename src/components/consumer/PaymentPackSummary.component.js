import React, { Component } from 'react';

import { ListItem, ListItemText, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

const styles = () => ({
  container: {},
});

type Props = {};

export class PaymentPackMinimalSummary extends Component<Props> {
  render() {
    const { t, paymentPack } = this.props;
    const { name, credits, ending_date } = paymentPack;

    const creditsFormatted = credits
      ? t('paymentPack.unlimited')
      : `${t('paymentPack.credits')}: ${credits}`;

    return (
      <ListItem>
        <ListItemText primary={name} secondary={creditsFormatted} />
        <ListItemText primary={ending_date} />
      </ListItem>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPackMinimalSummary));
