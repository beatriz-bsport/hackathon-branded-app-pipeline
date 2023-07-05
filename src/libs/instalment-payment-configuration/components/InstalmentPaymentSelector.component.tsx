import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BasketInstalmentEmptyPlaceholder from '#libs/instalment-payment-configuration/components/BasketInstalmentEmptyPlaceholder.component';
import BasketInstalmentPaymentOption from './BasketInstalmentPaymentConfigurationOption.component';
import { InstalmentPayment } from '../types';
import { OptionCallback } from '../../../state/types';
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';

type Props = {
  instalmentPaymentConfigurationList: null | Array<InstalmentPayment>;
  basketPriceCts: number;
  onSelectInstalmentPayment: (
    id: number | null,
    options: OptionCallback,
  ) => void;
  fromApp: boolean;
  paymentProcessing?: boolean;

  instalmentPaymentConfigurationSelectedId: number;
};

const InstalmentPaymentSelector = (props: Props) => {
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles({ isNewCheckoutFlow });
  const [processing, setProcessing] = React.useState(false);
  const isLoadingMain =
    props.instalmentPaymentConfigurationSelectedId &&
    !(props.instalmentPaymentConfigurationList || [])
      .map((ipc) => ipc.id)
      .includes(props.instalmentPaymentConfigurationSelectedId);

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
      {!!(props.instalmentPaymentConfigurationList || []).length && (
        <BasketInstalmentEmptyPlaceholder
          disabled={processing || props.paymentProcessing}
          checked={props.instalmentPaymentConfigurationSelectedId === null}
          onSelect={() => {
            setProcessing(true);
            props.onSelectInstalmentPayment(null, {
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        />
      )}
      {(props.instalmentPaymentConfigurationList || []).map((ipc) => (
        <BasketInstalmentPaymentOption
          instalmentPayment={ipc}
          key={ipc.id}
          disabled={processing || props.paymentProcessing}
          checked={props.instalmentPaymentConfigurationSelectedId === ipc.id}
          basketPrice={props.basketPriceCts / 100}
          onSelect={(id: number) => {
            setProcessing(true);
            props.onSelectInstalmentPayment(id, {
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
          withPaddingLeft={props.fromApp}
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

export default InstalmentPaymentSelector;
