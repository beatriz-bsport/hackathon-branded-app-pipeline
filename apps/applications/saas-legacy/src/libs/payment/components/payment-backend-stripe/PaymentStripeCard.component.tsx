import React, { useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group.js';

import { isWidthDown, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import grey from '@material-ui/core/colors/grey';
import Info from '@material-ui/icons/Info';
import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import type { OptionCallback } from '#src/state/types';
import type { BillingDetails } from '#src/libs/marketplace/types';
import type { PaymentMethod } from '#src/libs/payment/types';

import { CheckoutContext } from '#src/pages/checkout/basket/CheckoutContext';
import { useWidth } from '#src/hooks/useWidth';
import CardBillingDetailsForm from '#src/libs/payment/components/payment-backend-stripe/CardBillingDetailsForm';
import PaymentMethodList from '#src/libs/payment/components/payment-method-list/PaymentMethodList.component';
import PopOver from '#src/components/Popover';
import StripeErrorCode from '#src/libs/payment/components/payment-backend-stripe/StripeErrorCode.component';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';
import {
  blockPendingBasket as blockPendingBasketAPI,
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import Config from '../../../../config';

type Props = {
  AcceptTermsAndConditionsComponent?: React.Component;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  cardBillingDetailsMandatory: boolean;
  children?: React.ReactNode;
  clientSecret: string;
  companyCountry?: string;
  companyId?: number;
  creditAccountBalance?: number | null;
  customClasses?: { [className: string]: string };
  detachPaymentMethodLoading: boolean;
  forceButtonDisplay?: boolean;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  hideSaveForLater?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  memberId: number;
  termsAndConditionsAccepted: boolean;
  userDefaultEmail?: string;
  userDefaultName?: string;
  applyBalanceToInvoice?: () => void;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  onCancel: () => void;
  onError?: () => void;
  onSuccess: (callback: () => void) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (processing: boolean) => void;
  useInternalAccount?: (amount: number) => void;
};

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardSection = (props: { error: any }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.cardSectionContainer}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {!!props.error && (
        <div style={{ margin: 8 }}>
          <StripeErrorCode
            declineCode={props.error.decline_code}
            errorCode={props.error.error_code}
          />
        </div>
      )}
    </React.Fragment>
  );
};

const PaymentStripeCard = forwardRef(
  (
    {
      AcceptTermsAndConditionsComponent,
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      basketId,
      basketTotalPriceCts,
      cardBillingDetailsMandatory,
      children,
      clientSecret,
      companyCountry,
      companyId,
      creditAccountBalance,
      customClasses,
      detachPaymentMethodLoading,
      forceButtonDisplay,
      forceDisabled,
      forceHideConfirmPaymentButton,
      forceSave,
      hasAddPaymentMethodPermission = true,
      hideSaveForLater,
      isEstablishmentBillingGroupSelected,
      loading,
      memberId,
      termsAndConditionsAccepted,
      userDefaultEmail,
      userDefaultName,
      applyBalanceToInvoice,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      detachPaymentMethod,
      onCancel,
      onError,
      onSuccess,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      useInternalAccount,
    }: Props,
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation(['invoice', 'payment']);

    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [saveForLater, setSaveForLater] = React.useState(false);
    const [paymentMethodList, setPaymentMethodList] = React.useState<
      PaymentMethod[]
    >([]);
    const [paymentMethodSelected, setPaymentMethodSelected] =
      React.useState<string>(null);
    const [hasDetached, setHasDetached] = React.useState(null);
    const [addPaymentMethod, setAddPaymentMethod] = React.useState(false);
    const [isPaymentSecurityInfoDisplayed, setIsPaymentSecurityInfoDisplayed] =
      React.useState(false);

    const defaultBillingDetailsValues = React.useMemo(() => {
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

    const [isFetchSuccessful, setIsFetchSuccessful] = React.useState(false);
    const [isFetchFinished, setIsFetchFinished] = React.useState(false);
    const [billingDetails, setBillingDetails] = React.useState<BillingDetails>(
      defaultBillingDetailsValues,
    );

    const isNewCheckoutFlow = React.useContext(CheckoutContext);

    const setPaymentPageProcessing = React.useCallback(
      (process) => {
        if (setPaymentProcessing) {
          setPaymentProcessing(process);
        }
        setProcessing(process);
      },
      [setPaymentProcessing, setProcessing],
    );

    React.useEffect(() => {
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

    const paymentMethodSelectedBillingDetails: BillingDetails =
      React.useMemo(() => {
        if (paymentMethodSelected) {
          return paymentMethodList?.find(
            (paymentMethod) => paymentMethod.id === paymentMethodSelected,
          )?.billing_details;
        }
        return defaultBillingDetailsValues;
      }, [
        paymentMethodSelected,
        paymentMethodList,
        defaultBillingDetailsValues,
      ]);

    // This is a Hail Mary attempt of saving Jab Box (80k of monthly transactions)
    // from churning back to Zingfit because they are upset by the many 3D Secure they
    // are getting. Note that a client saving a payment method doesn't mean that they
    // want this payment method to be used for off-session payments so we have to think
    // about this any way.
    // Issue: https://gitlab.com/bsport/bsport-saas/-/issues/2101

    const company_setup_intent_always_on_session = [
      'local',
      'dev',
      'staging',
    ].includes(Config.REACT_APP_SENTRY_ENVIRONMENT)
      ? 72
      : 1416;

    const setup_future_usage = React.useMemo(() => {
      if (
        (saveForLater || forceSave) &&
        companyId !== company_setup_intent_always_on_session
      ) {
        return 'off_session';
      }
      if (
        (saveForLater || forceSave) &&
        companyId === company_setup_intent_always_on_session
      ) {
        return 'on_session';
      }
      return null;
    }, [
      saveForLater,
      forceSave,
      companyId,
      company_setup_intent_always_on_session,
    ]);

    // Whenever the paymentMethod changes, we change the state of the billing details
    React.useEffect(() => {
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

    React.useEffect(() => {
      if (
        paymentMethodList.length &&
        !paymentMethodSelected &&
        isFetchSuccessful &&
        !addPaymentMethod
      ) {
        setPaymentMethodSelected(paymentMethodList[0].id);
        setBillingDetails(paymentMethodSelectedBillingDetails);
      } else if (!paymentMethodList.length && isFetchSuccessful) {
        setBillingDetails(defaultBillingDetailsValues);
        setAddPaymentMethod(true);
      }
    }, [
      paymentMethodList,
      isFetchSuccessful,
      paymentMethodSelectedBillingDetails,
      paymentMethodSelected,
      addPaymentMethod,
      defaultBillingDetailsValues,
    ]);

    React.useEffect(() => {
      if (hasDetached && paymentMethodList.length) {
        setPaymentMethodSelected(paymentMethodList[0].id);
      }
    }, [hasDetached, setPaymentMethodSelected, paymentMethodList]);

    React.useEffect(() => {
      if (addPaymentMethod) {
        setPaymentMethodSelected(null);
      }
    }, [addPaymentMethod]);

    const areSpecificBillingDetailsProvided = React.useCallback(
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
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        setPaymentPageProcessing(true);

        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }

        if (basketId) {
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
          if (!areInitialBillingDetailsNecessary && paymentMethodSelected) {
            await updatePaymentMethodBillingDetailsAPI({
              member: memberId,
              payment_method_id: paymentMethodSelected,
              billing_details: billingDetails,
              company: companyId,
            });
          }

          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethodSelected || {
              card: elements.getElement(CardElement),
              ...(cardBillingDetailsMandatory
                ? { billing_details: billingDetails }
                : {}),
            },
            ...(setup_future_usage ? { setup_future_usage } : {}),
          });

          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            setError(result.error);
            setPaymentPageProcessing(false);
            if (onError) onError();
          } else {
            // The payment has been processed!
            if (basketId) {
              try {
                await blockPendingBasketAPI(basketId);
              } catch (err) {
                console.error(err);
              }
            }
            setError(null);

            if (createPendingBookingsIfNecessary)
              createPendingBookingsIfNecessary({
                payment_group_method_identifier:
                  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
              });

            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              // There's a risk of the customer closing the window before callback
              // execution. Set up a webhook or plugin to listen for the
              // payment_intent.succeeded event that handles any business critical
              // post-payment actions.
              if (onSuccess) {
                onSuccess(() => setPaymentPageProcessing(false));
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      },
      [
        basketId,
        basketTotalPriceCts,
        billingDetails,
        checkItemsBasket,
        clientSecret,
        companyId,
        createPendingBookingsIfNecessary,
        elements,
        onError,
        onSuccess,
        paymentMethodSelected,
        setPaymentPageProcessing,
        stripe,
        t,
        areInitialBillingDetailsNecessary,
        memberId,
        cardBillingDetailsMandatory,
        setup_future_usage,
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

    const defineSelectedPaymentMethod = React.useCallback(
      (id: string) => {
        if (id !== paymentMethodSelected) {
          setPaymentMethodSelected(id);
        }
      },
      [paymentMethodSelected],
    );

    const onSaveForLaterChange = React.useCallback(
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSaveForLater(ev?.target?.checked ?? false);
      },
      [],
    );

    const startAddingPaymentMethod = React.useCallback(
      () => setAddPaymentMethod(true),
      [],
    );

    const stopAddingPaymentMethod = React.useCallback(
      () => setAddPaymentMethod(false),
      [],
    );

    const onPaymentMethodSelect = React.useCallback(
      (id: string) => defineSelectedPaymentMethod(id),
      [defineSelectedPaymentMethod],
    );

    const OnInfoRequest = React.useCallback(
      () => setIsPaymentSecurityInfoDisplayed(!isPaymentSecurityInfoDisplayed),
      [isPaymentSecurityInfoDisplayed],
    );

    const width = useWidth();
    const isMobile = isWidthDown('sm', width);

    return (
      <form
        className={classNames(classes.container, customClasses?.container)}
        onSubmit={handleSubmit}
      >
        {!isFetchFinished ? (
          <LinearProgress />
        ) : (
          <>
            <Typography variant="h6">
              {t(
                `payment:forms.savePaymentMethod.${
                  addPaymentMethod ? 'add' : 'select'
                }`,
              )}
            </Typography>
            {addPaymentMethod && cardBillingDetailsMandatory && (
              <CardBillingDetailsForm
                billingDetails={billingDetails}
                disabled={!stripe || !clientSecret || processing}
                setBillingDetails={setBillingDetails}
              />
            )}
            {addPaymentMethod && (
              <>
                {!hasAddPaymentMethodPermission ? (
                  <Typography>
                    {t(
                      'payment:forms.paymentMethod.actions.addPaymentMethodDenied',
                    )}
                  </Typography>
                ) : (
                  <div>
                    <CardSection error={error} />
                    <div
                      className={classNames(
                        classes.saveAndDisplay,
                        customClasses?.saveAndDisplay,
                      )}
                    >
                      <div
                        className={classNames(classes.row, customClasses?.row)}
                      >
                        {!hideSaveForLater && (
                          <>
                            <Checkbox
                              checked={saveForLater || forceSave}
                              color="primary"
                              disabled={forceSave}
                              onChange={onSaveForLaterChange}
                            />
                            <Typography
                              variant={isNewCheckoutFlow ? 'body1' : 'caption'}
                            >
                              {t('paymentPanel.actions.saveForLater')}
                            </Typography>
                            <div
                              className={classNames(
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
                                  className={classNames(
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
                                    className={classNames(
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
                          className={classNames(
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
            {!addPaymentMethod && !!error && (
              <div style={{ margin: 8 }}>
                <StripeErrorCode
                  declineCode={error.decline_code}
                  errorCode={error.error_code}
                />
              </div>
            )}
            {!addPaymentMethod && !!paymentMethodList.length && (
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
                    className={classNames(
                      classes.addButton,
                      customClasses?.addButton,
                    )}
                    disabled={false}
                    onClick={startAddingPaymentMethod}
                  >
                    <AddIcon
                      className={classNames(
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
                  loading={loading || processing || applyBalanceLoading}
                  onBasketSubmit={useInternalAccount}
                  onInvoiceSubmit={applyBalanceToInvoice}
                />
              </>
            )}
            {children ?? null}
            {(!isNewCheckoutFlow || forceButtonDisplay) &&
              !forceHideConfirmPaymentButton && (
                <>
                  {AcceptTermsAndConditionsComponent && (
                    <div
                      className={classNames(
                        classes.conditionRow,
                        customClasses?.conditionRow,
                      )}
                    >
                      {AcceptTermsAndConditionsComponent}
                    </div>
                  )}
                  <div
                    className={classNames(
                      classes.actionRow,
                      customClasses?.actionRow,
                    )}
                  >
                    {processing ? (
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
                          <Button disabled={processing} onClick={onCancel}>
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
  container: {},
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
