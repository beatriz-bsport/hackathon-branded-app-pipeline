import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ListItemText, ListItem, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

const styles = (theme) => ({
  listItem: {
    width: '100%',
  },
});

type Props = {
  pack: Object,
};

export class PaymentPack extends Component<Props> {
  render() {
    const { pack, t, classes } = this.props;
    const { id, name, credits, price } = pack;
    const creditsFormatted = credits
      ? `${credits} ${t('paymentPack.credits')}`
      : t('paymentPack.unlimitedCredits');
    return (
      <ListItem key={id} button className={classes.listItem} divider>
        <ListItemText primary={name} />
        <ListItemText
          primary={`${price} €`}
          secondary={`${t(
            'paymentPack.credits',
          )} : ${creditsFormatted.toLowerCase()}`}
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPack));
