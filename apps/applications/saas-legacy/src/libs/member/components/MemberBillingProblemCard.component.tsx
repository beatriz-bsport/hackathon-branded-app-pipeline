import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '@bsport/common/lib/master-data/payment-group.js';
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
import type { OptionCallback } from '#src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';

type Props = {
  adjustCreditWithoutPaymentNote: (c: number) => void;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: (uuid: string, options?: OptionCallback) => void;
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void;
  asConsumer: boolean;
  availablePaymentMethodList: number[];
  balance: number;
  cardBillingDetailsMandatory: boolean;
  companyId?: number;
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>;
  creditAccountBalance?: number | null;
  detachPaymentMethod: (
    pm_id: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  establishments: Array<Establishment>;
  fetchInvoiceListUnpaid: () => void;
  forceOnlyInternal?: boolean;
  goToInvoice: (uuid: string, invoice?: Invoice) => void;
  hidePositiveBalanceForManager?: boolean;
  invoiceLoading: boolean;
  member: Member;
  memberId: number;
  memberLoading: boolean;
  onInvoicePaymentDialogClose?: () => void;
  onlinePaymentEnabled: boolean;
  onPaymentSuccess?: () => void;
  paperVariant?: 'elevation' | 'outlined';
  selectedInvoiceId?: string;
  showPositiveBalance?: boolean;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  stripeReaders: StripeReader[];
  unpaidInvoiceList: Array<Invoice>;
  bsportPaymentMethodsToDisable?: number[];
};

const PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY = 100;
export const MemberBillingProblemCard: React.FC<Props> = ({
  adjustCreditWithoutPaymentNote,
  allowConsumerToUseInternalAccount,
  applyBalanceLoading,
  applyBalanceToInvoice,
  applyGiftcardOnInvoice,
  asConsumer,
  availablePaymentMethodList,
  balance,
  cardBillingDetailsMandatory,
  companyId,
  consumerGiftcardList,
  creditAccountBalance,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  enableMultiLocalization,
  establishmentBillingGroups,
  establishments,
  fetchInvoiceListUnpaid,
  forceOnlyInternal,
  goToInvoice,
  hidePositiveBalanceForManager,
  invoiceLoading,
  member,
  memberId,
  memberLoading,
  onInvoicePaymentDialogClose,
  onlinePaymentEnabled,
  onPaymentSuccess,
  paperVariant,
  selectedInvoiceId,
  showPositiveBalance,
  snackbarErrorMsg,
  snackbarSuccessMsg,
  stripePaymentElementConfig,
  stripeReaders,
  unpaidInvoiceList,
  bsportPaymentMethodsToDisable,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'invoice']);

  const [invoiceToBill, setInvoiceToBill] = useState<Invoice | null>(null);

  useEffect(
    () =>
      setInvoiceToBill(
        unpaidInvoiceList.find((i) => i.uuid === selectedInvoiceId),
      ),
    [unpaidInvoiceList, selectedInvoiceId],
  );
  const [clientSecretLoading, setClientSecretLoading] =
    useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [clientSecretError, setClientSecretError] = useState<boolean>(false);

  const [paymentGroupPriceCts, setPaymentGroupPriceCts] = useState<number>(0);
  const [paymentGroupId, setPaymentGroupId] = useState<number | null>(null);

  const [ajustBalanceOpen, setAdjustBalanceDialogOpen] =
    useState<boolean>(false);
  const [regularizeFullDebt, setRegularizeFullDebt] = useState<boolean>(false);
  const [amountToBill, setAmountToBill] = useState<string | null>(null);
  const [
    selectedEstablishmentBillingGroup,
    setSelectedEstablishmentBillingGroup,
  ] = useState<EstablishmentBillingGroup>(null);
  const [paymentGroupCompletedCheckSeconds] = useState<number>(0.5);
  const [retryPaymentGroupStatus, setRetryPaymentGroupStatus] =
    useState<number>(0);

  const requestClientSecret = useCallback(
    (paymentEngine: number, params?: any) => {
      setClientSecret(null);
      setClientSecretLoading(true);
      setClientSecretError(false);
      requestClientSecretAPI(
        paymentEngine,
        invoiceToBill ? PAYMENT_INTENT_TYPE_INVOICE : PAYMENT_INTENT_TYPE_DEBT,
        {
          invoice: invoiceToBill ? invoiceToBill.uuid : null,
          member: memberId,
          requested_price_cts: amountToBill
            ? Math.round(parseFloat(amountToBill) * 100)
            : null,
          ...(params || {}),
        },
      )
        .then((r) => {
          setClientSecretLoading(false);
          setClientSecret(r.data.client_secret);
          setPaymentGroupPriceCts(r.data.price_cts);
          setAmountToBill((r.data.price_cts / 100).toFixed(2));
          setPaymentGroupId(r.data.payment_group);
          setClientSecretError(false);
        })
        .catch((err) => {
          console.error(err);
          setClientSecretLoading(false);
          setClientSecretError(true);
          Sentry.captureException(err);
        });
    },
    [amountToBill, invoiceToBill, memberId],
  );

  const listenPaymentGroupCompleted = useCallback(
    (callback?: () => void) => {
      getPaymentGroupStatusAPI(paymentGroupId)
        .then((r) => {
          if (retryPaymentGroupStatus > PAYMENT_GROUP_STATUS_INTENT_MAX_RETRY) {
            return;
          }
          if (r.data >= PAYMENT_INTENT_STATUS_SUCCESS) {
            setTimeout(() => {
              if (selectedEstablishmentBillingGroup?.id) {
                setEstablishmentBillingGroupOnCompletedPaymentGroupStatusAPI(
                  paymentGroupId,
                  selectedEstablishmentBillingGroup.id,
                );
              }
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
    },
    [
      paymentGroupId,
      paymentGroupCompletedCheckSeconds,
      retryPaymentGroupStatus,
      selectedEstablishmentBillingGroup,
    ],
  );

  const handleApplyBalanceToInvoice = (options: OptionCallback) =>
    invoiceToBill?.uuid && applyBalanceToInvoice(invoiceToBill?.uuid, options);

  const handleRegularizeMemberFullDebt = useCallback(
    () => setRegularizeFullDebt(true),
    [setRegularizeFullDebt],
  );

  const onAdjustMemberBalanceClick = useCallback(() => {
    if (asConsumer) {
      // @ts-expect-error
      setAmountToBill(Math.abs(parseFloat(balance)));
    } else {
      setAdjustBalanceDialogOpen(true);
    }
  }, [asConsumer, balance]);

  const handeAdjustMemberBalance = useCallback(
    (arg, withoutPaymentNote) => {
      if (withoutPaymentNote) {
        adjustCreditWithoutPaymentNote(arg);
        setAdjustBalanceDialogOpen(false);
      } else {
        setAmountToBill(arg);
        setAdjustBalanceDialogOpen(false);
      }
    },
    [
      adjustCreditWithoutPaymentNote,
      setAdjustBalanceDialogOpen,
      setAmountToBill,
    ],
  );

  const onCloseMemberBalanceUpdate = useCallback(
    () => setAdjustBalanceDialogOpen(false),
    [setAdjustBalanceDialogOpen],
  );

  const handleCancelPayment = useCallback(() => {
    setInvoiceToBill(null);
    // @ts-expect-error
    setAmountToBill(0);
    setPaymentGroupPriceCts(0);
    setRegularizeFullDebt(false);
    if (onInvoicePaymentDialogClose) onInvoicePaymentDialogClose();
  }, [
    onInvoicePaymentDialogClose,
    setInvoiceToBill,
    setAmountToBill,
    setRegularizeFullDebt,
  ]);

  const handlePaymentSuccess = useCallback(
    (callback?: () => void) => {
      fetchInvoiceListUnpaid();
      setInvoiceToBill(null);
      setAmountToBill(null);
      setRegularizeFullDebt(false);
      listenPaymentGroupCompleted();
      if (typeof callback === 'function') callback();
      if (onInvoicePaymentDialogClose) onInvoicePaymentDialogClose();
      onPaymentSuccess?.();
    },
    [
      fetchInvoiceListUnpaid,
      setInvoiceToBill,
      setAmountToBill,
      setRegularizeFullDebt,
      listenPaymentGroupCompleted,
      onInvoicePaymentDialogClose,
      onPaymentSuccess,
    ],
  );

  const emptyFunction = useCallback(() => {}, []);

  let color = 'secondary';
  // @ts-expect-error
  const parsedBalance = parseFloat(balance);
  if (parsedBalance > 0) {
    color = 'primary';
  }
  if (parsedBalance < 0) {
    color = 'error';
  }

  const amountDisplayed = useMemo(
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

  const showBalance = useMemo(
    () => parsedBalance < 0 || (!asConsumer && !hidePositiveBalanceForManager),
    [parsedBalance, asConsumer, hidePositiveBalanceForManager],
  );

  return (
    <Paper
      className={classes.accountBalanceBloc}
      variant={paperVariant || 'elevation'}
    >
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
            {showBalance && (
              <div className={classes.padding}>
                {(hasReadBalancePermission || asConsumer) && (
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
                      {memberLoading && (
                        <CircularProgress color="primary" size={24} />
                      )}
                      {(hasEditBalancePermission || asConsumer) && (
                        <Button
                          color="primary"
                          disabled={memberLoading}
                          onClick={onAdjustMemberBalanceClick}
                          variant="outlined"
                        >
                          {t(
                            asConsumer ? 'regularizeBalance' : 'adjustBalance',
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
                {showPositiveBalance && (
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
                        {memberLoading && (
                          <CircularProgress color="primary" size={24} />
                        )}
                        <Button disabled color="primary" variant="outlined">
                          {t(
                            asConsumer ? 'regularizeBalance' : 'adjustBalance',
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {showBalance || showPositiveBalance ? (
                  <Divider className={classes.divider} />
                ) : (
                  // This is to keep the top margin when the divider is not displayed
                  <div className={classes.divider} />
                )}
                <div className={classes.invoiceContainer}>
                  <div className={classes.unpaidAmountHeader}>
                    <Typography className={classes.padding} variant="h6">
                      {t('unpaidInvoiceTitle', {
                        count: unpaidInvoiceList.length,
                      })}
                    </Typography>
                    <Typography color="error" component="span" variant="h6">
                      {` ${getCurrencyDisplayWithPrice(
                        member?.total_unpaid_amount,
                      )}`}
                    </Typography>
                  </div>
                  <InvoiceTable
                    compactMode
                    hideMemberName
                    hidePagination
                    showOpenInvoiceNested
                    applyGiftcardOnInvoice={applyGiftcardOnInvoice}
                    asConsumer={asConsumer}
                    companyId={companyId}
                    consumerGiftcardList={consumerGiftcardList}
                    invoiceList={unpaidInvoiceList}
                    loading={invoiceLoading}
                    // @ts-expect-error
                    onBill={
                      asConsumer && onlinePaymentEnabled === false
                        ? null
                        : setInvoiceToBill
                    }
                    onClickInvoice={goToInvoice}
                    snackbarSuccess={snackbarSuccessMsg}
                  />
                </div>
              </React.Fragment>
            )}
            {hasTakePaymentPermission &&
              !!unpaidInvoiceList &&
              unpaidInvoiceList.length >= 1 &&
              !asConsumer && (
                <div className={classes.payAllButtonContainer}>
                  <Button
                    // @ts-expect-error
                    className={classes.payAllButton}
                    color="primary"
                    onClick={handleRegularizeMemberFullDebt}
                    variant="outlined"
                  >
                    {t('invoice:paymentPanel.actions.payAll')}
                  </Button>
                </div>
              )}
            {!!ajustBalanceOpen && (
              <MemberBalanceUpdaterDialog
                open
                asManager={asConsumer === false}
                enableMultiLocalization={enableMultiLocalization}
                // @ts-expect-error
                establishmentBillingGroups={establishmentBillingGroups}
                // @ts-expect-error
                initialValue={parseFloat(balance)}
                onClose={onCloseMemberBalanceUpdate}
                onSubmit={handeAdjustMemberBalance}
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
                  allowConsumerToUseInternalAccount
                }
                amountToPay={amountDisplayed}
                applyBalanceLoading={applyBalanceLoading}
                applyBalanceToInvoice={handleApplyBalanceToInvoice}
                asConsumer={asConsumer}
                availablePaymentMethodList={
                  availablePaymentMethodList.length
                    ? availablePaymentMethodList
                    : [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]
                }
                bsportPaymentMethodsToDisable={bsportPaymentMethodsToDisable}
                cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                clientSecret={clientSecretLoading ? null : clientSecret}
                clientSecretError={clientSecretError}
                clientSecretLoading={clientSecretLoading}
                companyId={companyId}
                creditAccountBalance={creditAccountBalance}
                defaultUserEmail={member ? member.email : ''}
                defaultUserName={member ? member.name : ''}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={detachPaymentMethodLoading}
                establishments={establishments}
                memberId={memberId}
                onCancel={handleCancelPayment}
                onError={emptyFunction}
                onlyInternal={
                  // @ts-expect-error
                  (amountToBill && amountToBill < 0) ||
                  forceOnlyInternal ||
                  (!asConsumer &&
                    !regularizeFullDebt &&
                    // @ts-expect-error
                    amountDisplayed <
                      TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS)
                }
                onSuccess={handlePaymentSuccess}
                paymentGroupId={paymentGroupId}
                paymentGroupPriceCts={paymentGroupPriceCts}
                requestClientSecret={requestClientSecret}
                snackbarErrorMsg={snackbarErrorMsg}
                snackbarSuccessMsg={snackbarSuccessMsg}
                stripePaymentElementConfig={stripePaymentElementConfig}
                stripeReaders={stripeReaders}
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
