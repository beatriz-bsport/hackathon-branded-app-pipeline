import React, { forwardRef, useCallback } from 'react';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_INTENT_STATUS_CANCELED,
  PAYMENT_INTENT_STATUS_DISPUTED,
  PAYMENT_INTENT_STATUS_PLANNED,
  PAYMENT_INTENT_STATUS_PROCESSING,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group.js';

import { makeStyles } from '@material-ui/core/styles';
import PaymentStripeRevamped from '#src/libs/payment/payment-module-revamped/payment-backend-stripe/PaymentStripeRevamped.component';
import type { OptionCallback } from '#src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import { PaymentMethodCardSelector } from '#src/libs/payment/components/PaymentMethodCardSelector.component';
import { PaymentRequesterRole } from '#src/libs/payment/payment-module-revamped/types';
import { useInvoicePaymentProvider } from '#src/libs/payment/payment-module-revamped/invoice-payment/hooks/useInvoicePaymentProvider';
import CircularProgress from '#src/components/css-only/CircularProgress';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

// !! Triple check before passing new props to this component
// PaymentModule logic should be isolated from the rest
type Props = {
  ref?: React.Ref<any>;
  invoiceUuid: string;
  memberId: number;
  companyId: number;
  onConfirmPaymentError?: () => void;
  onCancelPaymentBeforeConfirming?: () => void;
  onConfirmPaymentSuccess?: (callback?: () => void) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;

  // BAD: hiding confirmation button on New checkout flow and new member profile
  forceHideConfirmPaymentButton?: boolean;

  applyBalanceToInvoiceCallbacks?: OptionCallback;

  // Not used for new member profile on invoice payment. Will be needed for subscription payment from BO
  //
  // establishmentBillingGroups?: EstablishmentBillingGroup[];
  // isEstablishmentBillingGroupSelected?: boolean;
  // selectedEstablishmentBillingGroup?: EstablishmentBillingGroup;
  // setIsEstablishmentBillingGroupSelected?: (
  //   isEstablishmentBillingGroupSelected: boolean,
  // ) => void;
  // setSelectedEstablishmentBillingGroup?: (
  //   value: React.SetStateAction<EstablishmentBillingGroup>,
  // ) => void;
  // updateMemberBillingGroup?: (establishmentBillingGroupId: number) => void;
  //
  // ------------------------------------------

  // Not used for new member profile on invoice payment. Will be needed for subscription payment from BO
  //
  // termsAndConditions?: string;
  // termsAndConditionsAccepted?: boolean;
  // setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  //
  // ------------------------------------------

  // Not used for new member profile on invoice payment. Will be needed for backoffice payment
  //
  // updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  //
  // ------------------------------------------
};

const OnlinePaymentInvoice: React.FC<Props> = forwardRef(
  (
    {
      companyId,
      forceHideConfirmPaymentButton,
      applyBalanceToInvoiceCallbacks,
      invoiceUuid,
      memberId,
      onConfirmPaymentSuccess,
      onCancelPaymentBeforeConfirming,
      onConfirmPaymentError,
      stripePaymentElementConfig,
    },
    ref,
  ) => {
    const {
      creditAccount: {
        allowConsumerToUseInternalAccount,
        applyBalanceLoading,
        creditAccountBalance,
        handleApplyBalanceToInvoice,
      },
      companyPaymentSettings: {
        companyThemeLoading,
        cardBillingDetailsMandatory,
        handleFetchCompanyTheme,
      },
      payment: {
        isPaymentProcessing,
        clientSecret,
        isClientSecretLoading,
        paymentGroupId,
        paymentGroupPriceCts,
        handleFetchPaymentGroupStatus,
        handleSetPaymentProcessing,
        handleRequestClientSecretInvoice,
        handleResetInvoiceClientSecret,
      },
      paymentMethod: {
        paymentMethodChoices,
        isDetachPaymentMethodLoading,
        handleDetachPaymentMethod,
      },
      member: { sepaDefaultEmail, sepaDefaultName, handleFetchMembership },
    } = useInvoicePaymentProvider({
      invoiceUuid,
      payerContext: { memberId, asRole: PaymentRequesterRole.MEMBER },
      companyId,
      applyBalanceToInvoiceCallbacks,
    });

    React.useEffect(() => {
      if (
        WidgetUtils.getConsumerSpaceContext() !==
        ConsumerSpaceContextEnum.WIDGET
      ) {
        handleFetchCompanyTheme?.();
        handleFetchMembership?.();
      }
      handleRequestClientSecretInvoice?.();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Checks if the backend has processed the payment after receiving a webhook event.
     *
     * @callback
     * @param {PaymentGroupStatus} paymentIntentStatus - The status of the payment intent.
     * @returns {boolean} Returns true if the payment intent status is either 'success', 'canceled', 'processing', 'planned', or 'disputed'.
     */
    const hasBackendProcessedPayment = useCallback(
      (paymentIntentStatus: number) =>
        [
          PAYMENT_INTENT_STATUS_SUCCESS,
          PAYMENT_INTENT_STATUS_CANCELED,
          PAYMENT_INTENT_STATUS_PROCESSING,
          PAYMENT_INTENT_STATUS_PLANNED,
          PAYMENT_INTENT_STATUS_DISPUTED,
        ].includes(paymentIntentStatus),
      [],
    );

    const onSuccessfulPayment = useCallback(() => {
      // wrap retry fetchPaymentGroupStatus
      !!paymentGroupId &&
        handleFetchPaymentGroupStatus({
          paymentGroupId,
          options: {
            onSuccess: (paymentIntentStatus: number) => {
              if (hasBackendProcessedPayment(paymentIntentStatus)) {
                onConfirmPaymentSuccess &&
                  setTimeout(onConfirmPaymentSuccess, 2000);
              } else {
                // retry
                setTimeout(onSuccessfulPayment, 1000);
              }
            },
            onError: () => {},
          },
        });
    }, [
      onConfirmPaymentSuccess,
      hasBackendProcessedPayment,
      paymentGroupId,
      handleFetchPaymentGroupStatus,
    ]);

    const paymentStripeRef = React.useRef(null);

    /***
     * @description Before being able to make payment, the client secret and payment group ID must be fetched from respectively
     * Stripe and the backend. Company theme is also needed to know what payment methods can be used for specific context.
     * @constant
     * @type {boolean}
     * ***/
    const isSettingUpPayment: boolean = React.useMemo(
      () =>
        !clientSecret ||
        !paymentGroupId ||
        isClientSecretLoading ||
        companyThemeLoading,
      [
        clientSecret,
        paymentGroupId,
        isClientSecretLoading,
        companyThemeLoading,
      ],
    );

    React.useImperativeHandle(
      ref,
      () => {
        return {
          onPaymentConfirm: (event: React.MouseEvent<HTMLElement>) =>
            !!event && paymentStripeRef?.current?.onPaymentConfirm(event),
          onResetInvoicePaymentSetup: handleResetInvoiceClientSecret,
        };
      },
      [paymentStripeRef, handleResetInvoiceClientSecret],
    );

    const [paymentMethodSelected, selectPaymentMethod] = React.useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );

    const handleSelectPaymentMethod = useCallback(
      (paymentMethod: number) => {
        selectPaymentMethod(paymentMethod);
      },
      [selectPaymentMethod],
    );

    const classes = useStyles();

    if (isSettingUpPayment) {
      return (
        <div className="bs-consumer-invoice-page__payment-portal__loading">
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <PaymentMethodCardSelector
          paymentMethodChoices={paymentMethodChoices}
          paymentMethodSelected={paymentMethodSelected}
          paymentProcessing={isPaymentProcessing}
          selectPaymentMethod={handleSelectPaymentMethod}
        />
        <div className={classes.innerContainer}>
          <PaymentStripeRevamped
            ref={paymentStripeRef}
            allowConsumerToUseInternalAccount={
              allowConsumerToUseInternalAccount
            }
            applyBalanceLoading={
              applyBalanceLoading ||
              isSettingUpPayment ||
              isDetachPaymentMethodLoading
            }
            applyBalanceToInvoice={handleApplyBalanceToInvoice}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory && false}
            clientSecret={clientSecret}
            companyId={companyId}
            creditAccountBalance={creditAccountBalance}
            detachPaymentMethod={handleDetachPaymentMethod}
            detachPaymentMethodLoading={
              isDetachPaymentMethodLoading || isPaymentProcessing
            }
            forceHideConfirmPaymentButton={forceHideConfirmPaymentButton}
            loading={isPaymentProcessing || isSettingUpPayment}
            memberId={memberId}
            onCancel={onCancelPaymentBeforeConfirming}
            onError={onConfirmPaymentError}
            onSuccess={onSuccessfulPayment}
            paymentGroupId={paymentGroupId}
            paymentGroupPriceCts={paymentGroupPriceCts}
            paymentMethodSelected={paymentMethodSelected}
            sepaDefaultEmail={sepaDefaultEmail}
            sepaDefaultName={sepaDefaultName}
            setPaymentProcessing={(paymentProcessing: boolean) =>
              handleSetPaymentProcessing({
                paymentGroupId,
                paymentProcessing,
              })
            }
            stripePaymentElementConfig={stripePaymentElementConfig}
          />
        </div>
      </div>
    );
  },
);
const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingGroupSelector: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(OnlinePaymentInvoice);
