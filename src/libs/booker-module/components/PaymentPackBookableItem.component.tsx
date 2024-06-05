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
} from '#src/libs/payment-packs/types';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getValidityInfo } from '#src/libs/payment-packs/utils';
import Tooltip from '#src/components/Tooltip.component';

interface Props {
  paymentPack: (PaymentPack | PaymentPackTemplate) & Partial<MaxoutData>;
  isExcludingTax?: boolean;
  hideCredits?: boolean;
}

const PaymentPackItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  const dividedCreditsValue = getCreditsDividedValue(props.paymentPack.credits);
  const dividedCreditsDisplay = getCreditsDividedDisplay(
    props.paymentPack.credits,
  );
  const credits = !props.paymentPack.unlimited
    ? t('paymentPack:specifications.nbCredits', {
        credits: dividedCreditsDisplay,
        count: dividedCreditsValue,
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
                align="left"
                className={classes.creditText}
                variant="h6"
              >
                {credits}
              </Typography>
            )}
          </div>
          <Typography align="left" color="textSecondary" variant="body1">
            {date}
          </Typography>
          <Typography align="left" color="textPrimary" variant="body1">
            {props.paymentPack.name}
          </Typography>
        </div>
        <div>
          {/* @ts-expect-error */}
          {!!props.paymentPack.linked_private_pass && (
            <Tooltip title={t('form.paymentPack.universalPass.label')}>
              <IconButton onClick={null}>
                <StyleIcon
                  className={classNames({
                    [classes.opacity]: !!props.paymentPack.exceedsBookingMaxout,
                  })}
                  color="inherit"
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
