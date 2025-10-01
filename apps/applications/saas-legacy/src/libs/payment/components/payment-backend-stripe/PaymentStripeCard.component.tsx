import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import clsx from 'clsx';
import Immutable from 'seamless-immutable';
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
  IconButton,
  isWidthDown,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Info from '@material-ui/icons/Info';
import grey from '@material-ui/core/colors/grey';

import PopOver from '#src/components/Popover';
import { useWidth } from '#src/hooks/useWidth';

import { STRIPE_CARD_ERROR_CODES } from '#src/libs/payment/constants';
import CardBillingDetailsForm from '#src/libs/payment/components/payment-backend-stripe/CardBillingDetailsForm';
import StripeErrorCode from '#src/libs/payment/components/payment-backend-stripe/StripeErrorCode.component';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';
import PaymentMethodList from '#src/libs/payment/components/payment-method-list/PaymentMethodList.component';

import {
  blockPendingBasket as blockPendingBasketAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import { confirmStripePayment as confirmStripePaymentAction } from '#src/libs/payment/payment-module-revamped/actions';

import type { BillingDetails } from '#src/libs/marketplace/types';
import type { PaymentMethod } from '#src/libs/payment/types';

import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';

import type { OptionCallback } from '#src/state/types';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group';

type Props = {
  AcceptTermsAndConditionsComponent?: React.Component;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId?: string;
  basketTotalPriceCts?: number;
  cardBillingDetailsMandatory: boolean;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  children?: React.ReactNode;
  clientSecret: string;
  companyCountry?: string;
  companyId?: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  creditAccountBalance?: number | null;
  customClasses?: { [className: string]: string };
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  detachPaymentMethodLoading: boolean;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  hideSaveForLater?: boolean;
  invalidatePendingBookingsIfNecessary?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  memberId: number;
  onCancel: () => void;
  onError?: () => void;
  onSaveForLaterChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSuccess: (callback: () => void) => void;
  paymentGroupId: number;
  saveForLater: boolean;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (processing: boolean) => void;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  userDefaultEmail?: string;
  userDefaultName?: string;
};

const PaymentStripeCard = forwardRef(
  (
    {
      AcceptTermsAndConditionsComponent,
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      applyBalanceToInvoice,
      basketId,
      basketTotalPriceCts,
      cardBillingDetailsMandatory,
      checkItemsBasket,
      children,
      clientSecret,
      companyCountry,
      companyId,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      customClasses,
      detachPaymentMethod,
      detachPaymentMethodLoading,
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
    }: Props,
    ref,
  ) => {
    const isCheckoutContext = useContext(CheckoutContext);
    const classes = useStyles();
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
    const [isPaymentSecurityInfoDisplayed, setIsPaymentSecurityInfoDisplayed] =
      useState(false);

    const defaultBillingDetailsValues = useMemo(() => {
      return Immutable({
        name: userDefaultName || '',
        address: {
          city: '',
          country: companyCountry || '',
          line1: '',
          line2: '',
          postal_code: '',
          state: '',
        },
        email: userDefaultEmail || '',
      });
    }, [userDefaultName, userDefaultEmail, companyCountry]);

    const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);
    const [isFetchFinished, setIsFetchFinished] = useState(false);
    const [billingDetails, setBillingDetails] = useState<BillingDetails>(
      defaultBillingDetailsValues,
    );

    const setPaymentPageProcessing = useCallback(
      (process) => {
        if (setPaymentProcessing) {
          setPaymentProcessing(process);
        }
        setIsProcessing(process);
      },
      [setIsProcessing, setPaymentProcessing],
    );

    useEffect(() => {
      fetchPaymentMethodListAPI({ member: memberId })
        .then((r) => {
          const filteredPaymentMethods = r.data.filter(
            (pm) => pm.type === 'card',
          );
          setPaymentMethodList(filteredPaymentMethods);
        })
        .then(() => {
          setIsFetchSuccessful(true);
          setIsFetchFinished(true);
        })
        .catch((err) => {
          console.error(err);
          setIsFetchSuccessful(false);
          setIsFetchFinished(true);
        });
    }, [memberId, clientSecret, hasDetached]);

    const paymentMethodSelectedBillingDetails: BillingDetails = useMemo(() => {
      if (paymentMethodSelected) {
        return paymentMethodList?.find(
          (paymentMethod) => paymentMethod.id === paymentMethodSelected,
        )?.billing_details as BillingDetails;
      }
      return defaultBillingDetailsValues;
    }, [paymentMethodSelected, paymentMethodList, defaultBillingDetailsValues]);

    // Whenever the paymentMethod changes, we change the state of the billing details
    useEffect(() => {
      if (paymentMethodSelected) {
        setBillingDetails(paymentMethodSelectedBillingDetails);
      } else {
        setBillingDetails(defaultBillingDetailsValues);
      }
    }, [
      paymentMethodSelected,
      defaultBillingDetailsValues,
      paymentMethodSelectedBillingDetails,
    ]);

    useEffect(() => {
      if (
        paymentMethodList.length &&
        !paymentMethodSelected &&
        isFetchSuccessful &&
        !isAddingPaymentMethod
      ) {
        setPaymentMethodSelected(paymentMethodList[0].id);
        setBillingDetails(paymentMethodSelectedBillingDetails);
      } else if (!paymentMethodList.length && isFetchSuccessful) {
        setBillingDetails(defaultBillingDetailsValues);
        setIsAddingPaymentMethod(true);
      }
    }, [
      defaultBillingDetailsValues,
      isAddingPaymentMethod,
      isFetchSuccessful,
      paymentMethodList,
      paymentMethodSelected,
      paymentMethodSelectedBillingDetails,
    ]);

    useEffect(() => {
      if (hasDetached && paymentMethodList.length) {
        setPaymentMethodSelected(paymentMethodList[0].id);
      }
    }, [hasDetached, setPaymentMethodSelected, paymentMethodList]);

    useEffect(() => {
      if (isAddingPaymentMethod) {
        setPaymentMethodSelected(undefined);
      }
    }, [isAddingPaymentMethod]);

    const areSpecificBillingDetailsProvided = useCallback(
      (specificBillingDetails: BillingDetails) => {
        return (
          !!specificBillingDetails?.name &&
          !!specificBillingDetails?.address.line1 &&
          !!specificBillingDetails?.address.postal_code &&
          !!specificBillingDetails?.address.city &&
          !!specificBillingDetails?.address.country
        );
      },
      [],
    );
    // Temporary test to limit the number of 3DS required for card payments for one company (id 1416)
    const areInitialBillingDetailsNecessary =
      cardBillingDetailsMandatory && paymentMethodSelected
        ? areSpecificBillingDetailsProvided(paymentMethodSelectedBillingDetails)
        : true;

    const areBillingDetailsProvided = cardBillingDetailsMandatory
      ? areSpecificBillingDetailsProvided(billingDetails)
      : true;

    const isSubmitButtonDisabled =
      loading ||
      forceDisabled ||
      !stripe ||
      !elements ||
      !clientSecret ||
      !isEstablishmentBillingGroupSelected ||
      !termsAndConditionsAccepted ||
      !areBillingDetailsProvided ||
      (!hasAddPaymentMethodPermission && !paymentMethodList.length);

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    useEffect(() => {
      if (!isCheckoutContext && !forceHideConfirmPaymentButton)
        setIsOnlinePaymentDisabled?.(isSubmitButtonDisabled);
    }, [
      forceHideConfirmPaymentButton,
      isCheckoutContext,
      isSubmitButtonDisabled,
      setIsOnlinePaymentDisabled,
    ]);

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
        try {
          createPendingBookingsIfNecessary?.({
            payment_group_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
          });

          if (!areInitialBillingDetailsNecessary && paymentMethodSelected) {
            /**
             * This API call is intentionally not moved to a Redux action because:
             * 1. It might be executed within the context of a checkout process, specifically inside the marketplace
             * or in an iframe widget. Thus, we don't need to make authenticated call from the widget.
             * 2. The data returned by this API call does not need to be stored or managed within the Redux store.
             * Therefore, keeping the API call local to this context is more appropriate and efficient.
             */
            await updatePaymentMethodBillingDetailsAPI({
              member: memberId,
              payment_method_id: paymentMethodSelected,
              billing_details: billingDetails,
              company: companyId,
            });
          }

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
                shouldConfirmCardPayment:
                  !isAddingPaymentMethod && !!paymentMethodList?.length,
                paymentMethodSelected,
                billingDetails,
                cardBillingDetailsMandatory,
              },
              {
                onPaymentError: (err) => {
                  setError(err);
                  setPaymentPageProcessing(false);
                  invalidatePendingBookingsIfNecessary?.();
                  onError?.();
                },
                onPaymentSuccess: async (paymentIntent) => {
                  if (basketId) {
                    try {
                      await blockPendingBasketAPI(basketId);
                    } catch (err) {
                      console.error(err);
                    }
                  }

                  if (paymentIntent.status === 'succeeded' && onSuccess) {
                    onSuccess(() => setPaymentPageProcessing(false));
                  }
                },
              },
            ),
          );
        } catch (err) {
          console.error(err);
        }
      },
      [
        areInitialBillingDetailsNecessary,
        basketId,
        basketTotalPriceCts,
        billingDetails,
        cardBillingDetailsMandatory,
        checkItemsBasket,
        clientSecret,
        companyId,
        createPendingBookingsIfNecessary,
        dispatch,
        elements,
        forceSave,
        invalidatePendingBookingsIfNecessary,
        isAddingPaymentMethod,
        memberId,
        onError,
        onSuccess,
        paymentGroupId,
        paymentMethodList?.length,
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

    const defineSelectedPaymentMethod = useCallback(
      (id: string) => {
        if (id !== paymentMethodSelected) {
          setPaymentMethodSelected(id);
        }
      },
      [paymentMethodSelected],
    );

    const startAddingPaymentMethod = useCallback(
      () => setIsAddingPaymentMethod(true),
      [],
    );

    const stopAddingPaymentMethod = useCallback(
      () => setIsAddingPaymentMethod(false),
      [],
    );

    const onPaymentMethodSelect = useCallback(
      (id: string) => defineSelectedPaymentMethod(id),
      [defineSelectedPaymentMethod],
    );

    const OnInfoRequest = useCallback(
      () => setIsPaymentSecurityInfoDisplayed(!isPaymentSecurityInfoDisplayed),
      [isPaymentSecurityInfoDisplayed],
    );

    const width = useWidth();
    const isMobile = isWidthDown('sm', width);

    return (
      <form className={clsx(customClasses?.container)} onSubmit={handleSubmit}>
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
            {isAddingPaymentMethod && cardBillingDetailsMandatory && (
              <CardBillingDetailsForm
                billingDetails={billingDetails}
                disabled={!stripe || !clientSecret || isProcessing}
                setBillingDetails={setBillingDetails}
              />
            )}
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
                    <div className={classes.cardSectionContainer}>
                      <PaymentElement
                        options={{
                          layout: 'tabs',
                          wallets: {
                            applePay: 'never',
                            googlePay: 'never',
                          },
                          defaultValues: {
                            billingDetails: {
                              name: userDefaultName,
                              email: userDefaultEmail,
                            },
                          },
                        }}
                      />
                      {error &&
                        error.code &&
                        !STRIPE_CARD_ERROR_CODES.includes(error.code) &&
                        !STRIPE_CARD_ERROR_CODES.includes(
                          error.decline_code!,
                        ) && (
                          <Typography color="error" variant="caption">
                            {error.message}
                          </Typography>
                        )}
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
                              disabled={forceSave}
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
                              {isMobile ? (
                                <IconButton onClick={OnInfoRequest}>
                                  <Info />
                                </IconButton>
                              ) : (
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
                              )}
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
                          onClick={stopAddingPaymentMethod}
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
                      {isMobile && isPaymentSecurityInfoDisplayed && (
                        <div className={classes.greyContainer}>
                          {t('paymentPanel.actions.paymentSecurityInformation')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            {!isAddingPaymentMethod &&
              !!error &&
              error.decline_code &&
              error.code && (
                <div style={{ margin: 8 }}>
                  <StripeErrorCode
                    declineCode={error.decline_code}
                    errorCode={error.code}
                  />
                </div>
              )}
            {!isAddingPaymentMethod && !!paymentMethodList.length && (
              <div>
                <PaymentMethodList
                  areInitialBillingDetailsNecessary={
                    areInitialBillingDetailsNecessary
                  }
                  billingDetails={billingDetails}
                  cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                  companyId={companyId}
                  detachPaymentMethod={detachPaymentMethod}
                  detachPaymentMethodLoading={detachPaymentMethodLoading}
                  onSelect={onPaymentMethodSelect}
                  paymentMethodType="card"
                  savedPaymentMethodList={paymentMethodList}
                  selectedSavedPaymentMethodId={paymentMethodSelected}
                  sepaDefaultEmail={userDefaultEmail}
                  sepaDefaultName={userDefaultName}
                  setBillingDetails={setBillingDetails}
                  setHasDetached={setHasDetached}
                />

                {hasAddPaymentMethodPermission && (
                  <ButtonBase
                    className={clsx(
                      classes.addButton,
                      customClasses?.addButton,
                    )}
                    disabled={false}
                    onClick={startAddingPaymentMethod}
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
            {!isCheckoutContext && !forceHideConfirmPaymentButton && (
              <>
                {AcceptTermsAndConditionsComponent && (
                  <div
                    className={clsx(
                      classes.conditionRow,
                      customClasses?.conditionRow,
                    )}
                  >
                    {AcceptTermsAndConditionsComponent}
                  </div>
                )}
                <div
                  className={clsx(classes.actionRow, customClasses?.actionRow)}
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
                        {t('paymentPanel.actions.confirmPayment')}
                      </Button>
                      {onCancel ? (
                        <Button disabled={isProcessing} onClick={onCancel}>
                          {t('paymentPanel.actions.cancel')}
                        </Button>
                      ) : (
                        <div />
                      )}
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

const useStyles = makeStyles((theme) => ({
  cardSectionContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#F2F2F2',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: 8,
  },
  row: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 1',
    gridRowStart: 1,
    marginTop: theme.spacing(-1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      gridColumnEnd: 'span 2',
    },
  },
  conditionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  saveAndDisplay: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridTemplateRows: 'auto',
  },
  displayButton: {
    padding: theme.spacing(1),
    gridColumnStart: 2,
    gridColumnEnd: 'span 1',
    gridRowStart: 1,
    justifyContent: 'right',
    [theme.breakpoints.down('xs')]: {
      gridColumnStart: 1,
      gridColumnEnd: 'span 2',
      gridRowStart: 3,
      justifyContent: 'left',
    },
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
  greyContainer: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 2',
    gridRowStart: 2,
    backgroundColor: grey[100],
    borderRadius: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  paddingTop1: {
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(PaymentStripeCard);
