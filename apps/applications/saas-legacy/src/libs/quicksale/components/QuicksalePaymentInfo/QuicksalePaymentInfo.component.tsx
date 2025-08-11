import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
// import Event from '@material-ui/icons/Event';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
} from '@bsport/common/lib/master-data/payment-group.js';

import {
  PAYMENT_METHODS_COMPATIBLE_WITH_INSTALMENT_PAYMENT,
  QuicksalePaymentMethod,
  WARNING_FONT_COLOR,
} from '#src/libs/quicksale/constants';
import PaymentMethodCardSelector from '#src/libs/payment/components/PaymentMethodCardSelector.component';
import type { StripeReader } from '#src/libs/terminal/types';
import PaymentStripeTerminal from '#src/libs/terminal/components/PaymentStripeTerminal.component';
import PaymentBsportInternal from '#src/libs/payment/components/payment-backend-internal/PaymentBsportInternal.component';
import InstalmentPaymentSelector from '#src/libs/instalment-payment-configuration/components/InstalmentPaymentSelector.component';

import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import type { Basket } from '#src/libs/checkout/types';
import type { OptionCallback } from '#src/state/types';

type Props = {
  availablePaymentMethods?: QuicksalePaymentMethod[];
  basket?: Basket;
  clientSecret?: string;
  hasPaymentGroupPriceBeenModified?: boolean;
  instalmentPaymentConfigurationList?: InstalmentPaymentApiWithBasketId[];
  instalmentPaymentSelectedId?: number;
  isMemberPOS?: boolean;
  isProcessing?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onPaymentSuccess: (callabck?: () => void) => void;
  onSelectInstalmentPayment: (
    instalment_payment: number,
    options?: OptionCallback<Basket>,
  ) => void;
  openMemberAuthenticationModale?: () => void;
  paymentGroup?: number;
  paymentGroupPriceCts?: number;
  resetPaymentGroupPrice?: () => void;
  selectedPaymentMethod: QuicksalePaymentMethod;
  setIsProcessing?: (isProcessing: boolean) => void;
  setLoading?: (loading: boolean) => void;
  setSelectedPaymentMethod: (paymentMethod: QuicksalePaymentMethod) => void;
  stripeReaders?: StripeReader[];
  children?: React.ReactNode;
  // (Quicksale MVP): Unused props for payment methods
  /* basketId?: string;
  cardBillingDetailsMandatory: boolean;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  detachPaymentMethodLoading?: boolean;
  memberId?: number;
  removePaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void; */
};

const QuicksalePaymentInfo: React.FC<Props> = ({
  availablePaymentMethods,
  basket,
  children,
  clientSecret,
  hasPaymentGroupPriceBeenModified,
  instalmentPaymentConfigurationList,
  instalmentPaymentSelectedId,
  isMemberPOS,
  isProcessing,
  loading,
  onCancel,
  onPaymentSuccess,
  onSelectInstalmentPayment,
  openMemberAuthenticationModale,
  paymentGroup,
  paymentGroupPriceCts,
  resetPaymentGroupPrice,
  selectedPaymentMethod,
  setIsProcessing,
  setLoading,
  setSelectedPaymentMethod,
  stripeReaders,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('quicksale');

  // (Quicksale MVP): Unused credit card and SEPA payment methods
  // const stripePromise = loadStripe(getStripePkKey());

  return (
    <div className={classes.container}>
      <PaymentMethodCardSelector
        customClasses={{
          formControl: classes.paymentMethodSelectorFormControl,
          row: classes.paymentMethodSelectorRow,
          paper: classes.paymentMethodItemPaper,
          selected: classes.paymentMethodItemPaperSelected,
        }}
        paymentMethodChoices={availablePaymentMethods ?? []}
        paymentMethodSelected={selectedPaymentMethod}
        paymentProcessing={loading || isProcessing}
        selectPaymentMethod={setSelectedPaymentMethod}
      />

      {selectedPaymentMethod === QuicksalePaymentMethod.StripeTerminal && (
        <PaymentStripeTerminal
          hideAmountToPay
          clientSecret={clientSecret}
          customClasses={{
            stripeTerminalContainer: classes.stripeTerminalContainer,
            actionRow: classes.stripeTerminalActions,
          }}
          hideSaveForLater={isMemberPOS}
          loading={loading || basket?.is_finalized || isProcessing}
          onCancel={onCancel}
          onSuccess={onPaymentSuccess}
          paymentGroupId={paymentGroup}
          paymentGroupPriceCts={paymentGroupPriceCts}
          setProcessing={setIsProcessing}
          stripeReaders={stripeReaders}
        >
          {children}
        </PaymentStripeTerminal>
      )}

      {selectedPaymentMethod === QuicksalePaymentMethod.Manual && (
        <PaymentBsportInternal
          hideAmountToPay
          amountToPay={paymentGroupPriceCts?.toString() ?? ''}
          clientSecret={clientSecret}
          customClasses={{
            actionRow: classes.manualPaymentActionRow,
          }}
          // dateFieldEndAdornment={
          //   <Event className={classes.manualPaymentDateFieldIcon} />
          // }
          loading={loading || basket?.is_finalized || isProcessing}
          onCancel={onCancel}
          onProcessing={setIsProcessing}
          onSuccess={onPaymentSuccess}
          paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
            PAYMENT_ENGINE_BSPORT
          ].filter(
            (paymentGroupMethod) =>
              paymentGroupMethod !== PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
          )}
          showDateInput={false}
        >
          {children}
        </PaymentBsportInternal>
      )}

      {PAYMENT_METHODS_COMPATIBLE_WITH_INSTALMENT_PAYMENT.includes(
        selectedPaymentMethod,
      ) && (
        <>
          <InstalmentPaymentSelector
            basketPriceCts={
              (basket?.total_price_cts ?? 0) -
              (basket?.total_price_prepaid_lines_cts ?? 0)
            }
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            instalmentPaymentConfigurationSelectedId={
              instalmentPaymentSelectedId
            }
            onlyInstantPayment={isMemberPOS || hasPaymentGroupPriceBeenModified}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            paymentProcessing={loading}
            setPaymentProcessing={setLoading}
          />
          {isMemberPOS && (
            <Alert
              action={
                <Button
                  className={classes.authenticationButton}
                  onClick={openMemberAuthenticationModale}
                >
                  {t('checkout.noAnonymousInstalment.identify')}
                </Button>
              }
              className={classes.alert}
              severity="warning"
            >
              {t('checkout.noAnonymousInstalment.explanation')}
            </Alert>
          )}
          {hasPaymentGroupPriceBeenModified && (
            <Alert
              action={
                <Button
                  className={classes.authenticationButton}
                  onClick={resetPaymentGroupPrice}
                >
                  {t('checkout.noPartialInstalment.reset')}
                </Button>
              }
              className={classes.alert}
              severity="warning"
            >
              {t('checkout.noPartialInstalment.explanation')}
            </Alert>
          )}
        </>
      )}

      {/* (Quicksale MVP): CreditCard payment method disabled */}
      {/*
      {selectedPaymentMethod === QuicksalePaymentMethod.CreditCard && (
        <Elements stripe={stripePromise}>
          <PaymentStripeCard
            forceButtonDisplay
            termsAndConditionsAccepted
            basketId={basketId}
            basketTotalPriceCts={paymentGroupPriceCts}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory}
            checkItemsBasket={checkItemsBasket}
            clientSecret={clientSecret}
            customClasses={{
              actionRow: classes.cardPaymentActionRow,
            }}
            detachPaymentMethod={removePaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            hideSaveForLater={isMemberPOS}
            loading={loading}
            memberId={memberId}
            onCancel={onCancel}
            onSuccess={onPaymentSuccess}
            paymentGroupId={paymentGroup}
            saveForLater={false}
            setPaymentProcessing={setIsProcessing}
          >
            {children}
          </PaymentStripeCard>
        </Elements>
      )}
      */}

      {/* (Quicksale MVP): Sepa payment method disabled */}
      {/*
      {selectedPaymentMethod === QuicksalePaymentMethod.Sepa && (
        <Elements stripe={stripePromise}>
          <PaymentStripeSEPA
            forceButtonDisplay
            termsAndConditionsAccepted
            basketId={basketId}
            basketTotalPriceCts={paymentGroupPriceCts}
            checkItemsBasket={checkItemsBasket}
            clientSecret={clientSecret}
            customClasses={{
              actionRow: classes.sepaPaymentActionRow,
            }}
            detachPaymentMethod={removePaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            hideSaveForLater={isMemberPOS}
            loading={loading}
            memberId={memberId}
            onCancel={onCancel}
            onSuccess={onPaymentSuccess}
            paymentGroupId={paymentGroup}
            saveForLater={false}
            setPaymentProcessing={setIsProcessing}
          >
            {children}
          </PaymentStripeSEPA>
        </Elements>
      )}
      */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  paymentMethodSelectorFormControl: {
    padding: 0,
  },
  paymentMethodSelectorRow: {
    gap: theme.spacing(3),
    padding: theme.spacing(1, 0, 0, 0),
  },
  paymentMethodItemPaper: {
    borderRadius: theme.spacing(1),
    border: `2px solid ${theme.palette.grey[300]}`,
    boxShadow: 'none',
  },
  paymentMethodItemPaperSelected: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  stripeTerminalContainer: {
    width: '100%',
    maxWidth: 'none',
  },
  stripeTerminalActions: {
    justifyContent: 'end',
    flexDirection: 'row-reverse',
    gap: theme.spacing(1),
  },
  manualPaymentDateFieldIcon: {
    fill: theme.palette.action.active,
  },
  manualPaymentActionRow: {
    justifyContent: 'end',
    flexDirection: 'row-reverse',
    gap: theme.spacing(1),
  },
  cardPaymentActionRow: {
    justifyContent: 'end',
    flexDirection: 'row-reverse',
    gap: theme.spacing(1),
  },
  sepaPaymentActionRow: {
    justifyContent: 'end',
    flexDirection: 'row-reverse',
    gap: theme.spacing(1),
  },
  alert: {
    alignItems: 'center',
  },
  authenticationButton: {
    color: WARNING_FONT_COLOR,
  },
}));

export default React.memo(QuicksalePaymentInfo);
