// @flow
import React, { Component } from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

const styles = () => ({
  listItem: {
    width: '100%',
  },
});

type Props = {
  pack: Object,
  t: (x: string) => string,
  classes: Object,
};

export class PaymentPack extends Component<Props> {
  render() {
    const { pack, t, classes } = this.props;
    const { id, name, credits, price } = pack;
    const creditsFormatted = credits
      ? `${credits} ${t('credits')}`
      : t('unlimitedCredits');
    return (
      <ListItem key={id} button className={classes.listItem} divider>
        <ListItemText primary={name} />
        <ListItemText
          primary={`${price} €`}
          secondary={`${t('credits')} : ${creditsFormatted.toLowerCase()}`}
        />
      </ListItem>
    );
  }
}

export default withStyles(styles)(withNamespaces(['paymentPack'])(PaymentPack));
