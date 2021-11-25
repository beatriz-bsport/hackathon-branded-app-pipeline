// @flow

import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import TypographyMultiline from '../../../components/TypographyMultiline.component';
import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';
import PaymentComboListItem from '../../payment-combo/components/PaymentComboListItem.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { Contract } from '../types';

type Props = {
  contract: Contract;
};

const SubscriptionContractDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  if (!props.contract) {
    return (
      <Paper className={classes.paperContainerEmpty}>
        <LinearProgress />
      </Paper>
    );
  }
  const {
    name,
    recurrent_price,
    recurrence_basis,
    interval,
    flat_fee,
    description,
    contract,
    payment_pack,
    private_pass,
    payment_combo,
  } = props.contract;
  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography variant="h4" className={classes.title}>
          {name}
        </Typography>
        <div className={classes.row}>
          <div className={classes.pricesContainer}>
            <Typography variant="h6">
              {`${t(
                'contract.form.recurrent_price.label',
              )} : ${getCurrencyDisplayWithPrice(recurrent_price)}`}
            </Typography>
            <Typography variant="body1" color="textSecondary" align="left">
              {t(`contract.item.intervalLabel.${interval}`, {
                count: recurrence_basis,
              })}
            </Typography>
            <Typography variant="body1">
              {`${t('parameters.flat_fee')} : ${getCurrencyDisplayWithPrice(
                flat_fee,
              )}`}
            </Typography>
          </div>
        </div>
        {!!payment_pack && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.paymentPack')}</Typography>
            <PaymentPackListItem pack={payment_pack} divider hidePacksNumber />
          </div>
        )}
        {!!private_pass && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.privatePass')}</Typography>
            <PrivatePassListItem divider pass={private_pass} />
          </div>
        )}
        {!!payment_combo && (
          <div className={classes.block}>
            <Typography variant="h6">{t('contract.paymentCombo')}</Typography>
            <PaymentComboListItem paymentCombo={payment_combo} divider />
          </div>
        )}
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.description')}</Typography>
          <TypographyMultiline>{description}</TypographyMultiline>
        </div>
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.legal')}</Typography>
          <TypographyMultiline>{contract}</TypographyMultiline>
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paperContainerEmpty: {
    padding: theme.spacing(8),
    width: '100%',
  },
  paperContainer: {
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  pricesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  block: {
    marginBottom: theme.spacing(3),
  },
}));

export default SubscriptionContractDetail;
