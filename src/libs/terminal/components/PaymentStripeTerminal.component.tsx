import React, { useEffect, useState } from 'react';
import {
  Terminal,
  ISdkManagedPaymentIntent,
  loadStripeTerminal,
} from '@stripe/terminal-js';

import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import classnames from 'classnames';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import StripeTerminalConnectingLoading from './StripeTerminalConnectingLoading.component';
import StripeTerminalConnectingError from './StripeTerminalConnectingError.component';
import StripeTerminalConnectingSuccess from './StripeTerminalConnectingSuccess.component';
import StripeTerminalPaymentSuccess from './StripeTerminalPaymentSuccess.component';
import StripeTerminalUnexpectedDisconnect from './StripeTerminalUnexpectedDisconnect.component';
import StripeTerminalPaymentError from './StripeTerminalPaymentError.component';
import PriceInput from '../../../components/input/PriceInput.component';
import { getStripeTerminalMinAmountCts } from '../utils';
import {
  capturePaymentIntent as capturePaymentIntentAPI,
  fetchConnectionToken as fetchConnectionTokenAPI,
} from '../api';
import {
  getCurrencyDisplayWithPrice,
  getStripeRegion,
} from '../../theme/selectors';
import { updateIntentToSavePaymentMethod } from '#libs/payment/api';

import { OptionCallback } from '../../../state/types';
import { StripeReader } from '#libs/terminal/types';

const useStyles = makeStyles((theme: Theme) => ({
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  readerItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    border: '1px solid rgb(224, 224, 224)',
    borderRadius: '5px',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  readerLabel: {
    fontWeight: 500,
  },
  selectedReader: {
    borderColor: theme.palette.primary.main,
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
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoContainer: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.info.main,
    borderRadius: '5px',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  blueLeftIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(2),
  },
  darkBlue: {
    color: '#0B79D0',
  },
  centerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  stripeTerminalContainer: {
    maxWidth: '650px',
  },
}));

export type Props = {
  stripeReaders: StripeReader[];
  clientSecret: string;
  onCancel?: () => void;
  onSuccess: () => void;
  paymentGroupPriceCts?: number;
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  paymentGroupId?: number;
  setProcessing?: (value: boolean) => void;
  isSetupIntent?: boolean;
  onlySavePaymentMethod?: boolean;
};

const stripeRegion = getStripeRegion();
const stripeTerminalMinAmountCts = getStripeTerminalMinAmountCts();

export const PaymentStripeTerminal = (props: Props) => {
  const { setProcessing } = props;
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [selectedReader, setSelectedReader] = useState(() => {
    if (props.stripeReaders && props.stripeReaders.length === 1) {
      return props.stripeReaders[0];
    }
    return null;
  });
  const [priceUpdaterOpen, setPriceUpdaterOpen] = useState(false);
  const [priceUpdateAmount, setPriceUpdateAmount] = useState(
    props.paymentGroupPriceCts / 100,
  );
  const [saveForLater, setSaveForLater] = useState(() => !!props.isSetupIntent);
  // 'paymentSettings' | 'connecting' | 'connectionError'
  // 'collecting' | 'processing' | 'paymentSuccess' | 'paymentError' | 'unexpectedDisconnect'
  const [step, setStep] = useState('paymentSettings');
  const [error, setError] = useState(null);
  const [retryHandler, setRetryHandler] = useState(null);

  const displayMinAmountMsg =
    props.paymentGroupPriceCts &&
    props.paymentGroupPriceCts < stripeTerminalMinAmountCts;

  useEffect(() => {
    const instanciateTerminal = async () => {
      const onFetchConnectionToken = async () => {
        const response = await fetchConnectionTokenAPI();
        return response.data.secret;
      };
      const onUnexpectedReaderDisconnect = () => {
        setProcessing && setProcessing(false);
        setStep('unexpectedDisconnect');
      };

      const StripeTerminal = await loadStripeTerminal();
      const terminalInstance = StripeTerminal.create({
        onFetchConnectionToken,
        onUnexpectedReaderDisconnect,
      });
      setTerminal(terminalInstance);
    };
    instanciateTerminal();
  }, [setProcessing]);

  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const onConnectHandler = async () => {
    let { clientSecret } = props;
    if (!props.isSetupIntent && saveForLater) {
      try {
        const response = await updateIntentToSavePaymentMethod({
          save_for_later: true,
          payment_group_id: props.paymentGroupId,
        });
        clientSecret = response.data.client_secret;
      } catch (e) {
        console.error(e);
      }
    }
    if (!props.isSetupIntent) initiatePayment(clientSecret);
    else initiateSavePaymentMethod(clientSecret);
  };

  const initiatePayment = async (clientSecret: string) => {
    await connectToReader();
    await collectAndProcessPayment(clientSecret);
  };

  const initiateSavePaymentMethod = async (clientSecret: string) => {
    await connectToReader();
    await collectAndConfirmSetup(clientSecret);
  };

  const connectToReader = async () => {
    setError(null);
    props.setProcessing && props.setProcessing(true);
    setStep('connecting');
    // const config = { simulated: false };
    const config = { simulated: true };
    // terminal.setSimulatorConfiguration({ testCardNumber: '4000000000009995' });
    terminal.setSimulatorConfiguration({
      testCardNumber: '4000000000009995',
    });
    const discoverResult = await terminal.discoverReaders(config);
    // const connectResult = await terminal.connectReader(selectedReader);
    if ('error' in discoverResult) {
      props.setProcessing && props.setProcessing(false);
      setError(discoverResult.error);
      setStep('connectionError');
      setRetryHandler(() => () => {
        setError(null);
        setStep('paymentSettings');
      });
      return;
    }

    const connectResult = await terminal.connectReader(
      discoverResult.discoveredReaders[0],
    );
    if ('error' in connectResult) {
      props.setProcessing && props.setProcessing(false);
      setError(connectResult.error);
      setStep('connectionError');
      setRetryHandler(() => () => {
        setError(null);
        setStep('paymentSettings');
      });
    }
  };

  // -------------------------- PAYMENT INTENT --------------------------
  const collectAndProcessPayment = async (clientSecret: string) => {
    props.setProcessing && props.setProcessing(true);
    setError(null);
    setStep('collecting');
    const resultCollect = await terminal.collectPaymentMethod(clientSecret);
    if ('error' in resultCollect) {
      // When clicking on retry, we should try to collect payment method again
      props.setProcessing && props.setProcessing(false);
      setError(resultCollect.error);
      setStep('paymentError');
      setRetryHandler(() => () => {
        collectAndProcessPayment(clientSecret);
      });
      return;
    }

    processPayment(clientSecret, resultCollect.paymentIntent);
  };

  const processPayment = async (
    clientSecret: string,
    paymentIntent: ISdkManagedPaymentIntent,
  ) => {
    props.setProcessing && props.setProcessing(true);
    setError(null);
    setStep('processing');
    const resultProcess = await terminal.processPayment(paymentIntent);

    if (!('error' in resultProcess)) {
      await capturePaymentIntentAPI({
        payment_intent_id: resultProcess.paymentIntent.id,
      });
      setStep('paymentSuccess');
      props.setProcessing && props.setProcessing(false);
      props.onSuccess();
      return;
    }

    props.setProcessing && props.setProcessing(false);
    setError(resultProcess.error);
    setStep('paymentError');

    if (!resultProcess.error.payment_intent) {
      // Request to Stripe timed out, unknown PaymentIntent status: Retry processing
      // the original PaymentIntent.Don’t create a new one, as that could result
      // in multiple authorizations for the cardholder.
      setRetryHandler(() => () => {
        processPayment(clientSecret, paymentIntent);
      });
      return;
    }

    if (
      ['requires_payment_method', 'requires_source'].includes(
        resultProcess.error.payment_intent.status,
      )
    ) {
      // Payment method declined: Try collecting a different payment method
      // by calling collectPaymentMethod again with the same PaymentIntent.
      setRetryHandler(() => () => {
        collectAndProcessPayment(clientSecret);
      });
      return;
    }

    if (resultProcess.error.payment_intent.status === 'requires_confirmation') {
      // Temporary connectivity problem: call processPayment again
      // with the same PaymentIntent to retry the request.
      setRetryHandler(() => () => {
        processPayment(clientSecret, paymentIntent);
      });
    }
  };

  // --------------------------------------------------------------------

  // --------------------------- SETUP INTENT ---------------------------
  const collectAndConfirmSetup = async (clientSecret: string) => {
    props.setProcessing && props.setProcessing(true);
    setError(null);
    setStep('collecting');
    const resultCollect = await terminal.collectSetupIntentPaymentMethod(
      clientSecret,
      true,
    );
    if ('error' in resultCollect) {
      // When clicking on retry, we should try to collect payment method again
      props.setProcessing && props.setProcessing(false);
      setError(resultCollect.error);
      setStep('paymentError');
      setRetryHandler(() => () => {
        collectAndProcessPayment(clientSecret);
      });
      return;
    }

    confirmSetup(clientSecret, resultCollect.setupIntent);
  };

  const confirmSetup = async (clientSecret: string, setupIntent: any) => {
    props.setProcessing && props.setProcessing(true);
    setError(null);
    setStep('processing');
    const resultConfirm = await terminal.confirmSetupIntent(setupIntent);
    if ('error' in resultConfirm) {
      // call processPayment again with the same PaymentIntent to retry the request.
      setError(resultConfirm.error);
      props.setProcessing && props.setProcessing(false);
      setStep('paymentError');
      setRetryHandler(() => () => {
        collectAndConfirmSetup(clientSecret);
      });
      return;
    }

    setStep('paymentSuccess');
    props.setProcessing && props.setProcessing(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  };
  // --------------------------------------------------------------------

  return (
    <div>
      {step === 'connecting' && <StripeTerminalConnectingLoading />}
      {['collecting', 'processing'].includes(step) && (
        <StripeTerminalConnectingSuccess
          isSetupIntent={!!props.isSetupIntent}
          isProcessing={step === 'processing'}
        />
      )}
      {step === 'paymentSuccess' && (
        <StripeTerminalPaymentSuccess
          isSetupIntent={props.isSetupIntent}
          onlySavePaymentMethod={!!props.onlySavePaymentMethod}
        />
      )}
      {step === 'paymentError' && (
        <StripeTerminalPaymentError
          error={error}
          isSetupIntent={!!props.isSetupIntent}
          onRetry={retryHandler}
          onCancel={props.onCancel}
        />
      )}
      {step === 'connectionError' && (
        <StripeTerminalConnectingError
          error={error}
          onCancel={props.onCancel}
          onRetry={retryHandler}
        />
      )}
      {step === 'unexpectedDisconnect' && (
        <StripeTerminalUnexpectedDisconnect
          onCancel={props.onCancel}
          onRetry={() => {
            setStep('paymentSettings');
          }}
        />
      )}
      {step === 'paymentSettings' && (
        <div className={classes.stripeTerminalContainer}>
          {!props.isSetupIntent && (
            <Typography variant="h6">
              {t('configuration.stripeTerminal.paymentDialog.amountToPay')}
            </Typography>
          )}
          {!!priceUpdaterOpen && (
            <div className={classes.priceContainer}>
              <PriceInput
                value={priceUpdateAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPriceUpdateAmount(Number.parseFloat(e.target.value))
                }
              />
              <IconButton
                color="primary"
                onClick={() =>
                  props.updatePriceCts(priceUpdateAmount * 100, {
                    onSuccess: () => setPriceUpdaterOpen(false),
                  })
                }
              >
                <SaveIcon />
              </IconButton>
            </div>
          )}
          {!priceUpdaterOpen && !!props.paymentGroupPriceCts && (
            <div className={classes.priceContainer}>
              <Typography variant="h5">
                {`${getCurrencyDisplayWithPrice(
                  (props.paymentGroupPriceCts / 100).toFixed(2),
                )}`}
              </Typography>
              {!!props.updatePriceCts && (
                <IconButton
                  color="primary"
                  onClick={() => setPriceUpdaterOpen(true)}
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
          )}
          {displayMinAmountMsg ? (
            <div className={classes.centerContainer}>
              <span className={classes.infoContainer}>
                <InfoOutlinedIcon className={classes.blueLeftIcon} />
                <Typography
                  variant="body1"
                  component="span"
                  className={classes.darkBlue}
                >
                  {t(
                    'configuration.stripeTerminal.paymentDialog.minAmountInfo',
                    {
                      amountString: getCurrencyDisplayWithPrice(
                        (stripeTerminalMinAmountCts / 100).toFixed(2),
                      ),
                    },
                  )}
                </Typography>
              </span>
            </div>
          ) : (
            <>
              <Typography variant="h6">
                {t('configuration.stripeTerminal.paymentDialog.radio')}
              </Typography>
              <div>
                {props.stripeReaders.map((reader) => (
                  <>
                    <ButtonBase
                      className={classnames(classes.readerItem, {
                        [classes.selectedReader]:
                          selectedReader && selectedReader.id === reader.id,
                      })}
                      key={reader.id}
                      onClick={() => setSelectedReader(reader)}
                    >
                      <Typography classes={{ root: classes.readerLabel }}>
                        {reader.label}
                      </Typography>
                      <Typography>{reader.serial_number}</Typography>
                    </ButtonBase>
                  </>
                ))}
              </div>
              {stripeRegion === 'NorthAmerica' && (
                <div className={classes.row}>
                  <Checkbox
                    checked={saveForLater}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSaveForLater(e.target.checked)
                    }
                    disabled={!!props.isSetupIntent}
                  />
                  <Typography>
                    {t('paymentPanel.actions.saveForLater')}
                  </Typography>
                </div>
              )}
            </>
          )}
          <div className={classes.actionRow}>
            <Button
              color="primary"
              variant="contained"
              disabled={
                !props.clientSecret || !selectedReader || displayMinAmountMsg
              }
              onClick={onConnectHandler}
            >
              {t('configuration.stripeTerminal.paymentDialog.connectAndPay')}
            </Button>
            {props.onCancel && (
              <Button onClick={props.onCancel}>
                {t('paymentPanel.actions.cancel')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStripeTerminal;
