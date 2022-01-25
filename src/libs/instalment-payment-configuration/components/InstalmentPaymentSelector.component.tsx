import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import BasketInstalmentPaymentOption from './BasketInstalmentPaymentConfigurationOption.component';
import { InstalmentPayment } from '../types';

type Props = {
  instalmentPaymentConfigurationList: Array<InstalmentPayment>;
  basketPriceCts: number;
  onSelectInstalmentPayment: (id: number) => void;
};

const InstalmentPaymentSelector = (props: Props) => {
  const classes = useStyles();
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
        <BasketInstalmentPaymentOption
          instalmentPayment={null}
          disabled={processing}
          checked={props.instalmentPaymentConfigurationSelectedId === null}
          basketPrice={props.basketPriceCts / 100}
          onSelect={() => {
            setProcessing(true);
            props.onSelectInstalmentPayment(null, {
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        />
      )}
      {props.instalmentPaymentConfigurationList.map((ipc) => (
        <BasketInstalmentPaymentOption
          instalmentPayment={ipc}
          key={ipc.id}
          disabled={processing}
          checked={props.instalmentPaymentConfigurationSelectedId === ipc.id}
          basketPrice={props.basketPriceCts / 100}
          onSelect={(id: number) => {
            setProcessing(true);
            props.onSelectInstalmentPayment(id, {
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
        />
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: {
    displayt: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
}));

export default InstalmentPaymentSelector;
