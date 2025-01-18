import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BasketInstalmentEmptyPlaceholder from '#src/libs/instalment-payment-configuration/components/BasketInstalmentEmptyPlaceholder.component';
import type { Basket } from '#src/libs/checkout/types';
import BasketInstalmentPaymentOption from './BasketInstalmentPaymentConfigurationOption.component';
import type { InstalmentPaymentApiWithBasketId } from '../types';
import type { OptionCallback } from '../../../state/types';

type Props = {
  instalmentPaymentConfigurationList: null | InstalmentPaymentApiWithBasketId[];
  basketPriceCts: number;
  onSelectInstalmentPayment: (
    id: number | null,
    options?: OptionCallback<Basket>,
  ) => void;
  fromApp?: boolean;
  paymentProcessing?: boolean;
  setPaymentProcessing?: (isPaymentProcessing: boolean) => void;

  instalmentPaymentConfigurationSelectedId: number;
  onlyInstantPayment?: boolean;
};

const InstalmentPaymentSelector: React.FC<Props> = ({
  instalmentPaymentConfigurationList,
  basketPriceCts,
  onSelectInstalmentPayment,
  fromApp,
  paymentProcessing,
  setPaymentProcessing,
  instalmentPaymentConfigurationSelectedId,
  onlyInstantPayment,
}) => {
  const classes = useStyles();
  const [processing, setProcessing] = React.useState(false);
  const isLoadingMain =
    instalmentPaymentConfigurationSelectedId &&
    !(instalmentPaymentConfigurationList || [])
      .map((ipc) => ipc.id)
      .includes(instalmentPaymentConfigurationSelectedId);

  const onEmptyInstalmentPaymentSelect = React.useCallback(() => {
    setProcessing(true);
    setPaymentProcessing?.(true);
    onSelectInstalmentPayment(null, {
      onSuccess: () => {
        setProcessing(false);
        setPaymentProcessing?.(false);
      },
      onError: () => {
        setProcessing(false);
        setPaymentProcessing?.(false);
      },
    });
  }, [onSelectInstalmentPayment, setPaymentProcessing]);

  const onSelectInstalmentPaymentWithId = React.useCallback(
    (id: number) => {
      setProcessing(true);
      setPaymentProcessing?.(true);
      onSelectInstalmentPayment(id, {
        onSuccess: () => {
          setProcessing(false);
          setPaymentProcessing?.(false);
        },
        onError: () => {
          setProcessing(false);
          setPaymentProcessing?.(false);
        },
      });
    },
    [onSelectInstalmentPayment, setPaymentProcessing],
  );

  if (isLoadingMain) {
    return (
      <div className={classes.center}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={classes.row}>
      {processing && <LinearProgress />}
      {!!(instalmentPaymentConfigurationList || []).length && (
        <BasketInstalmentEmptyPlaceholder
          checked={instalmentPaymentConfigurationSelectedId === null}
          disabled={processing || paymentProcessing}
          onSelect={onEmptyInstalmentPaymentSelect}
        />
      )}
      {(instalmentPaymentConfigurationList || []).map((ipc) => (
        <BasketInstalmentPaymentOption
          key={ipc.id}
          basketPrice={basketPriceCts / 100}
          checked={instalmentPaymentConfigurationSelectedId === ipc.id}
          disabled={onlyInstantPayment || processing || paymentProcessing}
          instalmentPayment={ipc}
          onSelect={onSelectInstalmentPaymentWithId}
          unselectable={onlyInstantPayment}
          withPaddingLeft={fromApp}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 0,
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
}));

export default React.memo(InstalmentPaymentSelector);
