import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { PaymentCombo } from '../../payment-combo/types';
import { MaxoutData } from '../../payment-packs/types';
// @ts-expect-error
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
        <Typography align="left" color="textPrimary" variant="body1">
          {props.paymentCombo.name}
        </Typography>
        <TypographyWithShowMore
          multiline
          color="textPrimary"
          component="div"
          maxCharacterCount={100}
          style={{ textAlign: 'left' }}
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
