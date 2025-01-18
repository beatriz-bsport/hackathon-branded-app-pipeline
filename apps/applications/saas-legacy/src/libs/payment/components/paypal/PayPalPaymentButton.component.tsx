import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import CircularProgress from '#src/components/css-only/CircularProgress';
import { snackbarError } from '#src/libs/snackbar/actions';
import { makeStyles } from '@material-ui/core';

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
  const classes = useStyles();
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  React.useEffect(() => {
    if (isRejected)
      snackbarError('canNotExecutePaymentAttempt.failedLoadingPayPalScript');
  }, [isRejected]);

  if (isRejected) return <></>;

  return (
    <div className={classes.container}>
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
            height: 40,
          }}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => {
  return {
    container: {
      width: '100%',
    },
  };
});

export default React.memo(PayPalPaymentButton);
