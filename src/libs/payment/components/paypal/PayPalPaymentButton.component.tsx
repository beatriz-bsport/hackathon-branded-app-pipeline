import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import CircularProgress from '#src/components/css-only/CircularProgress';
import { snackbarError } from '#libs/snackbar/actions';

type Props = {
  createOrder: () => Promise<string>;
  isDisabled: boolean;
  onApprove: () => Promise<void>;
  onCancel: () => void;
  onError: () => void;
};

const PayPalPaymentButton: React.FC<Props> = ({
  createOrder,
  isDisabled,
  onApprove,
  onCancel,
  onError,
}: Props) => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  React.useEffect(() => {
    if (isRejected)
      snackbarError('canNotExecutePaymentAttempt.failedLoadingPayPalScript');
  }, [isRejected]);

  if (isRejected) return <></>;

  return (
    <>
      {isPending ? (
        <CircularProgress />
      ) : (
        <PayPalButtons
          createOrder={createOrder}
          disabled={isDisabled}
          fundingSource="paypal"
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onError}
          style={{
            label: 'pay',
            shape: 'pill',
            color: 'gold',
            disableMaxWidth: true,
          }}
        />
      )}
    </>
  );
};

export default React.memo(PayPalPaymentButton);
