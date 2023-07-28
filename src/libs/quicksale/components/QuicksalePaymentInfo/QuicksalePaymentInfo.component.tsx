import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import Event from '@material-ui/icons/Event';

import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';

import { QuicksalePaymentMethod } from '#libs/quicksale/constants';
import PaymentMethodCardSelector from '#libs/payment/components/PaymentMethodCardSelector.component';
import type { StripeReader } from '#libs/terminal/types';
import PaymentStripeTerminal from '#libs/terminal/components/PaymentStripeTerminal.component';
import PaymentBsportInternal from '#libs/payment/components/payment-backend-internal/PaymentBsportInternal.component';
import PaymentStripeCard from '#libs/payment/components/payment-backend-stripe/PaymentStripeCard.component';
import type { OptionCallback } from '../../../../state/types';
import { getStripePkKey } from '#libs/theme/selectors';

type Props = {
  availablePaymentMethods?: QuicksalePaymentMethod[];
  selectedPaymentMethod: QuicksalePaymentMethod;
  setSelectedPaymentMethod: (paymentMethod: QuicksalePaymentMethod) => void;
  loading?: boolean;
  stripeReaders?: StripeReader[];
  clientSecret?: string;
  paymentGroupPriceCts?: number;
  paymentGroup?: number;
  setIsProcessing?: (isProcessing: boolean) => void;
  onPaymentSuccess: (callabck?: () => void) => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  memberId?: number;
  detachPaymentMethodLoading?: boolean;
  removePaymentMethod: (
    paymentMethodId: string,
    options: OptionCallback,
  ) => void;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  basketId?: string;
  isMemberPOS?: boolean;
};

const QuicksalePaymentInfo: React.FC<Props> = ({
  availablePaymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  loading,
  stripeReaders,
  clientSecret,
  paymentGroupPriceCts,
  paymentGroup,
  setIsProcessing,
  onPaymentSuccess,
  onCancel,
  children,
  memberId,
  detachPaymentMethodLoading,
  removePaymentMethod,
  checkItemsBasket,
  basketId,
  isMemberPOS,
}) => {
  const classes = useStyles();

  const stripePromise = loadStripe(getStripePkKey());

  return (
    <div className={classes.container}>
      <PaymentMethodCardSelector
        paymentMethodChoices={availablePaymentMethods ?? []}
        paymentMethodSelected={selectedPaymentMethod}
        selectPaymentMethod={setSelectedPaymentMethod}
        paymentProcessing={loading}
        customClasses={{
          formControl: classes.paymentMethodSelectorFormControl,
          row: classes.paymentMethodSelectorRow,
          paper: classes.paymentMethodItemPaper,
          selected: classes.paymentMethodItemPaperSelected,
        }}
      />

      {selectedPaymentMethod === QuicksalePaymentMethod.StripeTerminal && (
        <PaymentStripeTerminal
          stripeReaders={stripeReaders}
          paymentGroupId={paymentGroup}
          paymentGroupPriceCts={paymentGroupPriceCts}
          setProcessing={setIsProcessing}
          clientSecret={clientSecret}
          hideAmountToPay
          onSuccess={onPaymentSuccess}
          onCancel={onCancel}
          customClasses={{
            stripeTerminalContainer: classes.stripeTerminalContainer,
            actionRow: classes.stripeTerminalActions,
          }}
        >
          {children}
        </PaymentStripeTerminal>
      )}

      {selectedPaymentMethod === QuicksalePaymentMethod.Manual && (
        <PaymentBsportInternal
          paymentMethodChoices={
            PAYMENT_GROUP_METHOD_BY_ENGINE[PAYMENT_ENGINE_BSPORT]
          }
          amountToPay={paymentGroupPriceCts?.toString() ?? ''}
          clientSecret={clientSecret}
          onCancel={onCancel}
          onSuccess={onPaymentSuccess}
          hideAmountToPay
          dateFieldEndAdornment={
            <Event className={classes.manualPaymentDateFieldIcon} />
          }
          customClasses={{
            actionRow: classes.manualPaymentActionRow,
          }}
        >
          {children}
        </PaymentBsportInternal>
      )}

      {selectedPaymentMethod === QuicksalePaymentMethod.CreditCard && (
        <Elements stripe={stripePromise}>
          <PaymentStripeCard
            memberId={memberId}
            clientSecret={clientSecret}
            basketId={basketId}
            basketTotalPriceCts={paymentGroupPriceCts}
            onSuccess={onPaymentSuccess}
            setPaymentProcessing={setIsProcessing}
            onCancel={onCancel}
            termsAndConditionsAccepted
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            detachPaymentMethod={removePaymentMethod}
            checkItemsBasket={checkItemsBasket}
            loading={loading}
            customClasses={{
              actionRow: classes.cardPaymentActionRow,
            }}
            forceButtonDisplay
            hideSaveForLater={isMemberPOS}
          >
            {children}
          </PaymentStripeCard>
        </Elements>
      )}
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
}));

export default React.memo(QuicksalePaymentInfo);
