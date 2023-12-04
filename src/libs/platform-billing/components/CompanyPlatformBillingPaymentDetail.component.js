// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { withState, compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import PlatformInvoiceListItem from './PlatformInvoiceListItem.component';
import PaymentMethodList from '../../payment/components/payment-method-list/PaymentMethodList.component';
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
  defaultCurrencyDisplay: string,
  cardBillingDetailsMandatory: boolean,
};

export const CompanyPlatformBillingDetail = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['platformBilling']);
  return (
    <Grid container className={classes.container} direction="row">
      <Grid item className={classes.leftColumn} md={6} xs={12}>
        <Typography className={classes.sectionTitle} variant="h4">
          {t('platformInvoice.sectionTitle')}
        </Typography>
        <Divider className={classes.divider} />

        {!props.platformInvoiceList.length ? (
          <Typography color="textSecondary">
            {t('platformInvoice.noInvoice')}
          </Typography>
        ) : (
          <Paper>
            {props.platformInvoiceList.map((pi) => (
              <PlatformInvoiceListItem
                key={pi.id}
                divider
                defaultCurrencyDisplay={props.defaultCurrencyDisplay}
                hasPaymentMethod={!!props.paymentMethodList?.length}
                payNowInvoice={props.payNowInvoice}
                platformInvoice={pi}
              />
            ))}
          </Paper>
        )}
      </Grid>
      <Grid item className={classes.leftColumn} md={6} xs={12}>
        <Typography className={classes.sectionTitle} variant="h4">
          {t('paymentMethod.sectionTitle')}
        </Typography>
        <Divider className={classes.divider} />

        <Alert className={classes.divider} severity="info">
          {`${t('paymentMethod.info.content')} `}
          <Link className={classes.link} to="/settings/company">
            {t('paymentMethod.info.link')}
          </Link>
          .
        </Alert>

        {!!props.paymentMethodList?.length && (
          <PaymentMethodList
            onlyDefault
            cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            savedPaymentMethodList={props.paymentMethodList}
          />
        )}
        <div className={classes.addPaymentMethodButtonRow}>
          {window.location.href.includes('show-iban=true') &&
            (getCurrencyCode() || '').toLowerCase() === 'eur' && (
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
        {window.location.href.includes('show-iban=true') &&
          props.collectPaymentMethodSepaIsOpen && (
            <CollectPaymentMethod
              setAsDefault
              defaultEmail={props.sepaDefaultEmail}
              defaultName={props.sepaDefaultName}
              onClose={() => props.setCollectPaymentMethodSepaIsOpen(false)}
              onSuccess={props.onCollectPaymentMethodSuccess}
              paymentMethodType="sepa_debit"
              refreshSavedPaymentMethodList={
                props.refreshSavedPaymentMethodList
              }
              requestSetupIntentSecret={props.requestSetupIntentSecret}
            />
          )}
        {props.collectPaymentMethodCBIsOpen && (
          <CollectPaymentMethod
            setAsDefault
            onClose={() => props.setCollectPaymentMethodCBIsOpen(false)}
            onSuccess={props.onCollectPaymentMethodSuccess}
            paymentMethodType="card"
            refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
            requestSetupIntentSecret={props.requestSetupIntentSecret}
          />
        )}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  divider: {
    marginBottom: theme.spacing(2),
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
  link: {
    textDecoration: 'underline',
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
    },
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
