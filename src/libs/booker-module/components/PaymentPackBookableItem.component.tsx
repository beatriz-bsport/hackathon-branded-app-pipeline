import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import StyleIcon from '@material-ui/icons/Style';
import IconButton from '@material-ui/core/IconButton';
import { PaymentPack, PaymentPackTemplate } from '../../payment-packs/types';
import { getValidityInfo } from '../../payment-packs/utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import Tooltip from '#components/Tooltip.component';

interface Props {
  paymentPack: PaymentPack | PaymentPackTemplate;
  isExcludingTax?: boolean;
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
        <div>
          <div className={classes.priceRow}>
            <Typography variant="h6">
              {getCurrencyDisplayWithPrice(
                props.paymentPack.price,
                props.isExcludingTax,
                props.paymentPack.tax,
              )}
            </Typography>
            <Typography
              className={classes.creditText}
              variant="h6"
              align="left"
            >
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
        <div>
          {!!props.paymentPack.linked_private_pass && (
            <Tooltip title={t('form.paymentPack.universalPass.label')}>
              <IconButton onClick={null}>
                <StyleIcon color="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
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
  priceRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  creditText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export default PaymentPackItem;
