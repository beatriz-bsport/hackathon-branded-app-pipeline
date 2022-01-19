import React, { FC } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {
  INVOICE_TYPE_REGULAR,
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER as INVOICE_TYPE_RECEIPT,
  INVOICE_TYPE_REVERSE,
} from '@bsport/common/lib/master-data/invoice-type';
import { PAYMENT_ENGINE_BSPORT } from '@bsport/common/lib/master-data/payment-group';
import { PLANNED_PAYMENT_EVENT_STATUS_REGISTERED } from '@bsport/common/lib/master-data/planned-payment-event';
import PaymentGroupRequiringActionListItem from './PaymentGroupRequiringActionListItem.component';
import RedButton from '../../../components/button/RedButton.component';

import PaymentListItemV2 from './PaymentListItemV2.component';
import PlannedPaymentEventListItem from './PlannedPaymentEventListItem.component';

import { PlannedPaymentEvent, Payment, Invoice } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { OptionCallback } from '../../../state/types';

import { getPaymentLink } from '../../consumer-space/utils';
import type { ConsumerGiftcard, Giftcard } from '#libs/giftcard/types';
import UseConsumerGiftcardForm from '#libs/payment/components/UseConsumerGiftcardForm.component';

const InvoicePaymentStatus = (props: {
  amountToPayCts: number;
  isDraft: boolean;
  invoice_type: number;
  hasPendingPlannedPaymentEvent: boolean;
}) => {
  const classes = useStyles();
  if (props.invoice_type === INVOICE_TYPE_RECEIPT) {
    return (
      <div className={classes.statusContainer}>
        <ReceiptIcon className={classes.statusIcon} />
      </div>
    );
  }
  if (props.invoice_type === INVOICE_TYPE_REVERSE) {
    return (
      <div className={classes.statusContainer}>
        <KeyboardReturnIcon className={classes.statusIcon} />
      </div>
    );
  }
  return (
    <div className={classes.statusContainer}>
      {!props.hasPendingPlannedPaymentEvent &&
        !props.isDraft &&
        props.amountToPayCts <= 0 && (
          <CheckIcon color="primary" className={classes.statusIcon} />
        )}
      {(props.hasPendingPlannedPaymentEvent || !!props.isDraft) && (
        <HourglassEmptyIcon color="secondary" className={classes.statusIcon} />
      )}
      {!props.hasPendingPlannedPaymentEvent &&
        !props.isDraft &&
        props.amountToPayCts > 0 && (
          <CancelIcon color="error" className={classes.statusIcon} />
        )}
    </div>
  );
};

const PaymentActions: FC<{
  loading: boolean;
  accountBalance: number;
  amountToPayCts?: number;
  is_reverse: boolean;
  onPaymentIntent: () => void;
  onInstalmentPayment: () => void;
  paymentList: Array<Payment>;
  invoice: Invoice;
  consumeBalance?: (options?: OptionCallback) => void;
  onRevert: () => void;
  accountBalanceLoading: boolean;
  companyId: number;
  snackbarSuccess: (msg: string) => void;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
}> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  const [processing, setProcessing] = React.useState(false);
  if (props.loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <React.Fragment>
      {props.invoice.invoice_type === INVOICE_TYPE_REGULAR &&
        !!props.accountBalance &&
        props.amountToPayCts > 0 && (
          <div className={classes.balanceContainer}>
            {!!props.accountBalance && (
              <Typography variant="h6">
                {t('creditAccountBalance.current')}
              </Typography>
            )}
            <div className={classes.balanceRightContainer}>
              {!!props.accountBalance && (
                <Typography
                  color={props.accountBalance < 0 ? 'error' : 'primary'}
                  variant="h5"
                >
                  {getCurrencyDisplayWithPrice(props.accountBalance)}
                </Typography>
              )}
              {props.accountBalance > 0 && !!props.consumeBalance && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={processing || props.accountBalanceLoading}
                  onClick={() => {
                    setProcessing(true);
                    props.consumeBalance({
                      onSuccess: () => setProcessing(false),
                      onError: () => setProcessing(false),
                    });
                  }}
                >
                  {!!props.accountBalanceLoading && (
                    <CircularProgress
                      size={20}
                      color="inherit"
                      className={classes.iconLeft}
                    />
                  )}
                  {t('actions.consumeBalance')}
                </Button>
              )}
            </div>
          </div>
        )}
      {!props.is_reverse && !props.invoice.reverse_invoices.length && (
        <div className={classes.row}>
          <div className={classes.buttonRow}>
            {props.invoice.invoice_type === INVOICE_TYPE_REGULAR && (
              <React.Fragment>
                <CopyToClipboard
                  text={getPaymentLink(props.companyId, props.invoice.uuid)}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !props.invoice.member ||
                      props.amountToPayCts === 0 ||
                      processing
                    }
                    onClick={() => props.snackbarSuccess('link.copied')}
                  >
                    {t('paymentPanel.actions.generatePaymentLink')}
                  </Button>
                </CopyToClipboard>
                <Button
                  onClick={props.onPaymentIntent}
                  variant="contained"
                  color="primary"
                  disabled={
                    !props.invoice.member ||
                    props.amountToPayCts === 0 ||
                    processing
                  }
                >
                  {t('paymentPanel.actions.bill')}
                </Button>
              </React.Fragment>
            )}
            {!props.invoice.reverse_invoices.length &&
              !props.invoice.source_invoice &&
              (props.invoice.invoice_type === INVOICE_TYPE_REGULAR ||
                props.paymentList.filter(
                  (p) => p.payment_engine !== PAYMENT_ENGINE_BSPORT,
                ).length === 1) && (
                <RedButton
                  onClick={props.onRevert}
                  disabled={processing}
                  variant="contained"
                >
                  {t('paymentPanel.actions.revert')}
                </RedButton>
              )}
          </div>
          <div className={classes.buttonRow}>
            <UseConsumerGiftcardForm
              invoice={props.invoice}
              applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
              consumerGiftcardList={props.consumerGiftcardList}
              loading={props.loading}
              disabled={
                !props.invoice.member ||
                props.amountToPayCts === 0 ||
                processing
              }
            />
            {props.invoice.invoice_type === INVOICE_TYPE_REGULAR &&
              !props.invoice.plannedinvoice && (
                <Button
                  onClick={props.onInstalmentPayment}
                  variant="contained"
                  color="secondary"
                  disabled={
                    !props.invoice.member ||
                    props.amountToPayCts === 0 ||
                    processing
                  }
                >
                  {t('paymentPanel.actions.billByInstalment')}
                </Button>
              )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

type Props = {
  paymentList: Array<Payment>;
  plannedPaymentEventList: Array<PlannedPaymentEvent>;
  consumeBalance: (options?: OptionCallback) => void;
  accountBalance?: boolean;
  accountBalanceLoading: boolean;
  handleChangeMethod: (
    uuid: string,
    method: number,
    options: OptionCallback,
  ) => void;
  invoice: Invoice;
  paymentLoading: boolean;
  onRevert: () => void;
  onPaymentIntent: () => void;
  plannedPaymentEventLoading: boolean;
  plannedPaymentEventActions?: {
    onRegisterNow?: (id: number) => void;
    onDisable?: (id: number) => void;
    onEnable?: (id: number) => void;
    onEdit?: (id: number) => void;
  };
  companyId: number;
  snackbarSuccess: (msg: string) => void;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
};

export const InvoicePaymentPanel: FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  let amountToPayCts = Math.max(
    props.invoice.amount_due_cts - props.invoice.amount_paid_cts,
    0,
  );
  if (
    props.plannedPaymentEventList.filter(
      (ppe) =>
        ppe.processing &&
        ppe.status === PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
    ).length
  ) {
    amountToPayCts = 0;
  }
  const is_reverse = props.invoice.source_invoice;
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <InvoicePaymentStatus
          invoice_type={props.invoice.invoice_type}
          hasPendingPlannedPaymentEvent={
            props.plannedPaymentEventList &&
            props.plannedPaymentEventList.length > 0
          }
          amountToPayCts={amountToPayCts}
          isDraft={props.invoice.is_draft}
        />
        <Typography variant="h6" className={classes.sectionTitle}>
          {t(
            is_reverse
              ? 'paymentPanel.paymentList.titleReverse'
              : 'paymentPanel.paymentList.title',
          )}
        </Typography>
        {props.paymentLoading ? (
          <LinearProgress className={classes.divider} />
        ) : (
          <Divider className={classes.divider} />
        )}
        {!props.paymentLoading &&
          !props.paymentList.length &&
          !props.paymentGroupRequiringActionList.length && (
            <Typography variant="caption" color="textSecondary">
              {t('paymentPanel.paymentList.isEmpty')}
            </Typography>
          )}
        <div className={classes.listContainer}>
          {props.paymentList.map((p) => (
            <PaymentListItemV2
              handleChangeMethod={props.handleChangeMethod}
              paymentItem={p}
              key={p.id}
            />
          ))}
          {props.invoice.is_fully_paid
            ? null
            : props.paymentGroupRequiringActionList.map((p) => (
                <PaymentGroupRequiringActionListItem
                  onValidate={props.onValidate}
                  paymentGroup={p}
                  key={p.id}
                />
              ))}
        </div>
        {!props.plannedPaymentEventLoading &&
          !!props.plannedPaymentEventList.length && (
            <React.Fragment>
              <Typography variant="h6" className={classes.sectionTitle}>
                {t('paymentPanel.plannedPaymentEvent.title', {
                  count: props.plannedPaymentEventList.length,
                })}
              </Typography>
              <Divider className={classes.divider} />
              <div className={classes.listContainer}>
                {props.plannedPaymentEventList.map((p) => (
                  <PlannedPaymentEventListItem
                    plannedPaymentEvent={p}
                    invoice={props.invoice}
                    key={p.id}
                    actions={props.plannedPaymentEventActions}
                  />
                ))}
              </div>
            </React.Fragment>
          )}
        {!is_reverse && (
          <React.Fragment>
            <Typography className={classes.sectionTitle} variant="h6">
              {t('paymentPanel.sumup.title')}
            </Typography>
            <Divider className={classes.divider} />
            <div className={classes.textRow}>
              <Typography>{t('paymentPanel.sumup.amountDue')}</Typography>
              <div className={classes.line} />
              <Typography>
                {getCurrencyDisplayWithPrice(
                  Math.max(props.invoice.amount_due_cts / 100, 0).toFixed(2),
                )}
              </Typography>
            </div>
            <div className={classes.textRow}>
              <Typography>{t('paymentPanel.sumup.amountPaid')}</Typography>
              <div className={classes.line} />
              <Typography>
                {getCurrencyDisplayWithPrice(
                  Math.max(props.invoice.amount_paid_cts / 100, 0).toFixed(2),
                )}
              </Typography>
            </div>
            <div className={classes.textRow}>
              <Typography variant="h6">
                {t('paymentPanel.sumup.amountRemaining')}
              </Typography>
              <div className={classes.line} />
              <Typography
                variant="h5"
                style={
                  props.invoice.reverse_invoices.length
                    ? {
                        textDecoration: 'line-through',
                      }
                    : {}
                }
                color={amountToPayCts > 0 ? 'error' : 'primary'}
              >
                {getCurrencyDisplayWithPrice(
                  Math.max(amountToPayCts / 100, 0).toFixed(2),
                )}
              </Typography>
            </div>
          </React.Fragment>
        )}
      </div>
      {[INVOICE_TYPE_REGULAR, INVOICE_TYPE_RECEIPT].includes(
        props.invoice.invoice_type,
      ) && (
        <PaymentActions
          invoice={props.invoice}
          paymentList={props.paymentList}
          onRevert={props.onRevert}
          is_reverse={is_reverse}
          accountBalance={props.accountBalance}
          accountBalanceLoading={props.accountBalanceLoading}
          consumeBalance={props.consumeBalance}
          amountToPayCts={amountToPayCts}
          onPaymentIntent={props.onPaymentIntent}
          onInstalmentPayment={props.onInstalmentPayment}
          loading={!props.accountBalance && props.accountBalance !== 0}
          companyId={props.companyId}
          snackbarSuccess={props.snackbarSuccess}
          consumerGiftcardList={props.consumerGiftcardList}
          applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  innerContainer: {
    borderRadius: 16,
    border: '1px solid #DEDEDE',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    backgroundColor: 'white',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  container: {
    marginLeft: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
  },
  textRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  statusContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    height: 160,
    width: 160,
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  priceContainer: {
    borderRadius: 16,
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  buttonRow: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  balanceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '1px solid #DEDEDE',
    borderRadius: 8,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  balanceRightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  listContainer: {
    marginLeft: theme.spacing(1),
  },
}));

export default InvoicePaymentPanel;
