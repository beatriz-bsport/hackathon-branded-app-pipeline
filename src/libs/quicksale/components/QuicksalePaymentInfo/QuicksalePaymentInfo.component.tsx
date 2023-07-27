import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { QuicksalePaymentMethod } from '#libs/quicksale/constants';
import PaymentMethodCardSelector from '#libs/payment/components/PaymentMethodCardSelector.component';
import type { StripeReader } from '#libs/terminal/types';
import PaymentStripeTerminal from '#libs/terminal/components/PaymentStripeTerminal.component';

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
  onPaymentSuccess: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
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
}) => {
  const classes = useStyles();

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
  },
}));

export default React.memo(QuicksalePaymentInfo);
