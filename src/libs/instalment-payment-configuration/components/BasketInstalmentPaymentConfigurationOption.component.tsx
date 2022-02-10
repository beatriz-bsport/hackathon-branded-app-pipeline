import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Radio, Typography, Collapse } from '@material-ui/core';
import moment from 'moment';
import chroma from 'chroma-js';
import { InstalmentPayment } from '../types';
import InstalmentPaymentMultiplyIcon from './InstalmentPaymentConfigurationMultiplyIcon.component';
import { DAILY, MONTHLY, WEEKLY } from '../constants';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type OwnProps = {
  checked: boolean;
  instalmentPayment: InstalmentPayment;
  basketPrice: number;
  disabled: boolean;
};
type ShortandMoment = 'y' | 'd' | 'w' | 'M';
type Props = OwnProps;
export const BasketInstalmentPaymentOption: React.FC<Props> = (props) => {
  const { t } = useTranslation(['instalmentPayment']);
  const { checked, instalmentPayment, basketPrice } = props;
  const classes = useStyles({ checked });
  if (instalmentPayment === null) {
    return (
      <div className={classes.container}>
        <div className={classes.row}>
          <Radio
            onChange={props.onSelect}
            color="primary"
            disabled={props.disabled}
            checked={checked}
          />
          <Typography>{t('paymentAllInOnce')}</Typography>
          <InstalmentPaymentMultiplyIcon multiplyFactor={1} />
        </div>
      </div>
    );
  }

  if (!instalmentPayment) {
    return null;
  }
  const { recurrency, frequency, number_of_billing } = instalmentPayment;

  let shorthandRecurrency = 'y' as ShortandMoment;

  switch (recurrency) {
    case DAILY:
      shorthandRecurrency = 'd';
      break;
    case WEEKLY:
      shorthandRecurrency = 'w';
      break;
    case MONTHLY:
      shorthandRecurrency = 'M';
      break;

    default:
      break;
  }
  const instalmentDateList = new Array(number_of_billing)
    .fill(0)
    .map((item, index) =>
      moment()
        .add(frequency * index, shorthandRecurrency)
        .format('L'),
    );
  const instalmentAmount = (basketPrice / number_of_billing).toFixed(2);
  const lastInstalmentAmount = (
    basketPrice -
    parseFloat(instalmentAmount) * (number_of_billing - 1)
  ).toFixed(2);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Radio
          disabled={props.disabled}
          onChange={() => {
            if (!checked && !!props.onSelect) {
              props.onSelect(instalmentPayment.id);
            }
          }}
          color="primary"
          checked={checked}
        />
        <Typography>{instalmentPayment.name}</Typography>
        <InstalmentPaymentMultiplyIcon
          multiplyFactor={instalmentPayment.number_of_billing}
        />
      </div>
      <Collapse in={checked}>
        <div className={classes.column}>
          {instalmentDateList.map((date, index) => (
            <div className={classes.row}>
              <Typography variant="caption">{date}</Typography>
              <Typography variant="caption" color="textSecondary">
                {`${t(':')} ${getCurrencyDisplayWithPrice(
                  index === instalmentDateList.length - 1
                    ? lastInstalmentAmount
                    : instalmentAmount,
                )}`}
              </Typography>
            </div>
          ))}
          {/*
          <div className={classes.row}>
            <Typography variant="subtitle1">{t('basket.fee')}</Typography>
            <Typography>
              {getCurrencyDisplayWithPrice(instalmentPayment.fee)}
            </Typography>
            </div>
            */}
        </div>
      </Collapse>
    </div>
  );
};
const useStyles = makeStyles<Theme, { checked: boolean }>((theme) => ({
  container: (props: { checked: boolean }) => ({
    backgroundColor: props.checked
      ? chroma(theme.palette.primary.main).alpha(0.05)
      : 'unset',
    border: '1px solid #D4D4D4',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  }),
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(6),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}));
export default BasketInstalmentPaymentOption;
