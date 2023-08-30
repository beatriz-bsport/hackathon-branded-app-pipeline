import React, { useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import { Info } from '@material-ui/icons';
/**
 * Use the CSS tab above to style your Element's container.
 */
import { PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA } from '@bsport/common/lib/master-data/payment-group';
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import Checkbox from '@material-ui/core/Checkbox';
import { StripeError } from '@stripe/stripe-js';

import PaymentMethodList from '../payment-method-list/PaymentMethodList.component';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
  blockPendingBasket as blockPendingBasketAPI,
} from '../../api';
import UseInternalAccountForm from '#libs/payment/components/UseInternalAccountForm.component';
import { CheckoutContext } from '../../../../pages/checkout/basket/CheckoutContext';
import PopOver from '#components/Popover';
import StripeErrorCode from './StripeErrorCode.component';

// Custom styling can be passed as options when creating an Element.
const IBAN_STYLE = {
  base: {
    color: '#32325d',
    fontSize: '16px',
    ':-webkit-autofill': {
      color: '#32325d',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
    ':-webkit-autofill': {
      color: '#fa755a',
    },
  },
};

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  // Elements can use a placeholder as an example IBAN that reflects
  // the IBAN format of your customer's country. If you know your
  // customer's country, we recommend that you pass it to the Element as the
  // placeholderCountry.
  placeholderCountry: 'FR',
  style: IBAN_STYLE,
};

interface BillingDetails {
  name: string;
  email: string;
  address: { line1: string; country: string };
}

type PropsIban = {
  withAddress: boolean | null;
  disabled: boolean;
  processing: boolean;
  isActive: boolean;
  error?: StripeError;
  billingDetails: BillingDetails;
  setBillingDetails: (billingdetails: BillingDetails) => void;
};

const IbanForm: React.FC<PropsIban> = ({
  withAddress,
  disabled,
  processing,
  isActive,
  error,
  billingDetails,
  setBillingDetails,
}) => {
  const { t } = useTranslation(['invoice']);
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles({ isNewCheckoutFlow });

  return (
    <div>
      <div className={classes.nameAndEmailContainer}>
        <TextField
          fullWidth
          disabled={disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
          placeholder={t('mandate.name')}
          required={isActive}
          value={billingDetails.name}
          variant="outlined"
        />
        <TextField
          fullWidth
          disabled={disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              email: value,
            });
          }}
          placeholder={t('mandate.email')}
          required={isActive}
          type="email"
          value={billingDetails.email}
          variant="outlined"
        />
        {withAddress && (
          <TextField
            fullWidth
            required
            onChange={(ev) => {
              const { value } = ev.target;
              setBillingDetails({
                ...billingDetails,
                address: {
                  ...billingDetails.address,
                  line1: value,
                },
              });
            }}
            placeholder={t('mandate.address_line_1')}
            value={billingDetails.address.line1}
            variant="outlined"
          />
        )}
      </div>
      <div style={processing ? { display: 'none' } : {}}>
        <div className={classes.sensitiveDataContainer}>
          <div className={classes.sensitiveData}>
            <IbanElement options={IBAN_ELEMENT_OPTIONS} />
            {!!error && (
              <StripeErrorCode
                declineCode={error.decline_code}
                errorCode={error.code}
              />
            )}
          </div>
        </div>
      </div>
      <div className={classes.mandate}>
        <Typography color="textSecondary">
          {t('mandate.contentIban')}
        </Typography>
      </div>
    </div>
  );
};

type PaymentStripeSEPAProps = {
  onError?: () => void;
  onSuccess: (callback: () => void) => void;
  memberId?: number;
  clientSecret: string;
  onCancel: () => void;
  termsAndConditionsAccepted: boolean;
  AcceptTermsAndConditionsComponent?: React.Component;
  forceDisabled?: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (paymentMetodId: string) => void;
  userDefaultName?: string;
  userDefaultEmail?: string;
  loading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  allowConsumerToUseInternalAccount?: boolean;
  useInternalAccount?: (amount: number) => void;
  applyBalanceToInvoice?: () => void;
  creditAccountBalance?: number | null;
  applyBalanceLoading?: boolean;
  forceSave?: boolean;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  setPaymentProcessing: (processing: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  customClasses?: { [className: string]: string };
  children?: React.ReactNode;
  forceButtonDisplay?: boolean;
  hideSaveForLater?: boolean;
};

export const PaymentStripeSEPA = forwardRef(
  (
    {
      onError,
      onSuccess,
      memberId,
      clientSecret,
      onCancel,
      termsAndConditionsAccepted,
      AcceptTermsAndConditionsComponent,
      forceDisabled,
      detachPaymentMethodLoading,
      detachPaymentMethod,
      userDefaultName,
      userDefaultEmail,
      loading,
      basketId,
      basketTotalPriceCts,
      allowConsumerToUseInternalAccount,
      useInternalAccount,
      applyBalanceToInvoice,
      creditAccountBalance,
      applyBalanceLoading,
      forceSave,
      checkItemsBasket,
      setPaymentProcessing,
      createPendingBookingsIfNecessary,
      setIsOnlinePaymentDisabled,
      customClasses,
      children,
      forceButtonDisplay,
      hideSaveForLater,
    }: PaymentStripeSEPAProps,
    ref,
  ) => {
    const isNewCheckoutFlow = React.useContext(CheckoutContext);
    const classes = useStyles({ isNewCheckoutFlow });
    const { t } = useTranslation(['invoice', 'payment']);

    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = React.useState(null);
    const [processing, setProcessing] = React.useState(false);

    const [saveForLater, setSaveForLater] = React.useState(false);
    const [paymentMethodList, setPaymentMethodList] = React.useState([]);
    const [paymentMethodSelected, setPaymentMethodSelected] =
      React.useState(null);
    const [hasDetached, setHasDetached] = React.useState(null);
    const [addPaymentMethod, setAddPaymentMethod] = React.useState(true);

    const setPaymentPageProcessing = React.useCallback(
      (process) => {
        if (setPaymentProcessing) setPaymentProcessing(process);
        setProcessing(process);
      },
      [setPaymentProcessing],
    );

    React.useEffect(() => {
      fetchPaymentMethodListAPI({ member: memberId }).then((r) =>
        setPaymentMethodList(r.data.filter((pm) => pm.type === 'sepa_debit')),
      );
    }, [memberId, clientSecret, hasDetached]);

    React.useEffect(() => {
      setAddPaymentMethod(!paymentMethodList.length);
      if (paymentMethodList.length) {
        setPaymentMethodSelected(paymentMethodList[0].id);
      }
    }, [paymentMethodList]);

    React.useEffect(() => {
      if (addPaymentMethod) {
        setPaymentMethodSelected(null);
      }
    }, [addPaymentMethod]);

    const [billingDetails, setBillingDetails] = React.useState({
      name: userDefaultName || '',
      email: userDefaultEmail || '',
      address: {
        line1: '',
        country: '',
      },
    });

    const [needBillingDetailAddress, setNeedBillingDetailAddress] =
      React.useState(false);

    const iban = elements?.getElement(IbanElement);
    const ibanElementExists = !!iban;
    React.useEffect(() => {
      if (iban) {
        iban.on('change', (data) => {
          if (
            [
              'AD',
              'PF',
              'TF',
              'GI',
              'GB',
              'GG',
              'VA',
              'IM',
              'JE',
              'MC',
              'NC',
              'BL',
              'PM',
              'SM',
              'CH',
              'WF',
            ].includes(data?.country)
          ) {
            setNeedBillingDetailAddress(true);
            setBillingDetails({
              ...billingDetails,
              address: {
                line1: billingDetails.address.line1,
                country: data?.country,
              },
            });
          } else {
            setNeedBillingDetailAddress(false);
          }
        });
      }
      return () => {
        iban?.off('change');
      };
      // eslint-disable-next-line
    }, [
      ibanElementExists,
      setNeedBillingDetailAddress,
      setBillingDetails,
      billingDetails,
    ]);

    const isSubmitButtonDisabled =
      forceDisabled || !stripe || !termsAndConditionsAccepted;

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }
        setPaymentPageProcessing(true);
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

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
            // eslint-disable-next-line
            window.alert(t('paymentPanel.actions.basketInconsistent'));
            window.location.reload();
            return;
          }
        }

        const iban_ = elements.getElement(IbanElement);

        const result = await stripe.confirmSepaDebitPayment(clientSecret, {
          payment_method: paymentMethodSelected || {
            sepa_debit: iban_,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              ...(needBillingDetailAddress
                ? { address: billingDetails.address }
                : {}),
            },
          },
          ...(saveForLater || forceSave
            ? { setup_future_usage: 'off_session' }
            : {}),
        });

        if (result.error) {
          // Show error to your customer.
          setError(result.error);
          setPaymentPageProcessing(false);
          if (onError) onError();
        } else {
          setError(null);

          if (basketId) {
            try {
              await blockPendingBasketAPI(basketId);
            } catch (err) {
              console.error(err);
            }
          }

          if (createPendingBookingsIfNecessary)
            createPendingBookingsIfNecessary({
              payment_group_method_identifier:
                PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
            });

          onSuccess(() => setPaymentPageProcessing(false));
          // Show a confirmation message to your customer.
          // The PaymentIntent is in the 'processing' state.
          // SEPA Direct Debit payments are asynchronous,
          // so funds are not immediately available.
        }
      },
      [
        basketId,
        basketTotalPriceCts,
        billingDetails.address,
        billingDetails.email,
        billingDetails.name,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        elements,
        forceSave,
        needBillingDetailAddress,
        onError,
        onSuccess,
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
        <Typography variant="h6">
          {t(
            `payment:forms.savePaymentMethod.${
              addPaymentMethod ? 'add' : 'select'
            }`,
          )}
        </Typography>
        {addPaymentMethod && (
          <div>
            <IbanForm
              billingDetails={billingDetails}
              disabled={!stripe || !clientSecret}
              error={error}
              isActive={!paymentMethodSelected}
              processing={processing}
              setBillingDetails={setBillingDetails}
              withAddress={needBillingDetailAddress}
            />
            <div
              className={classNames(
                classes.saveAndDisplay,
                customClasses?.saveAndDisplay,
              )}
            >
              <div className={classNames(classes.row, customClasses?.row)}>
                {!hideSaveForLater && (
                  <>
                    <Checkbox
                      checked={saveForLater || forceSave}
                      color="primary"
                      disabled={!!forceSave}
                      onChange={(ev) => setSaveForLater(ev.target.checked)}
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
                  onClick={() => setAddPaymentMethod(false)}
                >
                  <Typography align="right" color="primary" variant="body1">
                    {t(
                      'payment:forms.paymentMethod.actions.displayPaymentMethod',
                    )}
                  </Typography>
                </ButtonBase>
              )}
            </div>
          </div>
        )}

        {!addPaymentMethod && !!paymentMethodList.length && (
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
            <ButtonBase
              className={classNames(
                classes.addButton,
                customClasses?.addButton,
              )}
              disabled={false}
              onClick={() => setAddPaymentMethod(true)}
            >
              <AddIcon
                className={classNames(
                  classes.leftIcon,
                  customClasses?.leftIcon,
                )}
                color="primary"
              />
              <Typography align="left" color="primary" variant="body1">
                {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
              </Typography>
            </ButtonBase>
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
        {(!isNewCheckoutFlow || forceButtonDisplay) && (
          <>
            {AcceptTermsAndConditionsComponent && (
              <div
                className={classNames(
                  classes.conditions,
                  customClasses?.conditions,
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
                    {t('invoice:paymentPanel.actions.confirmPayment')}
                  </Button>
                  <Button disabled={loading || processing} onClick={onCancel}>
                    {t('paymentPanel.actions.cancel')}
                  </Button>
                </React.Fragment>
              )}
            </div>
          </>
        )}
      </form>
    );
  },
);

type NewCheckoutFlowThemeProps = {
  isNewCheckoutFlow?: boolean;
};

const useStyles = makeStyles<Theme, NewCheckoutFlowThemeProps>((theme) => ({
  sensitiveDataContainer: (isNewCheckoutFlow) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isNewCheckoutFlow ? 0 : theme.spacing(2)}px`,
  }),
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    maxWidth: '80vw',
    width: '100%',
  },
  nameAndEmailContainer: (isNewCheckoutFlow) => ({
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isNewCheckoutFlow ? 0 : theme.spacing(2)}px`,
    gap: theme.spacing(2),
  }),
  mandate: (isNewCheckoutFlow) => ({
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
      2,
    )}px ${isNewCheckoutFlow ? 0 : theme.spacing(2)}px`,
    maxWidth: 700,
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
