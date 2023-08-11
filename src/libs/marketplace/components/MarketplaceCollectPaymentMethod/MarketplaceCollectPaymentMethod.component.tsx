import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  CardElement,
  IbanElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import {
  SetupIntentResult,
  Stripe,
  StripeElements,
  loadStripe,
} from '@stripe/stripe-js';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import classNames from 'classnames';

import { cloneDeep } from 'lodash';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';
import { getStripePkKey } from '../../../theme/selectors';
// @ts-ignore
import { AVAILABLE_PAYMENT_METHOD_TYPE } from '../../../payment/components/payment-backend-stripe-deprecated/helpers';
import CircularProgress from '#csscomponents/CircularProgress';
import Select from '#components/css-only/Select';
import { LOCALE_LIST } from '#components/input/LocaleSelector.component';
import { getSepaDebitNeedsBillingAddress } from '#libs/marketplace/utils';

import {
  MarketplacePaymentMethodBillingDetails,
  MarketplacePaymentMethods,
  MarketplaceStripeElementType,
} from '#libs/marketplace/types';
import { SelectOptionWithMetaData } from '#components/css-only/Select/Select.component';

import './styles.css';
import { usePaymentMethodBillingDetails } from '#libs/marketplace/hooks';
import MarketplaceCardBillingDetailsFormFields from './MarketplaceCardBillingDetailsFormFields.component';
import { PaymentMethod } from '#libs/payment/types';

const stripePromise = loadStripe(getStripePkKey());

export type Props = {
  type: MarketplacePaymentMethods;
  isOpen: boolean;
  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  stripe: Stripe;
  elements: StripeElements;
  requestSetupIntentSecret: () => { data: { client_secret: string } };
  onSuccess: (setupIntentResult: SetupIntentResult) => void;
  onCancel: () => void;
  companyId?: string;
  selectedSavedPaymentMethodId?: string;
  savedPaymentMethodList: PaymentMethod[];
  areInitialBillingDetailsNecessary: boolean;
  setAreInitialBillingDetailsNecessary: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  billingDetails: MarketplacePaymentMethodBillingDetails;
  setBillingDetails: React.Dispatch<
    React.SetStateAction<MarketplacePaymentMethodBillingDetails>
  >;
  cardBillingDetailsMandatory: boolean;
  paymentMethodFetchDone: boolean;
  isContractLegalTermsAccepted: boolean;
  setInitialBillingDetails: React.Dispatch<
    React.SetStateAction<MarketplacePaymentMethodBillingDetails>
  >;
  initialBillingDetails: MarketplacePaymentMethodBillingDetails;
  companyCountry?: string;
};

type PaymentMethodInputProps = {
  type: MarketplacePaymentMethods;
};

export type CountryMetaData = {
  metaData: {
    locale: string;
    icon: string;
  };
};

export const CountryOption: React.FC<{
  option: SelectOptionWithMetaData<CountryMetaData>;
}> = React.memo(({ option }) => (
  <div className="bs-select__dropdown__list__item__with__indicator">
    <img
      alt={option.metaData.locale}
      className="bs-select_dropdown__list__item__indicator"
      src={option.metaData.icon}
    />
    {option.label}
  </div>
));

const PaymentMethodInput: React.FC<PaymentMethodInputProps> = React.memo(
  ({ type }) => {
    if (type === MarketplacePaymentMethods.card) {
      return (
        <div className="bs-collect-payment-method__dialog__sensitive__data__container">
          <CardElement
            options={{
              hidePostalCode: true,
              style: { base: { fontSize: '18px' } },
            }}
          />
        </div>
      );
    }
    if (type === MarketplacePaymentMethods.sepa) {
      return (
        <div className="bs-collect-payment-method__dialog__sensitive__data__container">
          <IbanElement
            options={{
              supportedCountries: ['SEPA'],
              style: {
                base: { fontSize: '18px' },
              },
            }}
          />
        </div>
      );
    }
    return <></>;
  },
);

const MarketplaceCollectPaymentMethod: React.FC<Props> = React.memo(
  ({
    type,
    isOpen,
    sepaDefaultName,
    sepaDefaultEmail,
    stripe,
    elements,
    requestSetupIntentSecret,
    onCancel,
    onSuccess,
    companyId,
    selectedSavedPaymentMethodId,
    savedPaymentMethodList,
    setAreInitialBillingDetailsNecessary,
    areInitialBillingDetailsNecessary,
    billingDetails,
    setBillingDetails,
    cardBillingDetailsMandatory,
    setInitialBillingDetails,
    initialBillingDetails,
    paymentMethodFetchDone,
    isContractLegalTermsAccepted,
    companyCountry,
  }) => {
    const [
      isSepaDebitBillingAddressRequired,
      setIsSepaDebitBillingAddressRequired,
    ] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [stripeErrorCode, setStripeErrorCode] = useState<number>(null);
    const [stripeDeclineCode, setStripeDeclineCode] = useState<number>(null);
    const [clientSecret, setClientSecret] = useState<string>(null);

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { t } = useTranslation([
      'payment',
      'stripe',
      'marketing',
      'login',
      'invoice',
    ]);
    const stripePaymentMethod: {
      element?: React.ReactElement;
      type: MarketplaceStripeElementType;
      method: string;
    } = AVAILABLE_PAYMENT_METHOD_TYPE[type];

    const {
      handleChangeName,
      handleChangeEmail,
      handleChangeLineOne,
      handleChangeLineTwo,
      handleChangePostalCode,
      handleChangeCity,
      handleChangeCountry,
      handleChangeSortCode,
      handleChangeAccountNumber,
    } = usePaymentMethodBillingDetails(setBillingDetails);

    const handleRetry = useCallback(() => {
      setError(false);
      setSuccess(false);
    }, []);

    const detectSepaDebitNeedsBillingAddress = useCallback(
      (country: string) => {
        if (getSepaDebitNeedsBillingAddress(country)) {
          setIsSepaDebitBillingAddressRequired(true);
          setBillingDetails((prevState) => ({
            ...prevState,
            address: { ...prevState.address, country },
          }));
        } else {
          setIsSepaDebitBillingAddressRequired(false);
        }
      },
      [setBillingDetails],
    );

    useEffect(() => {
      // if company is inside required_company_id, then check initialBillingDetails
      if (
        paymentMethodFetchDone &&
        type === MarketplacePaymentMethods.card &&
        cardBillingDetailsMandatory
      ) {
        setAreInitialBillingDetailsNecessary(
          !!initialBillingDetails?.name &&
            !!initialBillingDetails?.address.line1 &&
            !!initialBillingDetails?.address.postal_code &&
            !!initialBillingDetails?.address.city &&
            !!initialBillingDetails?.address.country,
        );
      }
    }, [
      initialBillingDetails,
      setAreInitialBillingDetailsNecessary,
      companyId,
      paymentMethodFetchDone,
      type,
      cardBillingDetailsMandatory,
    ]);

    useEffect(() => {
      if (
        selectedSavedPaymentMethodId &&
        paymentMethodFetchDone &&
        cardBillingDetailsMandatory &&
        type === MarketplacePaymentMethods.card
      ) {
        const selectedSavedPaymentMethodBillingDetails =
          savedPaymentMethodList.find(
            (paymentMethod) =>
              paymentMethod.id === selectedSavedPaymentMethodId,
          )?.billing_details;
        setInitialBillingDetails(
          Object.keys(selectedSavedPaymentMethodBillingDetails ?? {}).length
            ? selectedSavedPaymentMethodBillingDetails
            : null,
        );
        setBillingDetails(
          Object.keys(selectedSavedPaymentMethodBillingDetails ?? {}).length
            ? cloneDeep(selectedSavedPaymentMethodBillingDetails)
            : null,
        );
      }
    }, [
      paymentMethodFetchDone,
      selectedSavedPaymentMethodId,
      savedPaymentMethodList,
      setBillingDetails,
      setInitialBillingDetails,
      setAreInitialBillingDetailsNecessary,
      cardBillingDetailsMandatory,
      sepaDefaultEmail,
      sepaDefaultName,
      type,
    ]);

    useEffect(() => {
      if (!clientSecret && isOpen) {
        const getClientSecret = async () => {
          try {
            const clientSecretResponse = await requestSetupIntentSecret();
            setClientSecret(clientSecretResponse.data.client_secret);
          } catch (err) {
            setError(true);
            setStripeErrorCode(err.response?.data?.code ?? null);
            setStripeDeclineCode(err.response?.data?.decline_code ?? null);
          }
        };
        getClientSecret();
        handleRetry();
      }
      if (isOpen && elements && type === MarketplacePaymentMethods.sepa) {
        const ibanElement = elements.getElement(
          stripePaymentMethod.type as MarketplaceStripeElementType.sepa,
        );
        ibanElement.on('change', (data: { country: string }) => {
          detectSepaDebitNeedsBillingAddress(data?.country);
        });
      }
    }, [
      isOpen,
      elements,
      stripePaymentMethod?.type,
      clientSecret,
      type,
      detectSepaDebitNeedsBillingAddress,
      handleRetry,
      requestSetupIntentSecret,
    ]);

    const onDialogClose = useCallback(() => {
      setProcessing(false);
      setStripeErrorCode(null);
      setStripeDeclineCode(null);
      setClientSecret(null);
      setBillingDetails({
        name: sepaDefaultName ?? '',
        email: sepaDefaultEmail ?? '',
        sortCode: '',
        accountNumber: '',
        address: {
          line1: '',
          line2: '',
          postal_code: '',
          city: '',
          country: companyCountry,
        },
      });
      setError(false);
      setSuccess(false);
      onCancel && onCancel();
    }, [
      onCancel,
      sepaDefaultEmail,
      sepaDefaultName,
      setBillingDetails,
      companyCountry,
    ]);

    const { dialogRef, modalRef } = useDialogClickAwayListener({
      onDialogClose,
    });

    const handleSubmit = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setProcessing(true);
        setStripeErrorCode(null);
        setStripeDeclineCode(null);

        const element = [
          MarketplacePaymentMethods.card,
          MarketplacePaymentMethods.sepa,
        ].includes(type)
          ? // @ts-ignore
            elements.getElement(stripePaymentMethod.type)
          : null;

        const paymentSetupCardParams = {
          card: element,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: {
              line1: billingDetails.address.line1,
              line2: billingDetails.address.line2,
              country: billingDetails.address.country,
              city: billingDetails.address.city,
              postal_code: billingDetails.address.postal_code,
              state: billingDetails.address.state,
            },
          },
        };
        const paymentSetupSepaParams = {
          sepa_debit: element,
          billing_details: isSepaDebitBillingAddressRequired
            ? {
                name: billingDetails.name,
                email: billingDetails.email,
                address: {
                  line1: billingDetails.address.line1,
                  country: billingDetails.address.country,
                },
              }
            : {
                name: billingDetails.name,
                email: billingDetails.email,
              },
        };
        const paymentSetupBacsParams = {
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: {
              line1: billingDetails.address.line1,
              line2: billingDetails.address.line2,
              country: billingDetails.address.country,
              city: billingDetails.address.city,
              postal_code: billingDetails.address.postal_code,
            },
          },
          bacs_debit: {
            sort_code: billingDetails.sortCode,
            account_number: billingDetails.accountNumber,
          },
        };

        const getPaymentSetupParams = () => {
          switch (type) {
            case MarketplacePaymentMethods.card:
              return paymentSetupCardParams;
            case MarketplacePaymentMethods.sepa:
              return paymentSetupSepaParams;
            case MarketplacePaymentMethods.bacs:
              return paymentSetupBacsParams;
            default:
              return null;
          }
        };

        try {
          const paymentMethodSetupResponse = await stripe[
            stripePaymentMethod?.method as
              | 'confirmCardSetup'
              | 'confirmSepaDebitSetup'
              | 'confirmBacsDebitSetup'
          ](clientSecret, {
            // @ts-ignore
            payment_method: getPaymentSetupParams(),
          });
          if (paymentMethodSetupResponse.error) {
            throw paymentMethodSetupResponse.error;
          }
          setSuccess(true);
          if (onSuccess) {
            onSuccess(paymentMethodSetupResponse);
          }
        } catch (err) {
          setError(true);
          err.code && setStripeErrorCode(err.code);
          err.decline_code && setStripeDeclineCode(err.decline_code);
        } finally {
          setProcessing(false);
        }
      },
      [
        billingDetails,
        clientSecret,
        elements,
        isSepaDebitBillingAddressRequired,
        stripe,
        stripePaymentMethod?.method,
        stripePaymentMethod?.type,
        type,
        onSuccess,
      ],
    );
    const countryOptions = useMemo(
      () =>
        LOCALE_LIST.map((localeContainer) => {
          const [, country] = localeContainer.locale.split('_');

          return {
            label: t(`login:country.${country}`),
            value: country,
            metaData: {
              locale: localeContainer.locale,
              icon: localeContainer.icon,
            },
          };
        }),
      [t],
    );

    return (
      <>
        {!areInitialBillingDetailsNecessary &&
          !isOpen &&
          type === MarketplacePaymentMethods.card &&
          selectedSavedPaymentMethodId && (
            <MarketplaceCardBillingDetailsFormFields
              billingDetails={billingDetails}
              countryOptions={countryOptions}
              disabled={processing || !stripe || !isContractLegalTermsAccepted}
              setBillingDetails={setBillingDetails}
            />
          )}

        {isOpen && (
          <form
            ref={dialogRef}
            className="bs-collect-payment-method__dialog__backdrop"
            onSubmit={handleSubmit}
          >
            <div
              ref={modalRef}
              className="bs-collect-payment-method__dialog__container"
            >
              <h6 className="bs-collect-payment-method__dialog__title">
                {t('forms.paymentMethod.collect.title')}
              </h6>

              <p className="bs-collect-payment-method__dialog__content">
                {t('forms.paymentMethod.collect.content')}
              </p>

              {type === MarketplacePaymentMethods.card &&
                !error &&
                !success &&
                cardBillingDetailsMandatory && (
                  <MarketplaceCardBillingDetailsFormFields
                    billingDetails={billingDetails}
                    countryOptions={countryOptions}
                    disabled={processing || !clientSecret || !stripe}
                    setBillingDetails={setBillingDetails}
                  />
                )}

              {type === MarketplacePaymentMethods.sepa && !error && !success && (
                <div className="bs-collect-payment-method__mandate__fields__container">
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeName}
                    placeholder={t('subscription:mandate.name')}
                    value={billingDetails.name}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeEmail}
                    placeholder={t('subscription:mandate.email')}
                    type="email"
                    value={billingDetails.email}
                  />
                </div>
              )}

              {type === MarketplacePaymentMethods.bacs && !error && !success && (
                <div className="bs-collect-payment-method__mandate__fields__container">
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeName}
                    placeholder={t('subscription:mandate.name')}
                    value={billingDetails.name}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeEmail}
                    placeholder={t('subscription:mandate.email')}
                    type="email"
                    value={billingDetails.email}
                  />
                  <Select
                    fullWidth
                    classes={{ buttonContainer: 'bs-select__button__square' }}
                    onChange={handleChangeCountry}
                    options={countryOptions}
                    placeholder={t('translation:form.address.country')}
                    renderListItem={(
                      option: SelectOptionWithMetaData<CountryMetaData>,
                    ) => <CountryOption option={option} />}
                    value={billingDetails.address.country}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeLineOne}
                    placeholder={t('marketing:customForm.field.address_line_1')}
                    value={billingDetails.address.line1}
                  />
                  <input
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeLineTwo}
                    placeholder={t('marketing:customForm.field.address_line_2')}
                    value={billingDetails.address.line2}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangePostalCode}
                    placeholder={t('marketing:customForm.field.zipcode')}
                    value={billingDetails.address.postal_code}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeCity}
                    placeholder={t('marketing:customForm.field.city')}
                    value={billingDetails.address.city}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeSortCode}
                    placeholder={t('subscription:mandate.sortCode')}
                    value={billingDetails.sortCode}
                  />
                  <input
                    required
                    className="bs-collect-payment-method__mandate__field"
                    onChange={handleChangeAccountNumber}
                    placeholder={t('subscription:mandate.accountNumber')}
                    value={billingDetails.accountNumber}
                  />
                </div>
              )}

              {error && (
                <div className="bs-collect-payment-method__info__container">
                  <ErrorIcon className="bs-collect-payment-method__icon" />
                  <span className="bs-collect-payment-method__indicator">
                    {t('forms.paymentMethod.message.error')}
                  </span>
                  {stripeErrorCode && (
                    <span className="bs-collect-payment-method__error__message">
                      {t(`stripe:error_code.${stripeErrorCode}`)}
                    </span>
                  )}
                  {stripeDeclineCode && (
                    <span className="bs-collect-payment-method__error__message">
                      {t(`stripe:decline_code.${stripeDeclineCode}`)}
                    </span>
                  )}
                </div>
              )}

              {success && (
                <div className="bs-collect-payment-method__info__container">
                  <CheckIcon className="bs-collect-payment-method__icon bs-primary-text" />
                  <span className="bs-collect-payment-method__indicator">
                    {t('forms.paymentMethod.message.success')}
                  </span>
                </div>
              )}

              {!(error || success) && <PaymentMethodInput type={type} />}

              {isSepaDebitBillingAddressRequired && !error && !success && (
                <input
                  className="bs-collect-payment-method__mandate__field"
                  onChange={handleChangeLineOne}
                  placeholder={t('marketing:customForm.field.address_line_1')}
                  required={isSepaDebitBillingAddressRequired}
                  value={billingDetails.address.line1}
                />
              )}

              {type === MarketplacePaymentMethods.sepa &&
                !error &&
                !success && (
                  <div className="bs-collect-payment-method__mandate__terms">
                    {t('subscription:mandate.contentIban')}
                  </div>
                )}

              {type === MarketplacePaymentMethods.bacs &&
                !error &&
                !success && (
                  <div className="bs-collect-payment-method__mandate__terms">
                    {t('subscription:mandate.contentBacsDebit')}
                  </div>
                )}

              <div className="bs-collect-payment-method__dialog__actions">
                <button
                  className="bs-collect-payment-method__cancel__button"
                  onClick={onDialogClose}
                  type="button"
                >
                  {t('forms.paymentMethod.actions.close')}
                </button>
                {!!error && (
                  <button
                    className="bs-collect-payment-method__try__again__button"
                    onClick={handleRetry}
                    type="submit"
                  >
                    {t('forms.paymentMethod.actions.retry')}
                  </button>
                )}
                {!error && !success && (
                  <button
                    className={classNames(
                      'bs-collect-payment-method__submit__button',
                      {
                        'bs-collect-payment-method__button--disabled':
                          processing,
                      },
                    )}
                    disabled={processing}
                    type="submit"
                  >
                    {processing ? (
                      <CircularProgress />
                    ) : (
                      t('forms.paymentMethod.actions.collect')
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </>
    );
  },
);

export const MarketplaceCollectPaymentMethodForStorybook = marketplaceCssHoc()(
  // @ts-ignore
  (props: Omit<Props, 'stripe' | 'elements'>) => (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <MarketplaceCollectPaymentMethod
            elements={elements}
            stripe={stripe}
            {...props}
          />
        )}
      </ElementsConsumer>
    </Elements>
  ),
);

export default (props: Omit<Props, 'stripe' | 'elements'>) => (
  <Elements stripe={stripePromise}>
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <MarketplaceCollectPaymentMethod
          elements={elements}
          stripe={stripe}
          {...props}
        />
      )}
    </ElementsConsumer>
  </Elements>
);
