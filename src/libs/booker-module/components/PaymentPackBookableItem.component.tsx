import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPack, PaymentPackTemplate } from '../../payment-packs/types';
import { getValidityInfo } from '../../payment-packs/utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

interface Props {
  paymentPack: PaymentPack | PaymentPackTemplate;
}

const PaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const credits = !props.paymentPack.unlimited
    ? t('paymentPack:specifications.nbCredits', {
        credits: props.paymentPack.credits,
        count: props.paymentPack.credits,
      })
    : t('paymentPack:specifications.unlimitedCredits');

  const date = getValidityInfo(props.paymentPack, t);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(props.paymentPack.price)}
        </Typography>
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
