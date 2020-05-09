// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose, withState } from 'recompose';

import type { PaymentCombo } from '../types';

type Props = {
  onClick: () => void,
  paymentCombo: PaymentCombo,
  processing: boolean,
  setProcessing: (boolean) => void,
  classes: Object,
};
export const PaymentComboBuyableItem = (props: Props) => {
  const { paymentCombo } = props;
  const subtitle = [
    ...paymentCombo.payment_packs.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
    ...paymentCombo.shop_items.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
    ...paymentCombo.private_passes.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
  ].join(' + ');
  return (
    <ListItem>
      <ListItemText
        primary={`${paymentCombo.name} - ${paymentCombo.price}€`}
        secondary={subtitle}
      />
      <ListItemSecondaryAction>
        {props.processing ? (
          <CircularProgress />
        ) : (
          <Button
            onClick={() => {
              props.setProcessing(true);
              props.onClick({
                onSuccess: () => props.setProcessing(false),
                onError: () => props.setProcessing(false),
              });
            }}
            color="primary"
            variant="contained"
            className={props.classes.button}
          >
            <AddShoppingCartIcon />
          </Button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withState('processing', 'setProcessing', false),
)(PaymentComboBuyableItem);
