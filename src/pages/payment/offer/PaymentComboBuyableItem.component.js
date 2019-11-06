// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

type Props = {
  onClick: () => void,
  paymentCombo: PaymentCombo,
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
      <ListItemText primary={paymentCombo.name} secondary={subtitle} />
      <ListItemSecondaryAction>
        <Button
          onClick={props.onClick}
          color="primary"
          variant="outlined"
          className={props.classes.button}
        >
          <AddShoppingCartIcon className={props.classes.leftIcon} />
          {`${paymentCombo.price}€`}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    marginRIght: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(PaymentComboBuyableItem);
