// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { withState, compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PlatformInvoiceListItem from './PlatformInvoiceListItem.component';
import PaymentMethodListItem from '../../payment/components/PaymentMethodListItem.component';
import CollectPaymentMethod from '../../payment/components/CollectPaymentMethod.component';

import { getCurrencyCode } from '../../theme/selectors';

type Props = {
  platformInvoiceList: Array<PlatformInvoice>,
  collectPaymentMethodCBIsOpen: boolean,
  collectPaymentMethodSepaIsOpen: boolean,
  paymentMethodList: Array<PaymentMethod>,
  setCollectPaymentMethodCBIsOpen: (boolean) => void,
  setCollectPaymentMethodSepaIsOpen: (boolean) => void,
  requestSetupIntentSecret: () => void,
  refreshSavedPaymentMethodList: () => void,
  onCollectPaymentMethodSuccess: ?() => void,
  sepaDefaultName?: string,
  sepaDefaultEmail?: string,
  payNowInvoice: (payment_backend_id: string) => void,
};

export const CompanyPlatformBillingDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  return (
    <Grid direction="row" container className={classes.container}>
      <Grid item xs={12} md={6} className={classes.leftColumn}>
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
              <PlatformInvoiceListItem
                divider
                platformInvoice={pi}
                key={pi.id}
                hasPaymentMethod={!!props.paymentMethodList?.length}
                payNowInvoice={props.payNowInvoice}
              />
            ))}
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} md={6} className={classes.leftColumn}>
        <Typography variant="h4" className={classes.sectionTitle}>
          {t('paymentMethod.sectionTitle')}
        </Typography>
        {!!props.paymentMethodList.length && (
          <Paper>
            {props.paymentMethodList.map((paymentMethod) => (
              <PaymentMethodListItem
                paymentMethod={paymentMethod}
                key={paymentMethod.id}
              />
            ))}
          </Paper>
        )}
        <div className={classes.addPaymentMethodButtonRow}>
          {(getCurrencyCode() || '').toLowerCase() === 'eur' && (
            <Button
              onClick={() => props.setCollectPaymentMethodSepaIsOpen(true)}
              variant="outlined"
            >
              {t('paymentMethod.actions.createSepa')}
            </Button>
          )}
          <Button
            onClick={() => props.setCollectPaymentMethodCBIsOpen(true)}
            variant="outlined"
          >
            {t('paymentMethod.actions.createCard')}
          </Button>
        </div>
        {props.collectPaymentMethodSepaIsOpen && (
          <CollectPaymentMethod
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            paymentMethodType="sepa_debit"
            setAsDefault
            onSuccess={props.onCollectPaymentMethodSuccess}
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            onClose={() => props.setCollectPaymentMethodSepaIsOpen(false)}
            defaultName={props.sepaDefaultName}
            defaultEmail={props.sepaDefaultEmail}
          />
        )}
        {props.collectPaymentMethodCBIsOpen && (
          <CollectPaymentMethod
            requestSetupIntentSecret={props.requestSetupIntentSecret}
            onSuccess={props.onCollectPaymentMethodSuccess}
            paymentMethodType="card"
            setAsDefault
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            onClose={() => props.setCollectPaymentMethodCBIsOpen(false)}
          />
        )}
      </Grid>
    </Grid>
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
    marginTop: theme.spacing(2),
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
