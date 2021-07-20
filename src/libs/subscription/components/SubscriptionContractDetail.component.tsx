// @flow

import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';
import PaymentComboListItem from '../../payment-combo/components/PaymentComboListItem.component';
import { getCurrencyDisplay } from '../../theme/selectors';
import type { Contract } from '../types';

type Props = {
  contract: Contract;
};

const SubscriptionContractDetail = (props: Props) => {
  const {
    name,
    nb_interval,
    recurrent_price,
    interval,
    flat_fee,
    description,
    contract,
    payment_pack,
    private_pass,
    payment_combo,
  } = props.contract;
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  return (
    <div>
      <Paper className={classes.paperContainer}>
        <Typography variant="h4" className={classes.title}>
          {name}
        </Typography>
        <div className={classes.row}>
          <div className={classes.pricesContainer}>
            <Typography variant="h4">
              {t('contract.duration', { month: nb_interval })}
            </Typography>
            <Typography variant="legend" align="left">
              {`${t('contract.billingFrequency')} : ${t(
                `contract.frequency.${interval}`,
              )}`}
            </Typography>
          </div>
          <div className={classes.pricesContainer}>
            <Typography variant="h6" align="right">
              {`${t(
                'contract.form.recurrent_price.label',
              )} : ${recurrent_price}${getCurrencyDisplay()}`}
            </Typography>
            <Typography variant="h6" align="right">
              {`${t(
                'parameters.flat_fee',
              )} : ${flat_fee}${getCurrencyDisplay()}`}
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
          <Typography>{description}</Typography>
        </div>
        <div className={classes.block}>
          <Typography variant="h6">{t('contract.legal')}</Typography>
          <Typography>{contract}</Typography>
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
