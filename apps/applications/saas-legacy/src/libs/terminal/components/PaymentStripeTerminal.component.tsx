import React, { useCallback, useEffect, useState } from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { captureException } from '@sentry/react';
import StripeTerminalError from '#src/libs/terminal/components/StripeTerminalError';
import StripeTerminalProcessing from '#src/libs/terminal/components/StripeTerminalProcessing';
import StripeTerminalPaymentSuccess from '#src/libs/terminal/components/StripeTerminalSuccess';
import PriceInput from '#src/components/input/PriceInput.component';

import {
  cancelReaderAction as cancelReaderActionAPI,
  processPaymentIntent as processPaymentIntentAPI,
  processSetupIntent as processSetupIntentPI,
  retrieveReaderActionSumup as retrieveReaderActionSumupAPI,
} from '#src/libs/terminal/api';
import type { StripeAPIException } from '#src/libs/payment/types';
import { parseIntentIdFromClientSecret } from '#src/libs/terminal/utils';
import { updateIntentToSavePaymentMethod } from '#src/libs/payment/api';

import { STRIPE_ERROR_CODE } from '#src/libs/constants';
import type {
  CancelReaderActionErrorMessage,
  ReaderActionSumup,
  StripeReader,
} from '#src/libs/terminal/types'; // eslint-disable-next-line no-duplicate-imports
import { TerminalPaymentSteps } from '#src/libs/terminal/types';
import type { OptionCallback } from '../../../state/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

const POLL_RETRY_INACTIVITY_THRESHOLD = 60;
const POLL_RETRY_DELAY_MS = 1000;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    maxWidth: '600px',
    margin: 'auto',
    width: '100%',
    minWidth: '400px',
  },
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
    margin: 'auto',
  },
}));

const recursivePoll = async (
  selectedReader: string,
  nbPreviousRetries: number,
  onInactivityThresholdReachedCallback: () => void,
  onActionSucceededCallback: () => void,
  onActionFailedCallback: (readerActionSumup: ReaderActionSumup) => void,
  setPollingTimeoutId: (id: ReturnType<typeof setTimeout>) => void,
  inactivityThresholdExceeded: boolean = false,
) => {
  let nextInactivityThresholdExceeded = inactivityThresholdExceeded;
  if (
    nbPreviousRetries >= POLL_RETRY_INACTIVITY_THRESHOLD &&
    !inactivityThresholdExceeded
  ) {
    onInactivityThresholdReachedCallback();
    nextInactivityThresholdExceeded = true;
  }
  try {
    const sumupResponse = await retrieveReaderActionSumupAPI(selectedReader);
    const sumup = sumupResponse.data;

    switch (sumup.status) {
      case 'succeeded':
        onActionSucceededCallback();
        return;
      case 'failed':
        onActionFailedCallback(sumup);
        return;
      default:
        setPollingTimeoutId(
          setTimeout(
            () =>
              recursivePoll(
                selectedReader,
                nbPreviousRetries + 1,
                onInactivityThresholdReachedCallback,
                onActionSucceededCallback,
                onActionFailedCallback,
                setPollingTimeoutId,
                nextInactivityThresholdExceeded,
              ),
            POLL_RETRY_DELAY_MS,
          ),
        );
    }
  } catch (_err) {
    setPollingTimeoutId(
      setTimeout(
        () =>
          recursivePoll(
            selectedReader,
            nbPreviousRetries + 1,
            onInactivityThresholdReachedCallback,
            onActionSucceededCallback,
            onActionFailedCallback,
            setPollingTimeoutId,
            nextInactivityThresholdExceeded,
          ),
        POLL_RETRY_DELAY_MS,
      ),
    );
  }
};

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
  hideAmountToPay?: boolean;
  hideSaveForLater?: boolean;
  children?: React.ReactNode;
  customClasses?: {
    [className: string]: string;
  };
  loading?: boolean;
};

export const PaymentStripeTerminal: React.FC<Props> = ({
  isSetupIntent,
  clientSecret,
  setProcessing,
  stripeReaders,
  customClasses,
  children,
  onCancel,
  hideAmountToPay,
  hideSaveForLater,
  paymentGroupPriceCts,
  updatePriceCts,
  paymentGroupId,
  onSuccess,
  onlySavePaymentMethod,
  loading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('invoice');

  const [selectedReader, setSelectedReader] = useState<string | null>(
    () => stripeReaders?.[0]?.id ?? null,
  );

  const [clientSecretOverride, setClientSecretOverride] = useState<
    string | null
  >(null);

  const [pollingTimeoutId, setPollingTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [cancelReaderActionProcessing, setCancelReaderActionProcessing] =
    useState(false);

  const [priceUpdaterOpen, setPriceUpdaterOpen] = useState(false);

  const [priceUpdateAmount, setPriceUpdateAmount] = useState(
    paymentGroupPriceCts / 100,
  );
  const [saveForLater, setSaveForLater] = useState(() => !!isSetupIntent);

  const [step, setStep] = useState<TerminalPaymentSteps>(
    TerminalPaymentSteps.SETTINGS,
  );
  const [error, setError] = useState<StripeAPIException | null>(null);

  const [cancelErrorMessage, setCancelErrorMessage] =
    useState<CancelReaderActionErrorMessage | null>();

  const [shouldDisplayInactivityWarning, setShouldDisplayInactivityWarning] =
    useState(false);

  useEffect(() => {
    return () => clearTimeout(pollingTimeoutId);
  }, [pollingTimeoutId]);

  // Always auto-select the first reader when returning to SETTINGS step
  useEffect(() => {
    if (step !== TerminalPaymentSteps.SETTINGS || selectedReader !== null)
      return;
    setSelectedReader(stripeReaders?.[0]?.id);
  }, [step, stripeReaders, selectedReader]);

  const togglePriceUpdaterOpenHandler = useCallback(() => {
    setPriceUpdaterOpen((previousValue) => !previousValue);
  }, []);

  const updatePriceHandler = useCallback(() => {
    updatePriceCts(Math.round(priceUpdateAmount * 100) || 0, {
      onSuccess: togglePriceUpdaterOpenHandler,
    });
  }, [updatePriceCts, togglePriceUpdaterOpenHandler, priceUpdateAmount]);

  const resetPoll = useCallback(() => {
    clearTimeout(pollingTimeoutId);
    setPollingTimeoutId(null);
  }, [pollingTimeoutId]);

  const redirectToStep = useCallback(
    (targetStep: TerminalPaymentSteps) => {
      resetPoll();
      setStep(targetStep);
    },
    [resetPoll],
  );

  const handleGoBackToSettings = useCallback(() => {
    setProcessing && setProcessing(false);
    setError(null);
    setSelectedReader(null);
    redirectToStep(TerminalPaymentSteps.SETTINGS);
  }, [setProcessing, redirectToStep]);

  const onInactivityThresholdReached = useCallback(() => {
    // Display inactivity warning, and starts countdown
    // On countdown end: cancels the operation and go back to settings step
    setShouldDisplayInactivityWarning(true);
  }, []);

  const onActionSucceeded = useCallback(() => {
    redirectToStep(TerminalPaymentSteps.SUCCESS);
    onSuccess();
  }, [onSuccess, redirectToStep]);

  const onActionFailed = useCallback(
    (readerActionSumup: ReaderActionSumup) => {
      setError({
        code: readerActionSumup.failure_code,
        message: readerActionSumup.failure_message,
      });
      redirectToStep(TerminalPaymentSteps.ERROR);
    },
    [redirectToStep],
  );

  const onClickIAmHere = useCallback(() => {
    // removes the warning, and resets the API poll
    setShouldDisplayInactivityWarning(false);
    resetPoll();
    recursivePoll(
      selectedReader,
      0,
      onInactivityThresholdReached,
      onActionSucceeded,
      onActionFailed,
      setPollingTimeoutId,
    );
  }, [
    selectedReader,
    onInactivityThresholdReached,
    onActionFailed,
    onActionSucceeded,
    resetPoll,
  ]);

  // -- Initiates payment --
  const onConnectHandler = useCallback(async () => {
    let updatedSecret;
    if (!isSetupIntent && saveForLater) {
      try {
        const updateIntentResponse = await updateIntentToSavePaymentMethod({
          save_for_later: true,
          payment_group_id: paymentGroupId,
        });
        updatedSecret = updateIntentResponse.data.client_secret;
        setClientSecretOverride(updatedSecret);
      } catch (e) {
        console.error(e);
        captureException(e);
        redirectToStep(TerminalPaymentSteps.ERROR);
      }
    }

    const intentId = parseIntentIdFromClientSecret(
      updatedSecret || clientSecretOverride || clientSecret,
    );
    redirectToStep(TerminalPaymentSteps.PROCESSING);

    try {
      setProcessing && setProcessing(true);
      await (isSetupIntent
        ? processSetupIntentPI(selectedReader, { setup_intent_id: intentId })
        : processPaymentIntentAPI(selectedReader, {
            payment_intent_id: intentId,
            save_for_later: saveForLater,
          }));
      recursivePoll(
        selectedReader,
        0,
        onInactivityThresholdReached,
        onActionSucceeded,
        onActionFailed,
        setPollingTimeoutId,
      );
    } catch (err) {
      if (err.response?.status === STRIPE_ERROR_CODE) {
        setError(err.response.data);
      }
      redirectToStep(TerminalPaymentSteps.ERROR);
    }
  }, [
    clientSecret,
    isSetupIntent,
    selectedReader,
    setProcessing,
    clientSecretOverride,
    paymentGroupId,
    saveForLater,
    redirectToStep,
    onActionFailed,
    onActionSucceeded,
    onInactivityThresholdReached,
  ]);
  // -----------------------------

  const cancelReaderActionHandler = async (options?: OptionCallback) => {
    setCancelReaderActionProcessing(true);
    try {
      await cancelReaderActionAPI(selectedReader);
      clearTimeout(pollingTimeoutId);
      handleGoBackToSettings();
      options?.onSuccess?.();
    } catch (err) {
      if (
        err.response?.status === STRIPE_ERROR_CODE &&
        err.response.data.code === 'terminal_reader_busy'
      ) {
        const translationKeyPath = `configuration.stripeTerminal.paymentDialog.${
          onlySavePaymentMethod ? 'processingSavePaymentMethod' : 'processing'
        }`;

        setCancelErrorMessage({
          title: `${translationKeyPath}.cancelError.readerBusy.title`,
          content: `${translationKeyPath}.cancelError.readerBusy.content`,
        });
      } else {
        setCancelErrorMessage({
          title:
            'configuration.stripeTerminal.paymentDialog.processing.cancelError.generic.title',
          content:
            'configuration.stripeTerminal.paymentDialog.processing.cancelError.generic.content',
        });
      }
      options?.onError?.();
    }
    setCancelReaderActionProcessing(false);
  };

  const onInactivityWarningFinish = () => {
    cancelReaderActionHandler({
      onSuccess: () => setShouldDisplayInactivityWarning(false),
      onError: () => setShouldDisplayInactivityWarning(false),
    });
  };

  return (
    <div className={clsx(classes.container, customClasses?.container)}>
      {step === TerminalPaymentSteps.ERROR && (
        <StripeTerminalError
          error={error}
          isSetupIntent={isSetupIntent}
          onClose={handleGoBackToSettings}
        />
      )}

      {step === TerminalPaymentSteps.SUCCESS && (
        <StripeTerminalPaymentSuccess
          isSetupIntent={isSetupIntent}
          onlySavePaymentMethod={!!onlySavePaymentMethod}
        />
      )}

      {step === TerminalPaymentSteps.PROCESSING && (
        <StripeTerminalProcessing
          cancelErrorMessage={cancelErrorMessage}
          cancelReaderActionProcessing={cancelReaderActionProcessing}
          // @ts-expect-error
          isSetupIntent={isSetupIntent}
          onCancelReaderAction={cancelReaderActionHandler}
          onClickIAmHere={onClickIAmHere}
          onInactivityWarningFinish={onInactivityWarningFinish}
          onlySavePaymentMethod={!!onlySavePaymentMethod}
          // dirty but could not find another way
          shouldDisplayInactivityWarning={
            shouldDisplayInactivityWarning && !cancelErrorMessage
          }
        />
      )}

      {step === TerminalPaymentSteps.SETTINGS && (
        <div
          className={clsx(
            classes.stripeTerminalContainer,
            customClasses?.stripeTerminalContainer,
          )}
        >
          {!hideAmountToPay ? (
            <>
              {!isSetupIntent && (
                <Typography variant="h6">
                  {t('configuration.stripeTerminal.paymentDialog.amountToPay')}
                </Typography>
              )}
              {!!priceUpdaterOpen && (
                <div className={classes.priceContainer}>
                  <PriceInput
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPriceUpdateAmount(Number.parseFloat(e.target.value))
                    }
                    value={priceUpdateAmount}
                  />
                  <IconButton color="primary" onClick={updatePriceHandler}>
                    <SaveIcon />
                  </IconButton>
                </div>
              )}
              {!priceUpdaterOpen && !!paymentGroupPriceCts && (
                <div className={classes.priceContainer}>
                  <Typography variant="h5">
                    {`${getCurrencyDisplayWithPrice(
                      (paymentGroupPriceCts / 100).toFixed(2),
                    )}`}
                  </Typography>
                  {!!updatePriceCts && (
                    <IconButton
                      color="primary"
                      onClick={togglePriceUpdaterOpenHandler}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </div>
              )}
            </>
          ) : null}

          <>
            <Typography variant="h6">
              {t('configuration.stripeTerminal.paymentDialog.radio')}
            </Typography>
            <div>
              {stripeReaders.map((reader) => (
                <React.Fragment key={reader.id}>
                  <ButtonBase
                    className={clsx(classes.readerItem, {
                      [classes.selectedReader]: selectedReader === reader.id,
                    })}
                    onClick={() => setSelectedReader(reader.id)}
                  >
                    <Typography classes={{ root: classes.readerLabel }}>
                      {reader.label}
                    </Typography>
                    <Typography>{reader.serial_number}</Typography>
                  </ButtonBase>
                </React.Fragment>
              ))}
            </div>
            {!hideSaveForLater && (
              <div className={classes.row}>
                <Checkbox
                  checked={saveForLater}
                  color="primary"
                  disabled={!!isSetupIntent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSaveForLater(e.target.checked)
                  }
                />
                <Typography>
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
              </div>
            )}
          </>

          {children || null}

          <div className={clsx(classes.actionRow, customClasses?.actionRow)}>
            <Button
              color="primary"
              disabled={!clientSecret || !selectedReader || loading}
              onClick={onConnectHandler}
              variant="contained"
            >
              {t('configuration.stripeTerminal.paymentDialog.connectAndPay')}
            </Button>
            {onCancel && (
              <Button onClick={onCancel}>
                {t('paymentPanel.actions.cancel')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PaymentStripeTerminal);
