import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPack } from '../types';
import { getValidityInfo } from '../utils';

interface Props {
  paymentPack: PaymentPack;
}

const PaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const credits = !props.paymentPack.unlimited
    ? t('paymentPack:specifications.nbCredits', {
        credits: props.paymentPack.credits,
      })
    : t('paymentPack:specifications.unlimitedCredits');

  const price = t('paymentPack:specifications.price', {
    price: props.paymentPack.price,
  });

  const date = getValidityInfo(props.paymentPack, t);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">{price}</Typography>
        <Typography className={classes.creditText} variant="h6" align="left">
          {credits}
        </Typography>
      </div>
      <Typography variant="body1" color="textSecondary" align="left">
        {date}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.paymentPack.name}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  creditText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export default PaymentPackItem;
