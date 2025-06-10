import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import clsx from 'clsx';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';

import {
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Info from '@material-ui/icons/Info';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA } from '@bsport/common/lib/master-data/payment-group.js';

import { STRIPE_SEPA_ERROR_CODES } from '#src/libs/payment/constants';
import type { PaymentMethod } from '#src/libs/payment/types';

import {
  blockPendingBasket as blockPendingBasketAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import { confirmStripePayment as confirmStripePaymentAction } from '#src/libs/payment/payment-module-revamped/actions';

import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';
import PaymentMethodList from '#src/libs/payment/components/payment-method-list/PaymentMethodList.component';
import PopOver from '#src/components/Popover';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';

type PaymentStripeSEPAProps = {
  AcceptTermsAndConditionsComponent?: React.Component;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId?: string;
  basketTotalPriceCts?: number;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  children?: React.ReactNode;
  clientSecret: string;
  companyCountry?: string;
  creditAccountBalance?: number | null;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  customClasses?: { [className: string]: string };
  detachPaymentMethod: (paymentMetodId: string) => void;
  detachPaymentMethodLoading: boolean;
  forceButtonDisplay?: boolean;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  hideSaveForLater?: boolean;
  invalidatePendingBookingsIfNecessary?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  memberId?: number;
  onCancel: () => void;
  onError?: () => void;
  onSaveForLaterChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSuccess: (callback: () => void) => void;
  paymentGroupId: number;
  saveForLater?: boolean;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing: (processing: boolean) => void;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  userDefaultEmail?: string;
  userDefaultName?: string;
};

export const PaymentStripeSEPA = forwardRef(
  (
    {
      AcceptTermsAndConditionsComponent,
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      applyBalanceToInvoice,
      basketId,
      basketTotalPriceCts,
      checkItemsBasket,
      children,
      clientSecret,
      companyCountry,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      customClasses,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      forceButtonDisplay,
      forceDisabled,
      forceHideConfirmPaymentButton,
      forceSave,
      hasAddPaymentMethodPermission = true,
      hideSaveForLater,
      invalidatePendingBookingsIfNecessary,
      isEstablishmentBillingGroupSelected,
      loading,
      memberId,
      onCancel,
      onError,
      onSaveForLaterChange,
      onSuccess,
      paymentGroupId,
      saveForLater,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      termsAndConditionsAccepted,
      useInternalAccount,
      userDefaultEmail,
      userDefaultName,
    }: PaymentStripeSEPAProps,
    ref,
  ) => {
    const isCheckoutContext = useContext(CheckoutContext);
    const classes = useStyles({ isCheckoutContext });
    const { t } = useTranslation(['invoice', 'payment']);
    const dispatch = useDispatch();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<StripeError | undefined>(undefined);
    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>(
      [],
    );
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<
      string | undefined
    >(undefined);
    const [hasDetached, setHasDetached] = useState<string | null>(null);
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
    const [isFetchFinished, setIsFetchFinished] = useState(false);

    const setPaymentPageProcessing = useCallback(
      (process) => {
        if (setPaymentProcessing) setPaymentProcessing(process);
        setIsProcessing(process);
      },
      [setIsProcessing, setPaymentProcessing],
    );

    useEffect(() => {
      const fetchPaymentMethods = async () => {
        try {
          const response = await fetchPaymentMethodListAPI({
            member: memberId,
          });
          const sepaPaymentMethods = response.data.filter(
            (pm) => pm.type === 'sepa_debit',
          );
          setPaymentMethodList(sepaPaymentMethods);

          if (sepaPaymentMethods.length > 0) {
            setIsAddingPaymentMethod(false);
            setPaymentMethodSelected(sepaPaymentMethods[0].id);
          } else {
            setIsAddingPaymentMethod(true);
            setPaymentMethodSelected(undefined);
          }
        } catch (fetchError) {
          console.error('Failed to fetch payment methods:', fetchError);
          setPaymentMethodList([]);
          setIsAddingPaymentMethod(true);
          setPaymentMethodSelected(undefined);
        } finally {
          setIsFetchFinished(true);
        }
      };

      fetchPaymentMethods();
    }, [memberId, hasDetached]);

    const isSubmitButtonDisabled =
      forceDisabled ||
      !stripe ||
      !termsAndConditionsAccepted ||
      !isEstablishmentBillingGroupSelected ||
      (!hasAddPaymentMethodPermission && !paymentMethodList.length);

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        setPaymentPageProcessing(true);
        setError(undefined);
        elements?.submit();

        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }

        if (basketId) {
          /**
           * checkItemsBasket and verifyPriceBasketAPI are intentionally not moved to a Redux action because:
           * 1. They are always executed within the context of a checkout process, specifically inside an iframe widget.
           * 2. The data returned by these API calls do not need to be stored or managed within the Redux store.
           * Therefore, keeping these API calls local to this context is more appropriate and efficient.
           */
          const { data } = await verifyPriceBasketAPI(basketId);

          const basketItemsChecked = await checkItemsBasket(basketId);
          if (!basketItemsChecked) {
            setPaymentPageProcessing(false);
            return;
          }

          if (
            (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
            basketTotalPriceCts !== data
          ) {
            setPaymentPageProcessing(false);

            window.alert(t('paymentPanel.actions.basketInconsistent'));
            window.location.reload();
            return;
          }
        }

        createPendingBookingsIfNecessary?.({
          payment_group_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        });

        const url = new URL(window.location.toString());
        const params = url.searchParams;
        params.delete('user_registration_response');
        params.set('check_payment_intent', 'true');
        params.set('get_user_registration_from_storage', 'true');

        if (basketId) {
          // Include the current basket id in the return URL, so that the basket page keeps track
          // of it after the redirection
          params.set('basket_redirection', basketId);
        }

        dispatch(
          confirmStripePaymentAction(
            {
              saveForLater: saveForLater || forceSave,
              paymentGroupId,
              stripe,
              elements,
              clientSecret,
              shouldConfirmSepaDebitPayment:
                !isAddingPaymentMethod && !!paymentMethodList.length,
              paymentMethodSelected,
              paymentMethodData: {
                /* Stripe requires all billing details fields to be provided to prevent errors,
                   even though we intentionally hide phone & address in the payment element UI.

                   Important notes:
                   - Empty strings will cause Stripe validation errors
                   - Must use null instead of empty strings
                   - name/email are redundant since they can be updated directly in payment element
                   - These null values get overridden by any values entered in payment element
                */
                billing_details: {
                  name: null,
                  email: null,
                  phone: null,
                  address: {
                    country: null,
                    postal_code: null,
                    state: null,
                    city: null,
                    line1: null,
                    line2: null,
                  },
                },
              },
            },
            {
              onPaymentError: (err) => {
                setError(err);
                setPaymentPageProcessing(false);
                invalidatePendingBookingsIfNecessary?.();
                onError?.();
              },
              onPaymentSuccess: async () => {
                if (basketId) {
                  try {
                    await blockPendingBasketAPI(basketId);
                  } catch (err) {
                    console.error(err);
                  }
                }

                onSuccess(() => setPaymentPageProcessing(false));
              },
            },
          ),
        );
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        dispatch,
        elements,
        forceSave,
        invalidatePendingBookingsIfNecessary,
        isAddingPaymentMethod,
        onError,
        onSuccess,
        paymentGroupId,
        paymentMethodList.length,
        paymentMethodSelected,
        saveForLater,
        setPaymentPageProcessing,
        stripe,
        t,
      ],
    );
    // This hook is required in the new checkout flow, in order to call the submit callback defined
    // in the payment method component from the parent component.
    useImperativeHandle(
      ref,
      () => {
        return {
          onPaymentConfirm: handleSubmit,
        };
      },
      [handleSubmit],
    );

    const defineSelectedPaymentMethod = (id: string) => {
      if (id !== paymentMethodSelected) {
        setPaymentMethodSelected(id);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {!isFetchFinished ? (
          <LinearProgress />
        ) : (
          <>
            <Typography variant="h6">
              {t(
                `payment:forms.savePaymentMethod.${
                  isAddingPaymentMethod ? 'add' : 'select'
                }`,
              )}
            </Typography>
            {isAddingPaymentMethod && (
              <>
                {!hasAddPaymentMethodPermission ? (
                  <Typography>
                    {t(
                      'payment:forms.paymentMethod.actions.addPaymentMethodDenied',
                    )}
                  </Typography>
                ) : (
                  <div>
                    <div style={isProcessing ? { display: 'none' } : {}}>
                      <div className={classes.sensitiveDataContainer}>
                        <div className={classes.sensitiveData}>
                          <PaymentElement
                            options={{
                              layout: 'tabs',
                              wallets: {
                                applePay: 'never',
                                googlePay: 'never',
                              },
                              defaultValues: {
                                billingDetails: {
                                  name: userDefaultName || '',
                                  address: { country: companyCountry || '' },
                                  email: userDefaultEmail || '',
                                },
                              },
                              fields: {
                                billingDetails: {
                                  name: 'auto',
                                  email: 'auto',
                                  phone: 'never',
                                  address: 'never',
                                },
                              },
                            }}
                          />
                          {error &&
                            STRIPE_SEPA_ERROR_CODES.includes(error.code!) && (
                              <Typography color="error" variant="caption">
                                {error.message}
                              </Typography>
                            )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        classes.saveAndDisplay,
                        customClasses?.saveAndDisplay,
                      )}
                    >
                      <div className={clsx(classes.row, customClasses?.row)}>
                        {!hideSaveForLater && (
                          <>
                            <Checkbox
                              checked={saveForLater || forceSave}
                              color="primary"
                              disabled={!!forceSave}
                              onChange={onSaveForLaterChange}
                            />
                            <Typography
                              variant={isCheckoutContext ? 'body1' : 'caption'}
                            >
                              {t('paymentPanel.actions.saveForLater')}
                            </Typography>
                            <div
                              className={clsx(
                                classes.securityInformationContainer,
                                customClasses?.securityInformationContainer,
                              )}
                            >
                              <PopOver
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'center',
                                }}
                                className={clsx(
                                  classes.securityInformationText,
                                  customClasses?.securityInformationText,
                                )}
                                title={t(
                                  'paymentPanel.actions.paymentSecurityInformation',
                                )}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'center',
                                }}
                              >
                                <Info
                                  className={clsx(
                                    classes.infoIcon,
                                    customClasses?.infoIcon,
                                  )}
                                />
                              </PopOver>
                            </div>
                          </>
                        )}
                      </div>

                      {!!paymentMethodList.length && (
                        <ButtonBase
                          className={clsx(
                            classes.displayButton,
                            customClasses?.displayButton,
                          )}
                          onClick={() => setIsAddingPaymentMethod(false)}
                        >
                          <Typography
                            align="right"
                            color="primary"
                            variant="body1"
                          >
                            {t(
                              'payment:forms.paymentMethod.actions.displayPaymentMethod',
                            )}
                          </Typography>
                        </ButtonBase>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {!isAddingPaymentMethod && !!paymentMethodList.length && (
              <div>
                <PaymentMethodList
                  detachPaymentMethod={detachPaymentMethod}
                  detachPaymentMethodLoading={detachPaymentMethodLoading}
                  onSelect={(id: string) => defineSelectedPaymentMethod(id)}
                  paymentMethodType="sepa_debit"
                  savedPaymentMethodList={paymentMethodList}
                  selectedSavedPaymentMethodId={paymentMethodSelected}
                  sepaDefaultEmail={userDefaultEmail}
                  sepaDefaultName={userDefaultName}
                  setHasDetached={setHasDetached}
                />

                {hasAddPaymentMethodPermission && (
                  <ButtonBase
                    className={clsx(
                      classes.addButton,
                      customClasses?.addButton,
                    )}
                    disabled={false}
                    onClick={() => setIsAddingPaymentMethod(true)}
                  >
                    <AddIcon
                      className={clsx(
                        classes.leftIcon,
                        customClasses?.leftIcon,
                      )}
                      color="primary"
                    />
                    <Typography align="left" color="primary" variant="body1">
                      {t(
                        'payment:forms.paymentMethod.actions.addPaymentMethod',
                      )}
                    </Typography>
                  </ButtonBase>
                )}
              </div>
            )}
            {allowConsumerToUseInternalAccount && !!creditAccountBalance && (
              <>
                <div className={classes.paddingTop1} />
                <UseInternalAccountForm
                  creditAccountBalance={creditAccountBalance}
                  loading={loading || isProcessing || applyBalanceLoading}
                  onBasketSubmit={useInternalAccount}
                  onInvoiceSubmit={applyBalanceToInvoice}
                />
              </>
            )}
            {children ?? null}
            {(!isCheckoutContext || forceButtonDisplay) &&
              !forceHideConfirmPaymentButton && (
                <>
                  {AcceptTermsAndConditionsComponent && (
                    <div
                      className={clsx(
                        classes.conditions,
                        customClasses?.conditions,
                      )}
                    >
                      {AcceptTermsAndConditionsComponent}
                    </div>
                  )}
                  <div
                    className={clsx(
                      classes.actionRow,
                      customClasses?.actionRow,
                    )}
                  >
                    {isProcessing ? (
                      <CircularProgress />
                    ) : (
                      <React.Fragment>
                        <Button
                          color="primary"
                          disabled={isSubmitButtonDisabled}
                          type="submit"
                          variant="contained"
                        >
                          {t('invoice:paymentPanel.actions.confirmPayment')}
                        </Button>
                        <Button
                          disabled={loading || isProcessing}
                          onClick={onCancel}
                        >
                          {t('paymentPanel.actions.cancel')}
                        </Button>
                      </React.Fragment>
                    )}
                  </div>
                </>
              )}
          </>
        )}
      </form>
    );
  },
);

type CheckoutContextThemeProps = {
  isCheckoutContext?: boolean;
};

const useStyles = makeStyles<Theme, CheckoutContextThemeProps>((theme) => ({
  sensitiveDataContainer: (isCheckoutContext) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isCheckoutContext ? 0 : theme.spacing(2)}px`,
  }),
  sensitiveData: (isCheckoutContext) => ({
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    width: '100%',
    ...(isCheckoutContext ? {} : { maxWidth: '80vw' }),
  }),
  conditions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'alignItems',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'alignItems',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  saveAndDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  row: {
    marginTop: theme.spacing(-1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  displayButton: {
    marginLeft: '50px',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  securityInformationContainer: {
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
  securityInformationText: {
    maxWidth: '250px',
    variant: 'tooltip',
    fontWeight: 500,
    fontSize: '10px',
    lineHeight: '14px',
  },
  infoIcon: { color: theme.palette.grey[600] },
  paddingTop1: {
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(PaymentStripeSEPA);
