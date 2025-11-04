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
import { useTranslation } from 'react-i18next';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_CB } from '@bsport/common/lib/master-data/payment-group.js';

import { IconButton, isWidthDown } from '@material-ui/core';
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

import Alert from '#Fabrique/Alert';

import type { BillingDetails } from '#src/libs/marketplace/types';
import type { OptionCallback } from '#src/state/types';

import PopOver from '#src/components/Popover';
import { useWidth } from '#src/hooks/useWidth';

import { STRIPE_CARD_ERROR_CODES } from '#src/libs/payment/constants';
import StripeErrorCode from '#src/libs/payment/components/payment-backend-stripe/StripeErrorCode.component';
import CardBillingDetailsForm from '#src/libs/payment/components/payment-backend-stripe/CardBillingDetailsForm';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';
import PaymentMethodList from '#src/libs/payment/components/payment-method-list/PaymentMethodList.component';

import { updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI } from '#src/libs/payment/api';

import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { usePaymentSubmit } from './hooks/usePaymentSubmit';

import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';
import { StripeError } from '@stripe/stripe-js';

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
  createPendingBookingsAndBlockBasket?: (data?: {
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
  handleAssignInstalmentPayment?: (
    instalmentPayment: number | null,
    options?: any,
  ) => void;
  hideSaveForLater?: boolean;
  instalmentPaymentSelectedId?: number | null;
  invalidatePendingBookingsAndUnblockBasket?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  memberId: number;
  onCancel?: () => void;
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

const PaymentStripeCardRevamped = forwardRef(
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
      creditAccountBalance,
      createPendingBookingsAndBlockBasket,
      customClasses,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      forceDisabled,
      forceHideConfirmPaymentButton,
      forceSave,
      handleAssignInstalmentPayment,
      hasAddPaymentMethodPermission = true,
      hideSaveForLater,
      instalmentPaymentSelectedId,
      invalidatePendingBookingsAndUnblockBasket,
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

    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<StripeError | undefined>(undefined);
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<
      string | undefined
    >(undefined);
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
    const [isPaymentSecurityInfoDisplayed, setIsPaymentSecurityInfoDisplayed] =
      useState(false);

    const {
      isPaymentMethodListLoading,
      paymentMethodListAll,
      paymentMethodListError,
      handleFetchMemberPaymentMethodList,
      hasFetchedPaymentMethodList,
      resetPaymentMethodList,
    } = useMemberPaymentMethodListProvider({
      memberId,
    });

    const paymentMethodList = useMemo(
      () =>
        paymentMethodListAll.filter(
          (paymentMethod) => paymentMethod.type === 'card',
        ),
      [paymentMethodListAll],
    );

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

    const [billingDetails, setBillingDetails] = useState<BillingDetails>(
      defaultBillingDetailsValues,
    );

    const setPaymentPageProcessing = useCallback(
      (process) => {
        if (setPaymentProcessing) {
          setPaymentProcessing(process);
        }
        setProcessing(process);
      },
      [setPaymentProcessing, setProcessing],
    );

    useEffect(() => {
      handleFetchMemberPaymentMethodList();
      return resetPaymentMethodList;
    }, [handleFetchMemberPaymentMethodList, resetPaymentMethodList]);

    const paymentMethodSelectedBillingDetails: BillingDetails = useMemo(() => {
      if (paymentMethodSelected) {
        return paymentMethodList.find(
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
        paymentMethodList?.length &&
        !paymentMethodSelected &&
        hasFetchedPaymentMethodList &&
        !isAddingPaymentMethod
      ) {
        setPaymentMethodSelected(paymentMethodList[0].id);
        setBillingDetails(paymentMethodSelectedBillingDetails);
      } else if (!paymentMethodList?.length && hasFetchedPaymentMethodList) {
        setBillingDetails(defaultBillingDetailsValues);
        setIsAddingPaymentMethod(true);
      }
    }, [
      defaultBillingDetailsValues,
      hasFetchedPaymentMethodList,
      isAddingPaymentMethod,
      paymentMethodList,
      paymentMethodSelected,
      paymentMethodSelectedBillingDetails,
    ]);

    const handleDetachPaymentMethod = useCallback(
      (paymentMethod) => {
        detachPaymentMethod(paymentMethod, {
          onSuccess: () => {
            setPaymentMethodSelected(undefined);
          },
        });
      },
      [detachPaymentMethod],
    );

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
      (!hasAddPaymentMethodPermission && !paymentMethodList?.length);

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

    const { handleSubmit } = usePaymentSubmit({
      basketId,
      basketTotalPriceCts,
      checkItemsBasket,
      clientSecret,
      createPendingBookingsAndBlockBasket,
      elements,
      forceSave,
      instalmentPaymentSelectedId,
      handleAssignInstalmentPayment,
      invalidatePendingBookingsAndUnblockBasket,
      onError,
      onSuccess,
      paymentGroupId,
      saveForLater,
      setPaymentPageProcessing,
      setError,
      stripe,
      paymentMethodData: {
        payment_group_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
        billingDetails,
        cardBillingDetailsMandatory,
        shouldConfirmCardPayment:
          !isAddingPaymentMethod && !!paymentMethodList?.length,
        areInitialBillingDetailsNecessary,
        paymentMethodSelected,
        memberId,
        companyId,
        updatePaymentMethodBillingDetailsAPI,
      },
      paymentMethodSelected,
    });

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

    if (paymentMethodListError) {
      return (
        <Alert
          className="bs-consumer-invoice-page__payment-portal__error"
          color="error"
          variant="weak"
        >
          {paymentMethodListError.message}
        </Alert>
      );
    }

    return (
      <form className={customClasses?.container} onSubmit={handleSubmit}>
        {isPaymentMethodListLoading || !hasFetchedPaymentMethodList ? (
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
                disabled={!stripe || !clientSecret || processing}
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
                          defaultValues: { billingDetails },
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
                      {!!paymentMethodList?.length && (
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
            {!isAddingPaymentMethod && !!paymentMethodList?.length && (
              <div>
                <PaymentMethodList
                  areInitialBillingDetailsNecessary={
                    areInitialBillingDetailsNecessary
                  }
                  billingDetails={billingDetails}
                  cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                  companyId={companyId}
                  detachPaymentMethod={handleDetachPaymentMethod}
                  detachPaymentMethodLoading={detachPaymentMethodLoading}
                  onSelect={onPaymentMethodSelect}
                  paymentMethodType="card"
                  savedPaymentMethodList={paymentMethodList}
                  selectedSavedPaymentMethodId={paymentMethodSelected}
                  sepaDefaultEmail={userDefaultEmail}
                  sepaDefaultName={userDefaultName}
                  setBillingDetails={setBillingDetails}
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
                  loading={loading || processing || applyBalanceLoading}
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
                      classes.flexRow,
                      classes.conditionRow,
                      customClasses?.conditionRow,
                    )}
                  >
                    {AcceptTermsAndConditionsComponent}
                  </div>
                )}
                <div
                  className={clsx(
                    classes.flexRow,
                    onCancel ? classes.actionRow : classes.actionRowCentered,
                    customClasses?.actionRow,
                  )}
                >
                  {processing ? (
                    <CircularProgress />
                  ) : (
                    <React.Fragment>
                      <div
                        className={clsx(
                          classes.submitButtonBase,
                          onCancel
                            ? classes.submitButton
                            : classes.submitButtonFullWidth,
                        )}
                      >
                        <Button
                          fullWidth
                          color="primary"
                          disabled={isSubmitButtonDisabled}
                          type="submit"
                          variant="contained"
                        >
                          {t('paymentPanel.actions.confirmPayment')}
                        </Button>
                      </div>
                      {onCancel ? (
                        <Button
                          disabled={loading || processing}
                          onClick={onCancel}
                        >
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
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  conditionRow: {
    justifyContent: 'space-between',
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    justifyContent: 'space-between',
  },
  actionRowCentered: {
    justifyContent: 'center',
  },
  submitButtonBase: {
    height: theme.spacing(5),
  },
  submitButton: {
    width: theme.spacing(25),
  },
  submitButtonFullWidth: {
    width: '100%',
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

export default React.memo(PaymentStripeCardRevamped);
