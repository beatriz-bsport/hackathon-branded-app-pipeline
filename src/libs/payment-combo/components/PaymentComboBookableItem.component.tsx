import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { getCurrencyDisplay } from '../../theme/selectors';
import { PaymentCombo } from '../types';

interface Props {
  paymentCombo: PaymentCombo;
}

const PaymentPackComboItem = (props: Props) => {
  const classes = useStyles(['paymentPack']);

  const packs = [
    ...props.paymentCombo.payment_packs.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
    ...props.paymentCombo.shop_items.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
    ...props.paymentCombo.private_passes.map(
      (pp) => (pp.quantity > 1 ? `${pp.quantity}x ` : '') + pp.name,
    ),
  ];

  let showTotalPrice = false;
  const totalItemsPrice =
    props.paymentCombo.payment_packs.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    ) +
    props.paymentCombo.shop_items.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    ) +
    props.paymentCombo.private_passes.reduce(
      (acc, pp) => acc + parseFloat(pp.price) * pp.quantity,
      0,
    );
  if (totalItemsPrice > props.paymentCombo.price) {
    showTotalPrice = true;
  }

  return (
    <div className={classes.itemContainer}>
      <div className={classes.priceContainer}>
        <Typography variant="h6">
          {props.paymentCombo.price}
          {getCurrencyDisplay()}
        </Typography>

        {showTotalPrice && (
          <Typography variant="h6" className={classes.totalPrice}>
            {totalItemsPrice}
            {getCurrencyDisplay()}
          </Typography>
        )}
      </div>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.paymentCombo.name}
      </Typography>

      {packs.map((pack) => (
        <Typography variant="body2" color="textSecondary" align="left">
          - {pack}
        </Typography>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  priceContainer: {
    display: 'flex',
  },
  totalPrice: {
    textDecoration: 'line-through',
    marginLeft: theme.spacing(2),
  },
}));

export default PaymentPackComboItem;
