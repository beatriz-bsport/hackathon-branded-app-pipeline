import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentCombo } from '../types';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';
import { getPrice } from '#libs/theme/utils';

interface Props {
  paymentCombo: PaymentCombo;
  isExcludingTax?: boolean;
}

const PaymentPackComboItem = (props: Props) => {
  const classes = useStyles(['paymentPack']);

  const { isExcludingTax } = props;
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
      (acc, pp) =>
        acc +
        parseFloat(getPrice(pp.price, isExcludingTax, pp.tax)) * pp.quantity,
      0,
    ) +
    props.paymentCombo.shop_items.reduce(
      (acc, pp) =>
        acc +
        parseFloat(getPrice(pp.price, isExcludingTax, pp.tax)) * pp.quantity,
      0,
    ) +
    props.paymentCombo.private_passes.reduce(
      (acc, pp) =>
        acc +
        parseFloat(getPrice(pp.price, isExcludingTax, pp.tax)) * pp.quantity,
      0,
    );
  const paymentComboPrice = getPrice(
    props.paymentCombo.price,
    isExcludingTax,
    props.paymentCombo.tax,
  );
  if (totalItemsPrice > props.paymentCombo.price) {
    showTotalPrice = true;
  }
  return (
    <div className={classes.itemContainer}>
      <div className={classes.priceContainer}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(paymentComboPrice)}
        </Typography>

        {showTotalPrice && (
          <Typography variant="h6" className={classes.totalPrice}>
            {getCurrencyDisplayWithPrice(totalItemsPrice)}
          </Typography>
        )}
      </div>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.paymentCombo.name}
      </Typography>
      <TypographyWithShowMore
        maxCharacterCount={65}
        alignButtonRight
        component="div"
        multiline
        variant="body2"
        color="textPrimary"
      >
        {props.paymentCombo.description}
      </TypographyWithShowMore>

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
    width: '15rem',
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
