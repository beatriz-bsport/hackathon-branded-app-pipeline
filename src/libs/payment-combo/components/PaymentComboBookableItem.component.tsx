import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { getPrice } from '#libs/theme/utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentCombo } from '../types';
// @ts-expect-error
import TypographyWithShowMore from '../../../components/typo/TypographyWithShowMore.component';

interface Props {
  paymentCombo: PaymentCombo;
  isExcludingTax?: boolean;
}

const PaymentPackComboBookableItem = (props: Props) => {
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
        parseFloat(
          getPrice(
            pp.price,
            isExcludingTax,
            props.paymentCombo.use_payment_combo_tax_on_items
              ? props.paymentCombo.tax_calculation
              : pp.tax,
          ),
        ) *
          pp.quantity,
      0,
    ) +
    props.paymentCombo.shop_items.reduce(
      (acc, pp) =>
        acc +
        parseFloat(
          getPrice(
            pp.price,
            isExcludingTax,
            props.paymentCombo.use_payment_combo_tax_on_items
              ? props.paymentCombo.tax_calculation
              : pp.tax,
          ),
        ) *
          pp.quantity,
      0,
    ) +
    props.paymentCombo.private_passes.reduce(
      (acc, pp) =>
        acc +
        parseFloat(
          getPrice(
            pp.price,
            isExcludingTax,
            props.paymentCombo.use_payment_combo_tax_on_items
              ? props.paymentCombo.tax_calculation
              : pp.tax,
          ),
        ) *
          pp.quantity,
      0,
    );
  const paymentComboPrice = getPrice(
    props.paymentCombo.price,
    isExcludingTax,
    props.paymentCombo.tax_calculation,
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
          <Typography className={classes.totalPrice} variant="h6">
            {getCurrencyDisplayWithPrice(totalItemsPrice)}
          </Typography>
        )}
      </div>
      <Typography align="left" color="textPrimary" variant="body1">
        {props.paymentCombo.name}
      </Typography>
      <TypographyWithShowMore
        alignButtonRight
        multiline
        color="textPrimary"
        component="div"
        maxCharacterCount={65}
        variant="body2"
      >
        {props.paymentCombo.description}
      </TypographyWithShowMore>

      {packs.map((pack) => (
        <Typography
          key={pack}
          align="left"
          color="textSecondary"
          variant="body2"
        >
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

export default PaymentPackComboBookableItem;
