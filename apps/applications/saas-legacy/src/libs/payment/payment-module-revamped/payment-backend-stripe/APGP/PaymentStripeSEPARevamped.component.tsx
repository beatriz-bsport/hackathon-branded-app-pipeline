import React, {
  ChangeEvent,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Info from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import Alert from '#Fabrique/Alert';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA } from '@bsport/common/lib/master-data/payment-group.js';

import { STRIPE_SEPA_ERROR_CODES } from '#src/libs/payment/constants';

import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';
import PaymentMethodList from '#src/libs/payment/components/payment-method-list/PaymentMethodList.component';
import PopOver from '#src/components/Popover';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';
import { usePaymentSubmit } from './hooks/usePaymentSubmit';

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
  createPendingBookingsAndBlockBasket?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  customClasses?: { [className: string]: string };
  detachPaymentMethod: (paymentMetodId: string) => void;
  detachPaymentMethodLoading: boolean;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  handleAssignInstalmentPayment?: (
    instalmentPayment: number | null,
    options?: any,
  ) => void;
  hasAddPaymentMethodPermission?: boolean;
  hideSaveForLater?: boolean;
  instalmentPaymentSelectedId?: number;
  invalidatePendingBookingsAndUnblockBasket?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  memberId?: number;
  onCancel?: () => void;
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

export const PaymentStripeSEPARevamped = forwardRef(
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
      createPendingBookingsAndBlockBasket,
      creditAccountBalance,
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
    }: PaymentStripeSEPAProps,
    ref,
  ) => {
    const isCheckoutContext = useContext(CheckoutContext);
    const classes = useStyles({ isCheckoutContext });
    const { t } = useTranslation(['invoice', 'payment']);

    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<StripeError | undefined>(undefined);
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<
      string | undefined
    >(undefined);
    const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(true);

    // Payment processing logic moved to usePaymentSubmit hook

    const {
      isPaymentMethodListLoading,
      paymentMethodListAll,
      paymentMethodListError,
      handleFetchMemberPaymentMethodList,
      resetPaymentMethodList,
    } = useMemberPaymentMethodListProvider({
      memberId,
    });

    const paymentMethodList = useMemo(
      () =>
        paymentMethodListAll.filter(
          (paymentMethod) => paymentMethod.type === 'sepa_debit',
        ),
      [paymentMethodListAll],
    );

    useEffect(() => {
      handleFetchMemberPaymentMethodList();
      return resetPaymentMethodList;
    }, [handleFetchMemberPaymentMethodList, resetPaymentMethodList]);

    useEffect(() => {
      setIsAddingPaymentMethod(!paymentMethodList.length);
      if (paymentMethodList.length) {
        setPaymentMethodSelected(paymentMethodList[0].id);
      }
    }, [paymentMethodList]);

    useEffect(() => {
      if (isAddingPaymentMethod) {
        setPaymentMethodSelected(undefined);
      }
    }, [isAddingPaymentMethod]);

    const isSubmitButtonDisabled =
      loading ||
      forceDisabled ||
      !stripe ||
      !termsAndConditionsAccepted ||
      !isEstablishmentBillingGroupSelected ||
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
      setPaymentPageProcessing: (process) => {
        setPaymentProcessing(process);
        setProcessing(process);
      },
      setError,
      stripe,
      paymentMethodData: {
        payment_group_method_identifier: PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        shouldConfirmSepaPayment:
          !isAddingPaymentMethod && !!paymentMethodList.length,
        paymentMethodSelected,
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

    const defineSelectedPaymentMethod = (id: string) => {
      if (id !== paymentMethodSelected) {
        setPaymentMethodSelected(id);
      }
    };

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
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {isPaymentMethodListLoading ? (
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
                    <div style={processing ? { display: 'none' } : {}}>
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
                  loading={loading || applyBalanceLoading}
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
                      classes.conditions,
                      customClasses?.conditions,
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
                          {t('invoice:paymentPanel.actions.confirmPayment')}
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
  nameAndEmailContainer: (isCheckoutContext) => ({
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isCheckoutContext ? 0 : theme.spacing(2)}px`,
    gap: theme.spacing(2),
  }),
  mandate: (isCheckoutContext) => ({
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isCheckoutContext ? 0 : theme.spacing(2)}px`,
    maxWidth: 700,
  }),
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  conditions: {
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

export default React.memo(PaymentStripeSEPARevamped);
