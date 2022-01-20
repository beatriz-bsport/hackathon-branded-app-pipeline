// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as Sentry from '@sentry/react';

import {
  PAYMENT_INTENT_TYPE_INVOICE,
  PAYMENT_INTENT_TYPE_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group';
import PaymentDialog from '../../payment/components/PaymentDialog.component';
import MemberBalanceUpdaterDialog from './MemberBalanceUpdaterDialog.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import InvoiceTable from '../../invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../invoice/api';
import {
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  setBillingEstablishmentOnCompletedPaymentGroupStatus as setBillingEstablishmentOnCompletedPaymentGroupStatusAPI,
} from '../../payment/api';
import type { Member } from '../types';
import type { Establishment } from '../../establishment/types';
import type { Invoice } from '#libs/invoice/types';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import type { OptionCallback } from '../../../state/types';

type Props = {
  balance: number;
  invoiceLoading: boolean;
  goToInvoice: (uuid: string, invoice?: Invoice) => void;
  unpaidInvoiceList: Array<Invoice>;
  memberId: number;
  member: Member;
  memberLoading: boolean;
  asConsumer: boolean;
  applyBalanceToUnpaidInvoices: () => void;
  fetchInvoiceListUnpaid: () => void;
  availablePaymentMethodList: number[];
  adjustCreditWithoutPaymentNote: (c: number) => void;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  establishments: Array<Establishment>;
  enableMultiLocalization: boolean;
  selectedInvoiceId: string;
  companyId?: number;
  onInvoicePaymentDialogClose: () => void;
  applyBalanceToInvoice?: (uuid: string, options?: OptionCallback) => void;
  allowConsumerToUseInternalAccount?: boolean;
  creditAccountBalance?: number | null;
  applyBalanceLoading?: boolean;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  showPositiveBalance?: boolean;
};

const PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY = 100;
export const MemberBillingProblemCard = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'invoice']);
  const { balance, unpaidInvoiceList } = props;

  const [invoiceToBill, setInvoiceToBill] = React.useState<Invoice | null>(
    null,
  );
  React.useEffect(
    () =>
      setInvoiceToBill(
        props.unpaidInvoiceList.find((i) => i.uuid === props.selectedInvoiceId),
      ),
    [props.unpaidInvoiceList, props.selectedInvoiceId],
  );
  const [clientSecretLoading, setClientSecretLoading] =
    React.useState<boolean>(false);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [clientSecretError, setClientSecretError] =
    React.useState<boolean>(false);

  const [paymentGroupPriceCts, setPaymentGroupPriceCts] =
    React.useState<number>(0);
  const [paymentGroupId, setPaymentGroupId] = React.useState<number | null>(
    null,
  );

  const [ajustBalanceOpen, setAdjustBalanceDialogOpen] =
    React.useState<boolean>(false);
  const [regularizeFullDebt, setRegularizeFullDebt] =
    React.useState<boolean>(false);
  const [amountToBill, setAmountToBill] = React.useState<string | null>(null);
  const [billingEstablishmentId, setBillingEstablishmentId] =
    React.useState(null);
  const [paymentGroupCompletedCheckSeconds] = React.useState<number>(0.5);
  const [retryPaymentGroupStatus, setRetryPaymentGroupStatus] =
    React.useState<number>(0);
  const requestClientSecret = (paymentEngine: number) => {
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
        Sentry.captureException(err);
      });
  };
  const listenPaymentGroupCompleted = (callback?: () => void) => {
    getPaymentGroupStatusAPI(paymentGroupId)
      .then((r) => {
        if (retryPaymentGroupStatus > PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY) {
          return;
        }
        if (r.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
          setTimeout(() => {
            setBillingEstablishmentOnCompletedPaymentGroupStatusAPI(
              paymentGroupId,
              billingEstablishmentId,
            );
            if (callback) callback();
          }, 2000);
        } else {
          setRetryPaymentGroupStatus(retryPaymentGroupStatus + 1);
          setTimeout(
            listenPaymentGroupCompleted,
            paymentGroupCompletedCheckSeconds * 2000,
          );
        }
      })
      .catch(console.error);
  };

  const applyBalanceToInvoice = (options: OptionCallback) =>
    invoiceToBill?.uuid &&
    props.applyBalanceToInvoice(invoiceToBill?.uuid, options);

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
            <Typography variant="h6">{t('creditAccountBalance')}</Typography>
            <div className={classes.buttonContainer}>
              <Typography inline variant="h6" component="span" color={color}>
                {` ${getCurrencyDisplayWithPrice(balance)}`}
              </Typography>
              {props.memberLoading && (
                <CircularProgress size={24} color="primary" />
              )}
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
                disabled={props.memberLoading}
              >
                {t(props.asConsumer ? 'regularizeBalance' : 'adjustBalance')}
              </Button>
            </div>
          </div>

          {false &&
            !props.asConsumer &&
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
          {props.showPositiveBalance && (
            <div className={classes.padding}>
              <div className={classes.accountBalance}>
                <Typography variant="h6">
                  {t('creditAccountBalance')}
                </Typography>
                <div className={classes.buttonContainer}>
                  <Typography
                    inline
                    variant="h6"
                    component="span"
                    color={color}
                  >
                    {` ${getCurrencyDisplayWithPrice(balance)}`}
                  </Typography>
                  {props.memberLoading && (
                    <CircularProgress size={24} color="primary" />
                  )}
                  <Button variant="outlined" color="primary" disabled>
                    {t(
                      props.asConsumer ? 'regularizeBalance' : 'adjustBalance',
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <Divider className={classes.divider} />
          <div className={classes.invoiceContainer}>
            <Typography className={classes.padding} variant="h6">
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
              companyId={props.companyId}
              snackbarSuccess={props.snackbarSuccessMsg}
              applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
              consumerGiftcardList={props.consumerGiftcardList}
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
          asManager={props.asConsumer === false}
          onSubmit={(arg, withoutPaymentNote) => {
            if (withoutPaymentNote) {
              props.adjustCreditWithoutPaymentNote(arg);
              setAdjustBalanceDialogOpen(false);
            } else {
              setAmountToBill(arg);
              setAdjustBalanceDialogOpen(false);
            }
          }}
          establishments={props.establishments}
          billingEstablishmentId={billingEstablishmentId}
          setBillingEstablishmentId={setBillingEstablishmentId}
          enableMultiLocalization={props.enableMultiLocalization}
        />
      )}
      {(!!invoiceToBill || !!amountToBill || !!regularizeFullDebt) && (
        <PaymentDialog
          memberId={props.memberId}
          onError={() => {}}
          paymentGroupPriceCts={paymentGroupPriceCts}
          onSuccess={(callback?: () => void) => {
            props.fetchInvoiceListUnpaid();
            setInvoiceToBill(null);
            setAmountToBill(null);
            setRegularizeFullDebt(false);
            listenPaymentGroupCompleted();
            if (typeof callback === 'function') callback();
            if (props.onInvoicePaymentDialogClose)
              props.onInvoicePaymentDialogClose();
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
            if (props.onInvoicePaymentDialogClose)
              props.onInvoicePaymentDialogClose();
          }}
          availablePaymentMethodList={
            props.availablePaymentMethodList.length
              ? props.availablePaymentMethodList
              : [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]
          }
          detachPaymentMethod={props.detachPaymentMethod}
          detachPaymentMethodLoading={props.detachPaymentMethodLoading}
          snackbarErrorMsg={props.snackbarErrorMsg}
          snackbarSuccessMsg={props.snackbarSuccessMsg}
          defaultUserName={props.member ? props.member.name : ''}
          defaultUserEmail={props.member ? props.member.email : ''}
          establishments={props.establishments}
          allowConsumerToUseInternalAccount={
            props.allowConsumerToUseInternalAccount
          }
          applyBalanceToInvoice={applyBalanceToInvoice}
          creditAccountBalance={props.creditAccountBalance}
          applyBalanceLoading={props.applyBalanceLoading}
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
    marginLeft: theme.spacing(1),
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
