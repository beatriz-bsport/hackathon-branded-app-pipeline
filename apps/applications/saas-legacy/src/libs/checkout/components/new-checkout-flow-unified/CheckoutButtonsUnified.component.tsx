import React from 'react';
import { useTranslation } from 'react-i18next';

import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import UpdateIcon from '@material-ui/icons/Update';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { isWidthDown } from '@material-ui/core/withWidth';

import PopOver from '#src/components/Popover';
import { SUBMIT_BUTTONS } from '#src/libs/checkout/types';
import { useWidth } from '#src/hooks/useWidth';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalPaymentButton from '#src/libs/payment/components/paypal/PayPalPaymentButton.component';
import { getPayPalScriptProviderOptions } from '#src/libs/payment/utils';
import { usePaymentBasketButtonsUnified } from './hooks/usePaymentBasketButtonsUnified';
import { useBasketPaymentStoreData } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentStoreData';
import { useBasketPaymentContext } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import { useCompanyPaymentSettings } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useCompanyPaymentSettings';
import { usePayment } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePayment';
import { getFirstInstalmentAmount } from '#src/libs/instalment-payment-configuration/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

type CheckoutButtonsProps = {
  checkoutStepsRef: React.MutableRefObject<any>;
  paymentContext: {
    basketId: string;
    memberId: number;
    companyId: number;
  };
  totalAmountToPay: number;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
};

export const CheckoutButtonsUnified: React.FC<CheckoutButtonsProps> = ({
  checkoutStepsRef,
  paymentContext,
  totalAmountToPay,
  onConfirmPaymentSuccess,
}) => {
  const width = useWidth();
  const isMobile = isWidthDown('sm', width);
  const classes = useStyles();
  const { t } = useTranslation('checkout');
  const [isPayLaterInfoDisplayed, setIsPayLaterInfoDisplayed] =
    React.useState(false);

  const OnInfoRequest = React.useCallback(
    () => setIsPayLaterInfoDisplayed(!isPayLaterInfoDisplayed),
    [isPayLaterInfoDisplayed],
  );

  const {
    instalmentPaymentSelectedId,
    isInternalAccountAmountEditing,
    termsAccepted,
  } = useBasketPaymentContext();
  const { generalTermsAndConditions } = useCompanyPaymentSettings(
    paymentContext.companyId,
  );

  const { instalmentPaymentConfigurations } = useBasketPaymentStoreData(
    paymentContext.basketId,
    paymentContext.memberId,
  );

  const selectedInstalmentConfig =
    Array.isArray(instalmentPaymentConfigurations) &&
    instalmentPaymentConfigurations.length > 0
      ? instalmentPaymentConfigurations.find(
          (ipc) => ipc.id === instalmentPaymentSelectedId,
        ) || null
      : null;

  const payNowAmount = selectedInstalmentConfig
    ? getFirstInstalmentAmount(selectedInstalmentConfig, totalAmountToPay)
    : totalAmountToPay;

  const { clientSecret, isClientSecretLoading } = usePayment(
    paymentContext.basketId,
    paymentContext.companyId,
    paymentContext.memberId,
  );

  const paymentButtonsConfiguration = usePaymentBasketButtonsUnified({
    paymentBasketRef: checkoutStepsRef,
    paymentContext,
    onConfirmPaymentSuccess,
  });

  // Only disable payment buttons if terms not accepted
  const buttonsWithTerms = paymentButtonsConfiguration.map((btnConfig) => {
    if (
      isInternalAccountAmountEditing ||
      ((btnConfig.button.id === SUBMIT_BUTTONS.PAY_NOW_BUTTON.id ||
        btnConfig.button.id === SUBMIT_BUTTONS.PAYPAL_BUTTON.id ||
        btnConfig.button.id === SUBMIT_BUTTONS.PAY_LATER_BUTTON.id ||
        btnConfig.button.id === SUBMIT_BUTTONS.CONFIRM_BUTTON.id) &&
        !termsAccepted &&
        generalTermsAndConditions.length > 0)
    ) {
      return {
        ...btnConfig,
        isDisabled: true,
      };
    }
    return btnConfig;
  });

  return (
    <div className={classes.buttonsContainer}>
      {buttonsWithTerms.map(
        ({ button, isDisabled, isProcessing, callbacks }) => {
          if (button.id === SUBMIT_BUTTONS.PAYPAL_BUTTON.id) {
            return (
              <div key={button.id} className={classes.paypalButton}>
                {isClientSecretLoading ? (
                  <CircularProgress />
                ) : (
                  <PayPalScriptProvider
                    options={getPayPalScriptProviderOptions(clientSecret)}
                  >
                    {isProcessing && (
                      <div className={classes.paypalButtonProcessing}>
                        <CircularProgress />
                      </div>
                    )}
                    {callbacks.createOrder &&
                      callbacks.onApprove &&
                      callbacks.onCancel &&
                      callbacks.onError && (
                        <PayPalPaymentButton
                          createOrder={callbacks.createOrder}
                          isDisabled={isDisabled || isProcessing}
                          onApprove={callbacks.onApprove}
                          onCancel={callbacks.onCancel}
                          onError={callbacks.onError}
                        />
                      )}
                  </PayPalScriptProvider>
                )}
              </div>
            );
          }

          if (button.id === SUBMIT_BUTTONS.PAY_LATER_BUTTON.id) {
            return (
              <div key={button.id}>
                <div className={classes.payLaterContainer}>
                  <Button
                    className={classes.payLaterButton}
                    disabled={isDisabled || isProcessing}
                    {...callbacks}
                    variant="outlined"
                  >
                    {isProcessing && (
                      <CircularProgress
                        color="inherit"
                        size={24}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <UpdateIcon className={classes.iconLeft} />
                    {t(button.textPath)}
                  </Button>
                  {isMobile ? (
                    <IconButton onClick={OnInfoRequest}>
                      <Info />
                    </IconButton>
                  ) : (
                    <div className={classes.payLaterInfoContainer}>
                      <PopOver
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        className={classes.payLaterText}
                        title={t('payLater.explain')}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <Info className={classes.infoIcon} />
                      </PopOver>
                    </div>
                  )}
                </div>
                <div>
                  {isMobile && isPayLaterInfoDisplayed && (
                    <div className={classes.greyContainer}>
                      {t('payLater.explain')}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <Button
              key={button.id}
              className={classes.submitButton}
              color="primary"
              disabled={isDisabled || isProcessing}
              {...callbacks}
              variant={button.variant as 'text' | 'outlined' | 'contained'}
            >
              {isProcessing && (
                <CircularProgress
                  color="inherit"
                  size={24}
                  style={{ marginRight: 8 }}
                />
              )}
              {button.id === SUBMIT_BUTTONS.PAY_NOW_BUTTON.id
                ? // TODO: Replace by "button.textPath", update translation in `src/libs/checkout/types.ts` & delete payNow translation when Feature Flag is removed
                  t('validation.actions.payAmountNow', {
                    amount: getCurrencyDisplayWithPrice(payNowAmount),
                  })
                : t(button.textPath)}
            </Button>
          );
        },
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  return {
    buttonsContainer: {
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '0 1px 1px 1px',
      borderColor: theme.palette.grey[100],
      borderRadius: '0 0 12px 12px',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        boxSizing: 'content-box',
        borderWidth: '0px',
      },
    },
    infoIcon: { color: theme.palette.grey[600] },
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    payLaterButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      borderRadius: theme.spacing(3),
      borderColor: theme.palette.primary.main,
      background: theme.palette.background.paper,
      flex: 1,
      color: theme.palette.primary.main,
      textTransform: 'none',
    },
    paypalButtonProcessing: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    paypalButton: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(4),
      alignItems: 'center',
      margin: ` 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
        2,
      )}px`,
      borderRadius: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        margin: ` 0 0 ${theme.spacing(2)}px 0`,
      },
    },
    payLaterContainer: {
      display: 'flex',
      flexDirection: 'row',
      margin: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
        2,
      )}px`,
      gap: theme.spacing(1),
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        margin: ` 0 0 ${theme.spacing(2)}px 0`,
      },
    },
    payLaterInfoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.spacing(1),
      },
    },
    payLaterText: {
      maxWidth: '250px',
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '14px',
    },
    submitButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      margin: ` 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
        2,
      )}px`,
      borderRadius: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        margin: ` 0 0 ${theme.spacing(2)}px 0`,
      },
      textTransform: 'none',
    },
    greyContainer: {
      backgroundColor: grey[100],
      borderRadius: theme.spacing(1.5),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  };
});

export default React.memo(CheckoutButtonsUnified);
