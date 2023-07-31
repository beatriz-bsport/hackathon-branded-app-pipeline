import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BasketInstalmentEmptyPlaceholder from '#libs/instalment-payment-configuration/components/BasketInstalmentEmptyPlaceholder.component';
import BasketInstalmentPaymentOption from './BasketInstalmentPaymentConfigurationOption.component';
import type { InstalmentPaymentApiWithBasketId } from '../types';
import type { OptionCallback } from '../../../state/types';
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';
import type { Basket } from '#libs/checkout/types';

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
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles({ isNewCheckoutFlow });
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
          disabled={processing || paymentProcessing}
          checked={instalmentPaymentConfigurationSelectedId === null}
          onSelect={onEmptyInstalmentPaymentSelect}
        />
      )}
      {(instalmentPaymentConfigurationList || []).map((ipc) => (
        <BasketInstalmentPaymentOption
          instalmentPayment={ipc}
          key={ipc.id}
          disabled={onlyInstantPayment || processing || paymentProcessing}
          checked={instalmentPaymentConfigurationSelectedId === ipc.id}
          basketPrice={basketPriceCts / 100}
          onSelect={onSelectInstalmentPaymentWithId}
          withPaddingLeft={fromApp}
          unselectable={onlyInstantPayment}
        />
      ))}
    </div>
  );
};

type NewCheckoutFlowThemeProps = {
  isNewCheckoutFlow?: boolean;
};

const useStyles = makeStyles<Theme, NewCheckoutFlowThemeProps>((theme) => ({
  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: ({ isNewCheckoutFlow }) => ({
    displayt: 'flex',
    flexDirection: 'column',
    marginLeft: isNewCheckoutFlow ? 0 : theme.spacing(1),
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  }),
}));

export default React.memo(InstalmentPaymentSelector);
