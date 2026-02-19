import React, { FC, useMemo } from 'react';
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
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER as INVOICE_TYPE_RECEIPT,
  INVOICE_TYPE_REGULAR,
  INVOICE_TYPE_REVERSE,
} from '@bsport/common/lib/master-data/invoice-type.js';
import { DISPUTE as PAYMENT_METHOD_DISPUTE } from '@bsport/common/lib/master-data/payment-methods.js';
import { PAYMENT_ENGINE_BSPORT } from '@bsport/common/lib/master-data/payment-group.js';
import {
  PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
  PLANNED_PAYMENT_EVENT_STATUS_ERROR,
  PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
} from '@bsport/common/lib/master-data/planned-payment-event.js';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { Payment } from '#src/libs/payment/types';
import type { ConsumerGiftcard, Giftcard } from '#src/libs/giftcard/types';
import UseConsumerGiftcardForm from '#src/libs/payment/components/UseConsumerGiftcardForm.component';
import PaymentGroupRequiringActionListItem from './PaymentGroupRequiringActionListItem.component';
import RedButton from '../../../components/button/RedButton.component';

// @ts-expect-error
import PaymentListItemV2 from './PaymentListItemV2.component';
import PlannedPaymentEventListItem from './PlannedPaymentEventListItem.component';
import PlannedPaymentEventErrorListItem from './PlannedPaymentEventErrorListItem.component';

import {
  InvoiceStatusEnum,
  InvoiceV1Serializer,
  PlannedPaymentEvent,
} from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { OptionCallback } from '../../../state/types';

import { getPaymentLink } from '../../consumer-space/utils';

const InvoicePaymentStatus = (props: {
  amountToPayCts: number;
  isDraft: boolean;
  invoice_type: number;
  hasPendingPlannedPaymentEvent: boolean;
  hasPendingPayment: boolean;
  hasPendingDispute: boolean;
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
        {props.hasPendingPayment ? (
          <HourglassEmptyIcon className={classes.statusIcon} />
        ) : (
          <KeyboardReturnIcon className={classes.statusIcon} />
        )}
      </div>
    );
  }
  return (
    <div className={classes.statusContainer}>
      {!props.hasPendingPlannedPaymentEvent &&
        !props.isDraft &&
        !props.hasPendingDispute &&
        props.amountToPayCts <= 0 && (
          <CheckIcon className={classes.statusIcon} color="primary" />
        )}
      {(props.hasPendingPlannedPaymentEvent ||
        !!props.isDraft ||
        props.hasPendingDispute) && (
        <HourglassEmptyIcon className={classes.statusIcon} color="secondary" />
      )}
      {!props.hasPendingPlannedPaymentEvent &&
        !props.isDraft &&
        !props.hasPendingDispute &&
        props.amountToPayCts > 0 && (
          <CancelIcon className={classes.statusIcon} color="error" />
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
  invoice: InvoiceV1Serializer;
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
  handleAttributeByPrintableCode: (
    code: string,
    options?: OptionCallback<ConsumerGiftcard>,
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

  const shouldPaymentPanelActionsBeDisplayed =
    !props.is_reverse &&
    ![InvoiceStatusEnum.VOIDED, InvoiceStatusEnum.REFUNDED].includes(
      props.invoice.status,
    );

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
                  color="primary"
                  disabled={processing || props.accountBalanceLoading}
                  onClick={() => {
                    setProcessing(true);
                    props.consumeBalance({
                      onSuccess: () => setProcessing(false),
                      onError: () => setProcessing(false),
                    });
                  }}
                  variant="contained"
                >
                  {!!props.accountBalanceLoading && (
                    <CircularProgress
                      className={classes.iconLeft}
                      color="inherit"
                      size={20}
                    />
                  )}
                  {t('actions.consumeBalance')}
                </Button>
              )}
            </div>
          </div>
        )}
      {shouldPaymentPanelActionsBeDisplayed && (
        <div className={classes.row}>
          <div className={classes.buttonRow}>
            <ObjectLevelPermissionProvider
              requiredPermission={[
                'billing.allowed_actions.readPaymentLink',
                'billing.allowed_actions.cancelInvoice',
                'billing.allowed_actions.takePayment',
              ]}
            >
              {([
                hasPaymentLinkPermission,
                hasCancelInvoicePermission,
                hasTakePaymentPermission,
              ]: boolean[]) => (
                <>
                  {props.invoice.invoice_type === INVOICE_TYPE_REGULAR && (
                    <React.Fragment>
                      {hasPaymentLinkPermission && (
                        <CopyToClipboard
                          text={getPaymentLink(
                            props.companyId,
                            props.invoice.uuid,
                          )}
                        >
                          <Button
                            color="primary"
                            disabled={
                              !props.invoice.member ||
                              props.amountToPayCts === 0 ||
                              processing
                            }
                            onClick={() => props.snackbarSuccess('link.copied')}
                            variant="contained"
                          >
                            {t('paymentPanel.actions.generatePaymentLink')}
                          </Button>
                        </CopyToClipboard>
                      )}
                      {hasTakePaymentPermission && (
                        <Button
                          color="primary"
                          disabled={
                            !props.invoice.member ||
                            props.amountToPayCts === 0 ||
                            processing
                          }
                          onClick={props.onPaymentIntent}
                          variant="contained"
                        >
                          {t('paymentPanel.actions.bill')}
                        </Button>
                      )}
                    </React.Fragment>
                  )}
                  {hasCancelInvoicePermission &&
                    // Only check should be: status in [DRAFT, OPEN, PAID]
                    !props.invoice.reverse_invoices.length &&
                    !props.invoice.source_invoice &&
                    props.invoice.status !== InvoiceStatusEnum.VOIDED &&
                    (props.invoice.invoice_type === INVOICE_TYPE_REGULAR ||
                      props.paymentList.filter(
                        (p) => p.payment_engine !== PAYMENT_ENGINE_BSPORT,
                      ).length === 1) && (
                      <RedButton
                        disabled={processing}
                        onClick={props.onRevert}
                        variant="contained"
                      >
                        {t('paymentPanel.actions.revert')}
                      </RedButton>
                    )}
                </>
              )}
            </ObjectLevelPermissionProvider>
          </div>
          <div className={classes.buttonRow}>
            <UseConsumerGiftcardForm
              applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
              consumerGiftcardList={props.consumerGiftcardList}
              disabled={
                !props.invoice.member ||
                props.amountToPayCts === 0 ||
                processing
              }
              handleAttributeByPrintableCode={
                props.handleAttributeByPrintableCode
              }
              // @ts-expect-error
              invoice={props.invoice}
              loading={props.loading}
            />
            {props.invoice.invoice_type === INVOICE_TYPE_REGULAR &&
              !props.invoice.plannedinvoice && (
                <Button
                  color="secondary"
                  disabled={
                    !props.invoice.member ||
                    props.amountToPayCts === 0 ||
                    processing
                  }
                  onClick={props.onInstalmentPayment}
                  variant="contained"
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
  invoice: InvoiceV1Serializer;
  paymentLoading: boolean;
  onRevert: () => void;
  onPaymentIntent: () => void;
  plannedPaymentEventLoading: boolean;
  plannedPaymentEventActions?: {
    onRegisterNow?: (id: number) => void;
    onDisable?: (id: number) => void;
    onEnable?: (id: number) => void;
    onEdit?: (id: number) => void;
    onChangeMethod?: (ppeId: number) => void;
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
  handleAttributeByPrintableCode: (
    code: string,
    options?: OptionCallback<ConsumerGiftcard>,
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

  const amoutBeingProcessedCts = props.plannedPaymentEventList
    .filter(
      (ppe) =>
        ppe.processing &&
        ppe.status === PLANNED_PAYMENT_EVENT_STATUS_REGISTERED,
    )
    .reduce(
      (partialSum, currentPlannedPaymentEvent) =>
        partialSum + parseInt(currentPlannedPaymentEvent.amount_cts, 10),
      0,
    );

  // partial refund invoices have no source_invoice
  const is_reverse =
    props.invoice.source_invoice ||
    props.invoice.invoice_type == INVOICE_TYPE_REVERSE;

  const plannedPaymentUnrecoverableErrorList = useMemo(
    () =>
      props.plannedPaymentEventList.filter(
        (plannedPayment) =>
          plannedPayment.status === PLANNED_PAYMENT_EVENT_STATUS_ERROR &&
          !plannedPayment.error_recoverable_manually,
      ),
    [props.plannedPaymentEventList],
  );

  const plannedPaymentWithoutUnrecoverableErrorList = useMemo(
    () =>
      props.plannedPaymentEventList.filter(
        (plannedPayment) =>
          plannedPayment.status !== PLANNED_PAYMENT_EVENT_STATUS_ERROR ||
          plannedPayment.error_recoverable_manually,
      ),
    [props.plannedPaymentEventList],
  );

  const paymentActionsLoading =
    !props.accountBalance &&
    // @ts-expect-error
    props.accountBalance !== 0 &&
    !props.invoice.is_member_pos;

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <InvoicePaymentStatus
          amountToPayCts={amountToPayCts}
          hasPendingDispute={
            !!props.paymentList?.filter(
              (payment) =>
                payment.payment_method === PAYMENT_METHOD_DISPUTE.id &&
                (payment.is_processing || payment.payment_received === null),
            ).length
          }
          hasPendingPayment={props.invoice.has_pending_payment}
          hasPendingPlannedPaymentEvent={
            plannedPaymentWithoutUnrecoverableErrorList &&
            plannedPaymentWithoutUnrecoverableErrorList.length > 0 &&
            plannedPaymentWithoutUnrecoverableErrorList.filter(
              (ppe) => ppe.status !== PLANNED_PAYMENT_EVENT_STATUS_CANCELED,
            ).length > 0
          }
          invoice_type={props.invoice.invoice_type}
          isDraft={props.invoice.is_draft}
        />
        <Typography className={classes.sectionTitle} variant="h6">
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
          // @ts-expect-error
          !props.paymentGroupRequiringActionList.length && (
            <Typography color="textSecondary" variant="caption">
              {t('paymentPanel.paymentList.isEmpty')}
            </Typography>
          )}
        <div className={classes.listContainer}>
          {props.paymentList.map((p) => (
            <PaymentListItemV2
              key={p.id}
              invoiceVariant
              handleChangeMethod={props.handleChangeMethod}
              paymentItem={p}
            />
          ))}
          {plannedPaymentUnrecoverableErrorList.map((p) => (
            <PlannedPaymentEventErrorListItem
              key={p.id}
              plannedPaymentError={p}
            />
          ))}
          {/* @ts-expect-error */}
          {props.invoice.is_fully_paid
            ? null
            : // @ts-expect-error
              props.paymentGroupRequiringActionList.map((p) => (
                <PaymentGroupRequiringActionListItem
                  key={p.id}
                  // @ts-expect-error
                  onValidate={props.onValidate}
                  paymentGroup={p}
                />
              ))}
        </div>
        {props.invoice.revert_reason && (
          <Typography className={classes.revertReasonSection} variant="body1">
            {t('paymentPanel.revertReason', {
              revertReason: props.invoice.revert_reason,
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}
        {!props.plannedPaymentEventLoading &&
          !!plannedPaymentWithoutUnrecoverableErrorList.length && (
            <React.Fragment>
              <Typography className={classes.sectionTitle} variant="h6">
                {t('paymentPanel.plannedPaymentEvent.title', {
                  count: plannedPaymentWithoutUnrecoverableErrorList.length,
                })}
              </Typography>
              <Divider className={classes.divider} />
              <div className={classes.listContainer}>
                {plannedPaymentWithoutUnrecoverableErrorList.map((p) => (
                  <PlannedPaymentEventListItem
                    key={p.id}
                    actions={props.plannedPaymentEventActions}
                    invoice={props.invoice}
                    plannedPaymentEvent={p}
                    // @ts-expect-error
                    requestSetupIntentSecret={props.requestSetupIntentSecret}
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
            {!!amoutBeingProcessedCts && (
              <div className={classes.textRow}>
                <Typography>
                  {t('paymentPanel.sumup.amountBeingProcessed')}
                </Typography>
                <div className={classes.line} />
                <Typography>
                  {getCurrencyDisplayWithPrice(
                    Math.max(amoutBeingProcessedCts / 100, 0).toFixed(2),
                  )}
                </Typography>
              </div>
            )}

            <div className={classes.textRow}>
              <Typography variant="h6">
                {t('paymentPanel.sumup.amountRemaining')}
              </Typography>
              <div className={classes.line} />
              <Typography
                color={amountToPayCts > 0 ? 'error' : 'primary'}
                style={
                  [
                    InvoiceStatusEnum.VOIDED,
                    InvoiceStatusEnum.REFUNDED,
                  ].includes(props.invoice.status)
                    ? {
                        textDecoration: 'line-through',
                      }
                    : {}
                }
                variant="h5"
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
          // @ts-expect-error
          accountBalance={props.accountBalance}
          accountBalanceLoading={props.accountBalanceLoading}
          amountToPayCts={amountToPayCts}
          applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
          companyId={props.companyId}
          consumeBalance={props.consumeBalance}
          consumerGiftcardList={props.consumerGiftcardList ?? []}
          handleAttributeByPrintableCode={props.handleAttributeByPrintableCode}
          invoice={props.invoice}
          // @ts-expect-error
          is_reverse={is_reverse}
          loading={paymentActionsLoading}
          // @ts-expect-error
          onInstalmentPayment={props.onInstalmentPayment}
          onPaymentIntent={props.onPaymentIntent}
          onRevert={props.onRevert}
          paymentList={props.paymentList}
          snackbarSuccess={props.snackbarSuccess}
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
    alignItems: 'stretch',
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
  revertReasonSection: {
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
  },
}));

export default InvoicePaymentPanel;
