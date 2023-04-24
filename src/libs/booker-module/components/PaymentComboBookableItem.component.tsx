// @ts-nocheck
import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentCombo } from '../../payment-combo/types';
import { MaxoutData } from '../../payment-packs/types';
import TypographyWithShowMore from '../../../components/typo/TypographyWithShowMore.component';

interface Props {
  paymentCombo: PaymentCombo & Partial<MaxoutData>;
  isExcludingTax?: boolean;
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
    <div className={classes.rowContainer}>
      <div
        className={classNames(classes.itemContainer, {
          [classes.opacity]: !!props.paymentCombo.exceedsBookingMaxout,
        })}
      >
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(
            props.paymentCombo.price,
            props.isExcludingTax,
            props.paymentCombo.tax_calculation,
          )}
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
    </div>
  );
};

const useStyles = makeStyles(() => ({
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  opacity: {
    opacity: 0.5,
  },
}));

export default PaymentPackComboItem;
