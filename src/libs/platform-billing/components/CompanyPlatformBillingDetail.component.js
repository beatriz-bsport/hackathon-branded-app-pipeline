// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { withState, compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PlatformInvoiceListItem from './PlatformInvoiceListItem.component';
import PaymentMethodListItem from '../../payment/components/PaymentMethodListItem.component';
import CollectPaymentMethod from '../../payment/components/CollectPaymentMethod.component';

type Props = {
  platformInvoiceList: Array<PlatformInvoice>,
  collectPaymentMethodCBIsOpen: boolean,
  collectPaymentMethodSepaIsOpen: boolean,
  paymentMethodList: Array<PaymentMethod>,
  setCollectPaymentMethodCBIsOpen: (boolean) => void,
  setCollectPaymentMethodSepaIsOpen: (boolean) => void,
  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
};

export const CompanyPlatformBillingDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  return (
    <div className={classes.container}>
      <Grid container>
        <Grid xs={12} sm={6} className={classes.leftColumn}>
          <Typography variant="h4" className={classes.sectionTitle}>
            {t('paymentMethod.sectionTitle')}
          </Typography>
          {props.paymentMethodList.length ? (
            <Paper>
              <PaymentMethodListItem
                paymentMethod={props.paymentMethodList[0]}
              />
            </Paper>
          ) : (
            <div className={classes.addPaymentMethodButtonRow}>
              <Button
                onClick={() => props.setCollectPaymentMethodSepaIsOpen(true)}
                variant="outlined"
              >
                {t('paymentMethod.actions.createSepa')}
              </Button>
              <Button
                onClick={() => props.setCollectPaymentMethodCBIsOpen(true)}
                variant="outlined"
              >
                {t('paymentMethod.actions.createCard')}
              </Button>
            </div>
          )}
          {props.collectPaymentMethodSepaIsOpen && (
            <CollectPaymentMethod
              requestSetupIntentSecret={props.requestSetupIntentSecret}
              paymentMethodType="sepa_debit"
              setAsDefault
              refreshSavedPaymentMethodList={
                props.refreshSavedPaymentMethodList
              }
              onClose={() => props.setCollectPaymentMethodSepaIsOpen(false)}
            />
          )}
          {props.collectPaymentMethodCBIsOpen && (
            <CollectPaymentMethod
              requestSetupIntentSecret={props.requestSetupIntentSecret}
              paymentMethodType="card"
              setAsDefault
              refreshSavedPaymentMethodList={
                props.refreshSavedPaymentMethodList
              }
              onClose={() => props.setCollectPaymentMethodCBIsOpen(false)}
            />
          )}
        </Grid>

        <Grid xs={12} sm={6}>
          <Typography variant="h4" className={classes.sectionTitle}>
            {t('platformInvoice.sectionTitle')}
          </Typography>
          {!props.platformInvoiceList.length ? (
            <Typography color="textSecondary">
              {t('platformInvoice.noInvoice')}
            </Typography>
          ) : (
            <Paper>
              {props.platformInvoiceList.map((pi) => (
                <PlatformInvoiceListItem platformInvoice={pi} key={pi.id} />
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
  },
  addPaymentMethodButtonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(2),
    },
  },
  leftColumn: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default compose(
  withState(
    'collectPaymentMethodSepaIsOpen',
    'setCollectPaymentMethodSepaIsOpen',
    false,
  ),
  withState(
    'collectPaymentMethodCBIsOpen',
    'setCollectPaymentMethodCBIsOpen',
    false,
  ),
)(CompanyPlatformBillingDetail);
