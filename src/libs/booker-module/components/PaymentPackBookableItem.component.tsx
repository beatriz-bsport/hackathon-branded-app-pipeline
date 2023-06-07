// @ts-nocheck
import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import StyleIcon from '@material-ui/icons/Style';
import IconButton from '@material-ui/core/IconButton';
import {
  PaymentPack,
  PaymentPackTemplate,
  MaxoutData,
} from '../../payment-packs/types';
import { getValidityInfo } from '../../payment-packs/utils';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import Tooltip from '#components/Tooltip.component';

interface Props {
  paymentPack: (PaymentPack | PaymentPackTemplate) & Partial<MaxoutData>;
  isExcludingTax?: boolean;
  hideCredits?: boolean;
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
        <div
          className={classNames({
            [classes.opacity]: !!props.paymentPack.exceedsBookingMaxout,
          })}
        >
          <div className={classes.priceRow}>
            <Typography variant="h6">
              {getCurrencyDisplayWithPrice(
                props.paymentPack.price,
                props.isExcludingTax,
                props.paymentPack.tax,
              )}
            </Typography>
            {!props.hideCredits && (
              <Typography
                className={classes.creditText}
                variant="h6"
                align="left"
              >
                {credits}
              </Typography>
            )}
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
                <StyleIcon
                  color="inherit"
                  className={classNames({
                    [classes.opacity]: !!props.paymentPack.exceedsBookingMaxout,
                  })}
                />
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
  opacity: {
    opacity: 0.5,
  },
}));

export default PaymentPackItem;
