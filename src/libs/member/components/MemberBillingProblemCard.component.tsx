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
import type { Invoice } from '#src/libs/invoice/types';
import type { ConsumerGiftcard, Giftcard } from '#src/libs/giftcard/types';
import type { StripeReader } from '#src/libs/terminal/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS } from '#src/libs/invoice/constants';
// @ts-expect-error
import PaymentDialog from '../../payment/components/PaymentDialog.component';
import MemberBalanceUpdaterDialog from './MemberBalanceUpdaterDialog.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import InvoiceTable from '../../invoice/components/InvoiceTable.component';
import { requestClientSecret as requestClientSecretAPI } from '../../invoice/api';
import {
  getPaymentGroupStatus as getPaymentGroupStatusAPI,
  setEstablishmentBillingGroupOnCompletedPaymentGroupStatus as setEstablishmentBillingGroupOnCompletedPaymentGroupStatusAPI,
} from '../../payment/api';
import type { Member } from '../types';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '../../establishment/types';
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
  fetchInvoiceListUnpaid: () => void;
  availablePaymentMethodList: number[];
  adjustCreditWithoutPaymentNote: (c: number) => void;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  establishments: Array<Establishment>;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  enableMultiLocalization: boolean;
  selectedInvoiceId: string;
  companyId?: number;
  stripeId: string | null;
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
  stripeReaders: StripeReader[];
  onlinePaymentEnabled: boolean;
  cardBillingDetailsMandatory: boolean;
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
  const [
    selectedEstablishmentBillingGroup,
    setSelectedEstablishmentBillingGroup,
  ] = React.useState<EstablishmentBillingGroup>(null);
  const [paymentGroupCompletedCheckSeconds] = React.useState<number>(0.5);
  const [retryPaymentGroupStatus, setRetryPaymentGroupStatus] =
    React.useState<number>(0);
  const requestClientSecret = (paymentEngine: number, params?: any) => {
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
          ? // @ts-expect-error
            parseInt(parseFloat(amountToBill) * 100, 10)
          : null,
        ...(params || {}),
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
            setEstablishmentBillingGroupOnCompletedPaymentGroupStatusAPI(
              paymentGroupId,
              selectedEstablishmentBillingGroup?.id,
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
  // @ts-expect-error
  const parsedBalance = parseFloat(balance);
  if (parsedBalance > 0) {
    color = 'primary';
  }
  if (parsedBalance < 0) {
    color = 'error';
  }

  const amountDisplayed = React.useMemo(
    () =>
      invoiceToBill
        ? parseFloat(
            // @ts-expect-error
            invoiceToBill.amount_due_cts - invoiceToBill.amount_paid_cts,
          ).toFixed(2)
        : // @ts-expect-error
          Math.round(amountToBill * 100),
    [invoiceToBill, amountToBill],
  );
  return (
    <Paper className={classes.accountBalanceBloc}>
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'member.allowed_actions.readBalance',
          'billing.allowed_actions.takePayment',
          'billing.allowed_actions.editBalance',
          'billing.allowed_actions.readInvoices',
        ]}
      >
        {([
          hasReadBalancePermission,
          hasTakePaymentPermission,
          hasEditBalancePermission,
          hasReadInvoicesPermission,
        ]: boolean[]) => (
          <>
            {!!(!props.asConsumer || (parsedBalance && parsedBalance < 0)) && (
              <div className={classes.padding}>
                {(hasReadBalancePermission || props.asConsumer) && (
                  <div className={classes.accountBalance}>
                    <Typography variant="h6">
                      {t('creditAccountBalance')}
                    </Typography>
                    <div className={classes.buttonContainer}>
                      <Typography
                        inline
                        // @ts-expect-error
                        color={color}
                        component="span"
                        variant="h6"
                      >
                        {` ${getCurrencyDisplayWithPrice(balance)}`}
                      </Typography>
                      {props.memberLoading && (
                        <CircularProgress color="primary" size={24} />
                      )}
                      {(hasEditBalancePermission || props.asConsumer) && (
                        <Button
                          color="primary"
                          disabled={props.memberLoading}
                          onClick={() => {
                            if (props.asConsumer) {
                              // @ts-expect-error
                              setAmountToBill(Math.abs(parseFloat(balance)));
                            } else {
                              setAdjustBalanceDialogOpen(true);
                            }
                          }}
                          variant="outlined"
                        >
                          {t(
                            props.asConsumer
                              ? 'regularizeBalance'
                              : 'adjustBalance',
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!!unpaidInvoiceList.length && hasReadInvoicesPermission && (
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
                          // @ts-expect-error
                          color={color}
                          component="span"
                          variant="h6"
                        >
                          {` ${getCurrencyDisplayWithPrice(balance)}`}
                        </Typography>
                        {props.memberLoading && (
                          <CircularProgress color="primary" size={24} />
                        )}
                        <Button disabled color="primary" variant="outlined">
                          {t(
                            props.asConsumer
                              ? 'regularizeBalance'
                              : 'adjustBalance',
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Divider className={classes.divider} />
                <div className={classes.invoiceContainer}>
                  <div className={classes.unpaidAmountHeader}>
                    <Typography className={classes.padding} variant="h6">
                      {t('unpaidInvoiceTitle', {
                        count: unpaidInvoiceList.length,
                      })}
                    </Typography>
                    <Typography color="error" component="span" variant="h6">
                      {` ${getCurrencyDisplayWithPrice(
                        props.member.total_unpaid_amount,
                      )}`}
                    </Typography>
                  </div>
                  <InvoiceTable
                    compactMode
                    hideMemberName
                    hidePagination
                    showOpenInvoiceNested
                    applyGiftcardOnInvoice={props.applyGiftcardOnInvoice}
                    asConsumer={props.asConsumer}
                    companyId={props.companyId}
                    consumerGiftcardList={props.consumerGiftcardList}
                    invoiceList={unpaidInvoiceList}
                    loading={props.invoiceLoading}
                    // @ts-expect-error
                    onBill={
                      props.asConsumer && props.onlinePaymentEnabled === false
                        ? null
                        : setInvoiceToBill
                    }
                    onClickInvoice={props.goToInvoice}
                    snackbarSuccess={props.snackbarSuccessMsg}
                  />
                </div>
              </React.Fragment>
            )}
            {hasTakePaymentPermission &&
              !!unpaidInvoiceList &&
              unpaidInvoiceList.length >= 1 &&
              !props.asConsumer && (
                <div className={classes.payAllButtonContainer}>
                  <Button
                    // @ts-expect-error
                    className={classes.payAllButton}
                    color="primary"
                    onClick={() => setRegularizeFullDebt(true)}
                    variant="outlined"
                  >
                    {t('invoice:paymentPanel.actions.payAll')}
                  </Button>
                </div>
              )}
            {!!ajustBalanceOpen && (
              <MemberBalanceUpdaterDialog
                open
                asManager={props.asConsumer === false}
                enableMultiLocalization={props.enableMultiLocalization}
                // @ts-expect-error
                establishmentBillingGroups={props.establishmentBillingGroups}
                // @ts-expect-error
                initialValue={parseFloat(props.balance)}
                onClose={() => setAdjustBalanceDialogOpen(false)}
                onSubmit={(arg, withoutPaymentNote) => {
                  if (withoutPaymentNote) {
                    props.adjustCreditWithoutPaymentNote(arg);
                    setAdjustBalanceDialogOpen(false);
                  } else {
                    // @ts-expect-error
                    setAmountToBill(arg);
                    setAdjustBalanceDialogOpen(false);
                  }
                }}
                // @ts-expect-error
                selectedEstablishmentBillingGroup={
                  selectedEstablishmentBillingGroup
                }
                // @ts-expect-error
                setSelectedEstablishmentBillingGroup={
                  setSelectedEstablishmentBillingGroup
                }
              />
            )}
            {(!!invoiceToBill || !!amountToBill || !!regularizeFullDebt) && (
              <PaymentDialog
                termsAndConditionsAccepted
                allowConsumerToUseInternalAccount={
                  props.allowConsumerToUseInternalAccount
                }
                amountToPay={amountDisplayed}
                applyBalanceLoading={props.applyBalanceLoading}
                applyBalanceToInvoice={applyBalanceToInvoice}
                asConsumer={props.asConsumer}
                availablePaymentMethodList={
                  props.availablePaymentMethodList.length
                    ? props.availablePaymentMethodList
                    : [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]
                }
                cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
                clientSecret={clientSecretLoading ? null : clientSecret}
                clientSecretError={clientSecretError}
                clientSecretLoading={clientSecretLoading}
                companyId={props.companyId}
                creditAccountBalance={props.creditAccountBalance}
                defaultUserEmail={props.member ? props.member.email : ''}
                defaultUserName={props.member ? props.member.name : ''}
                detachPaymentMethod={props.detachPaymentMethod}
                detachPaymentMethodLoading={props.detachPaymentMethodLoading}
                establishments={props.establishments}
                memberId={props.memberId}
                onCancel={() => {
                  setInvoiceToBill(null);
                  // @ts-expect-error
                  setAmountToBill(0);
                  setRegularizeFullDebt(false);
                  if (props.onInvoicePaymentDialogClose)
                    props.onInvoicePaymentDialogClose();
                }}
                onError={() => {}}
                onlyInternal={
                  // @ts-expect-error
                  (amountToBill && amountToBill < 0) ||
                  // @ts-expect-error
                  props.forceOnlyInternal ||
                  (!props.asConsumer &&
                    !regularizeFullDebt &&
                    // @ts-expect-error
                    amountDisplayed <
                      TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS)
                }
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
                paymentGroupId={paymentGroupId}
                paymentGroupPriceCts={paymentGroupPriceCts}
                requestClientSecret={requestClientSecret}
                snackbarErrorMsg={props.snackbarErrorMsg}
                snackbarSuccessMsg={props.snackbarSuccessMsg}
                stripeId={props.stripeId}
                stripeReaders={props.stripeReaders}
              />
            )}
          </>
        )}
      </ObjectLevelPermissionProvider>
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
  unpaidAmountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: theme.spacing(4),
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
