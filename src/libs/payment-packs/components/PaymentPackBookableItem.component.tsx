import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPack } from '../types';
import { getValidityInfo } from '../utils';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

interface Props {
  paymentPack: PaymentPack;
  isExcludingTax: boolean;
}

const PaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const credits = !props.paymentPack.unlimited
    ? t('paymentPack:specifications.nbCredits', {
        count: props.paymentPack.credits,
        credits: props.paymentPack.credits,
      })
    : t('paymentPack:specifications.unlimitedCredits');

  const date = getValidityInfo(props.paymentPack, t);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(
            props.paymentPack.price,
            props.isExcludingTax,
            props.paymentPack.tax,
          )}
        </Typography>
        <Typography align="left" className={classes.creditText} variant="h6">
          {credits}
        </Typography>
      </div>
      <Typography align="left" color="textSecondary" variant="body1">
        {date}
      </Typography>
      <Typography align="left" color="textPrimary" variant="body1">
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
