import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentCombo } from '../../payment-combo/types';
import TypographyWithShowMore from '../../../components/TypographyWithShowMore.component';

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

  return (
    <div className={classes.itemContainer}>
      <Typography variant="h6">
        {getCurrencyDisplayWithPrice(props.paymentCombo.price)}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.paymentCombo.name}
      </Typography>
      <TypographyWithShowMore
        maxCharacterCount={100}
        component="div"
        multiline
        variant="body2"
        color="textPrimary"
        style={{ textAlign: 'left' }}
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

const useStyles = makeStyles(() => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export default PaymentPackComboItem;
