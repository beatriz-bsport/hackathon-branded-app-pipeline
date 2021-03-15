// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import {
  PAYMENT_INTENT_TYPE_INVOICE,
  PAYMENT_INTENT_TYPE_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
} from '@bsport/common/lib/master-data/payment-group';
import PaymentDialog from '../../payment/components/PaymentDialog.component';
import MemberBalanceUpdaterDialog from './MemberBalanceUpdaterDialog.component';
import { getCurrencyDisplay } from '../../theme/selectors';
import InvoiceTable from '../../invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../invoice/api';

type Props = {
  balance: string,
  invoiceLoading: boolean,
  goToInvoice: (string, ?Invoice) => void,
  unpaidInvoiceList: Array<Invoice>,
  memberId: number,
  asConsumer: boolean,
  applyBalanceToUnpaidInvoices: () => void,
  fetchInvoiceListUnpaid: () => void,
  availablePaymentMethodList: number[],
};

export const MemberBillingProblemCard = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'invoice']);
  const { balance, unpaidInvoiceList } = props;

  const [invoiceToBill, setInvoiceToBill] = React.useState(null);
  const [clientSecretLoading, setClientSecretLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState(null);
  const [clientSecretError, setClientSecretError] = React.useState(false);

  const [paymentGroupPriceCts, setPaymentGroupPriceCts] = React.useState(0);
  const [paymentGroupId, setPaymentGroupId] = React.useState(null);

  const [ajustBalanceOpen, setAdjustBalanceDialogOpen] = React.useState(false);
  const [regularizeFullDebt, setRegularizeFullDebt] = React.useState(false);
  const [amountToBill, setAmountToBill] = React.useState(null);

  const requestClientSecret = (paymentEngine) => {
    setClientSecret(null);
    setClientSecretLoading(true);
    setClientSecretError(false);
    requestClientSecretAPI(
      paymentEngine,
      invoiceToBill ? PAYMENT_INTENT_TYPE_INVOICE : PAYMENT_INTENT_TYPE_DEBT,
      {
        invoice: invoiceToBill ? invoiceToBill.uuid : null,
        member: props.memberId,
        requested_price_cts: amountToBill
          ? parseInt(parseFloat(amountToBill) * 100, 10)
          : null,
      },
    )
      .then((r) => {
        setClientSecretLoading(false);
        setClientSecret(r.data.client_secret);
        setPaymentGroupPriceCts(r.data.price_cts);
        setPaymentGroupId(r.data.payment_group);
        setClientSecretError(false);
      })
      .catch((err) => {
        console.error(err);
        setClientSecretLoading(false);
        setClientSecretError(true);
      });
  };

  let color = 'secondary';
  const parsedBalance = parseFloat(balance);
  if (parsedBalance > 0) {
    color = 'primary';
  }
  if (parsedBalance < 0) {
    color = 'error';
  }

  return (
    <Paper className={classes.accountBalanceBloc}>
      {!!(!props.asConsumer || (parsedBalance && parsedBalance < 0)) && (
        <div className={classes.padding}>
          <div className={classes.accountBalance}>
            <Typography variant="h6" inline>
              {t('creditAccountBalance')}
            </Typography>
            <div className={classes.buttonContainer}>
              <Typography inline variant="h6" component="span" color={color}>
                {` ${balance} ${getCurrencyDisplay()}`}
              </Typography>
              <Button
                onClick={() => {
                  if (props.asConsumer) {
                    setAmountToBill(Math.abs(parseFloat(balance)));
                  } else {
                    setAdjustBalanceDialogOpen(true);
                  }
                }}
                variant="outlined"
                color="primary"
              >
                {t(props.asConsumer ? 'regularizeBalance' : 'adjustBalance')}
              </Button>
            </div>
          </div>
          {!props.asConsumer &&
            !!props.applyBalanceToUnpaidInvoices &&
            props.balance > 0 &&
            !!unpaidInvoiceList.length && (
              <div className={classes.applyBalanceToUnpaidButtonContainer}>
                <Button
                  variant="outlined"
                  style={{ width: '100%' }}
                  onClick={props.applyBalanceToUnpaidInvoices}
                >
                  {t('member:applyBalanceToUnpaidInvoices')}
                </Button>
              </div>
            )}
        </div>
      )}
      {!!unpaidInvoiceList.length && (
        <React.Fragment>
          <Divider className={classes.divider} />
          <div className={classes.invoiceContainer}>
            <Typography className={classes.padding} variant="h6" inline>
              {t('unpaidInvoiceTitle', { count: unpaidInvoiceList.length })}
            </Typography>
            <InvoiceTable
              asConsumer={props.asConsumer}
              compactMode
              hideMemberName
              loading={props.invoiceLoading}
              onBill={setInvoiceToBill}
              hidePagination
              invoiceList={unpaidInvoiceList}
              onClickInvoice={props.goToInvoice}
              showOpenInvoiceNested
            />
          </div>
        </React.Fragment>
      )}
      {!!unpaidInvoiceList &&
        unpaidInvoiceList.length >= 1 &&
        !props.asConsumer && (
          <div className={classes.payAllButtonContainer}>
            <Button
              className={classes.payAllButton}
              color="primary"
              variant="outlined"
              onClick={() => setRegularizeFullDebt(true)}
            >
              {t('invoice:paymentPanel.actions.payAll')}
            </Button>
          </div>
        )}
      {!!ajustBalanceOpen && (
        <MemberBalanceUpdaterDialog
          open
          initialValue={parseFloat(props.balance)}
          onClose={() => setAdjustBalanceDialogOpen(false)}
          onSubmit={(arg) => {
            setAmountToBill(arg);
            setAdjustBalanceDialogOpen(false);
          }}
        />
      )}
      {(!!invoiceToBill || !!amountToBill || !!regularizeFullDebt) && (
        <PaymentDialog
          memberId={props.memberId}
          onError={() => {}}
          paymentGroupPriceCts={paymentGroupPriceCts}
          onSuccess={(callback) => {
            props.fetchInvoiceListUnpaid();
            setInvoiceToBill(null);
            setAmountToBill(null);
            setRegularizeFullDebt(false);
            if (typeof callback === 'function') callback();
          }}
          requestClientSecret={requestClientSecret}
          termsAndConditionsAccepted
          clientSecret={clientSecretLoading ? null : clientSecret}
          clientSecretLoading={clientSecretLoading}
          paymentGroupId={paymentGroupId}
          onlyInternal={amountToBill && amountToBill < 0}
          asConsumer={props.asConsumer}
          clientSecretError={clientSecretError}
          amountToPay={
            invoiceToBill
              ? parseFloat(
                  invoiceToBill.amount_due_cts - invoiceToBill.amount_paid_cts,
                ).toFixed(2)
              : Math.round(amountToBill * 100)
          }
          onCancel={() => {
            setInvoiceToBill(null);
            setAmountToBill(0);
            setRegularizeFullDebt(false);
          }}
          availablePaymentMethodList={
            props.availablePaymentMethodList.length
              ? props.availablePaymentMethodList
              : [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]
          }
        />
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  accountBalance: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
  },
  applyBalanceToUnpaidButtonContainer: {
    padding: theme.spacing(2),
    paddingLeft: 0,
  },
  padding: {
    paddingLeft: theme.spacing(2),
    width: '100%',
  },
  regularize: {
    marginTop: theme.spacing(1),
  },
  divider: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  visibilityIcon: {
    marginLeft: theme.spacing.unit,
  },
  invoiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  accountBalanceBloc: {
    // backgroundColor: '#F8F8F8',
    // border: '2px solid #E8E8E8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '&>*': {
      marginLeft: theme.spacing(2),
    },
  },
  payAllButtonContainer: {
    display: 'flex',
    alignItems: 'stretch',
    padding: theme.spacing(1),
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  // payAllButton: { width: '100%' },
}));

export default MemberBillingProblemCard;
