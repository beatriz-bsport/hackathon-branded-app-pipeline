// @flow
import React, { useImperativeHandle, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const IbanForm = (props: PropsIban) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  const { billingDetails, setBillingDetails, processing } = props;

  return (
    <div>
      <div className={classes.nameAndEmailContainer}>
        <TextField
          required={props.isActive}
          fullWidth
          value={billingDetails.name}
          variant="outlined"
          placeholder={t('mandate.name')}
          disabled={props.disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              name: value,
            });
          }}
        />
        <TextField
          type="email"
          required={props.isActive}
          fullWidth
          variant="outlined"
          value={billingDetails.email}
          placeholder={t('mandate.email')}
          disabled={props.disabled}
          onChange={(ev) => {
            const { value } = ev.target;
            setBillingDetails({
              ...billingDetails,
              email: value,
            });
          }}
        />
        {props.withAddress && (
          <TextField
            required
            fullWidth
            value={billingDetails.address.line1}
            variant="outlined"
            placeholder={t('mandate.address_line_1')}
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
          />
        )}
      </div>
      <div style={processing ? { display: 'none' } : {}}>
        <div className={classes.sensitiveDataContainer}>
          <div className={classes.sensitiveData}>
            <IbanElement options={IBAN_ELEMENT_OPTIONS} />
            {!!props.error && (
              <StripeErrorCode
                errorCode={props.error.code}
                declineCode={props.error.decline_code}
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
  onError: () => void;
  onSuccess: (callback: () => void) => void;
  memberId?: number;
  companyId?: number;
  clientSecret: string;
  onCancel: () => void;
  termsAndConditionsAccepted: boolean;
  AcceptTermsAndConditionsComponent: React.Component;
  forceDisabled?: boolean;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
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
  checkItemsBasket: (basketId: string) => boolean;
  setPaymentProcessing: (processing: boolean) => void;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
};

export const PaymentStripeSEPA = forwardRef(
  (
    {
      onError,
      onSuccess,
      memberId,
      companyId,
      clientSecret,
      onCancel,
      termsAndConditionsAccepted,
      AcceptTermsAndConditionsComponent,
      forceDisabled,
      detachPaymentMethodLoading,
      detachPaymentMethod,
      snackbarErrorMsg,
      snackbarSuccessMsg,
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
    }: PaymentStripeSEPAProps,
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation('invoice');

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

    const isNewCheckoutFlow = React.useContext(CheckoutContext);

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

    const iban = elements.getElement(IbanElement);
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
    }, [!!iban, setNeedBillingDetailAddress, setBillingDetails, billingDetails]);

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
          {t('payment:forms.savePaymentMethod.section')}
        </Typography>
        {addPaymentMethod && (
          <div>
            <IbanForm
              withAddress={needBillingDetailAddress}
              setBillingDetails={setBillingDetails}
              billingDetails={billingDetails}
              error={error}
              disabled={!stripe || !clientSecret}
              processing={processing}
              isActive={!paymentMethodSelected}
            />
            <div className={classes.saveAndDisplay}>
              <div className={classes.row}>
                <Checkbox
                  checked={saveForLater || forceSave}
                  disabled={!!forceSave}
                  onChange={(ev) => setSaveForLater(ev.target.checked)}
                />
                <Typography variant={isNewCheckoutFlow ? 'body1' : 'caption'}>
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
                <div className={classes.securityInformationContainer}>
                  <PopOver
                    title={t('paymentPanel.actions.paymentSecurityInformation')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    className={classes.securityInformationText}
                  >
                    <Info className={classes.infoIcon} />
                  </PopOver>
                </div>
              </div>

              {!!paymentMethodList.length && (
                <ButtonBase
                  onClick={() => setAddPaymentMethod(false)}
                  className={classes.displayButton}
                >
                  <Typography variant="body1" align="right" color="primary">
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
              savedPaymentMethodList={paymentMethodList}
              selectedSavedPaymentMethodId={paymentMethodSelected}
              paymentMethodType="sepa_debit"
              onSelect={(id: string) => defineSelectedPaymentMethod(id)}
              setHasDetached={setHasDetached}
              memberId={memberId}
              detachPaymentMethodLoading={detachPaymentMethodLoading}
              detachPaymentMethod={detachPaymentMethod}
              snackbarErrorMsg={snackbarErrorMsg}
              snackbarSuccessMsg={snackbarSuccessMsg}
              companyId={companyId}
              sepaDefaultName={userDefaultName}
              sepaDefaultEmail={userDefaultEmail}
            />
            <ButtonBase
              disabled={false}
              onClick={() => setAddPaymentMethod(true)}
              className={classes.addButton}
            >
              <AddIcon className={classes.leftIcon} color="primary" />
              <Typography variant="body1" align="left" color="primary">
                {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
              </Typography>
            </ButtonBase>
          </div>
        )}
        {allowConsumerToUseInternalAccount && !!creditAccountBalance && (
          <UseInternalAccountForm
            creditAccountBalance={creditAccountBalance}
            onBasketSubmit={useInternalAccount}
            onInvoiceSubmit={applyBalanceToInvoice}
            loading={loading || applyBalanceLoading}
          />
        )}
        {!isNewCheckoutFlow && (
          <>
            <div className={classes.conditions}>
              {AcceptTermsAndConditionsComponent}
            </div>
            <div className={classes.actionRow}>
              {processing ? (
                <CircularProgress />
              ) : (
                <React.Fragment>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitButtonDisabled}
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

const useStyles = makeStyles((theme) => ({
  sensitiveDataContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing(2),
    minWidth: '30vw',
    maxWidth: '80vw',
    width: '100%',
  },
  nameAndEmailContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  mandate: {
    padding: theme.spacing(2),
    maxWidth: 700,
  },
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
}));

export default PaymentStripeSEPA;
