import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment-timezone';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCompanyCountry, getCurrencyCode } from '#libs/theme/selectors';
import Radio from '#components/css-only/Radio';
import MarketplaceCollectPaymentMethod from '#marketplacecomponents/@Payment/MarketplaceCollectPaymentMethod';
import MarketplaceContractPaymentMethodList from '#marketplacecomponents/@Payment/MarketplaceContractPaymentMethodList';
import {
  MarketplacePaymentMethodBillingDetails,
  MarketplacePaymentMethods,
} from '#libs/marketplace/types';
import { Contract } from '#libs/subscription/types';
import { PaymentMethod } from '#libs/payment/types';
import { OptionCallback } from '../../../../../state/types';
import { appliesToContract } from '#libs/coupon/api';
import CircularProgress from '#components/css-only/CircularProgress';

import './styles.css';
import MarketplaceContractPaymentInfos from './sections/MarketplaceContractPaymentInfos';
import MarketplaceContractPaymentPricing from './sections/MarketplaceContractPaymentPricing.component';
import MarketplaceContractPaymentCoupon from './sections/MarketplaceContractPaymentCoupon';
import { updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI } from '#libs/payment/api';
import Button, { ButtonType } from '#components/css-only/Fabrique/Button';

export type Props = {
  contract: Contract;
  isContractLegalTermsAccepted: boolean;
  isLoading?: boolean;
  billingStartDate: string;
  enabledPaymentMethodsIds: number[];
  enabledPaymentGroupMethodIdentifierIds: number[];
  savedPaymentMethodList: PaymentMethod[];
  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  onlinePaymentEnabled?: boolean;
  isExcludingTax?: boolean;
  detachPaymentMethod: (id: string, options: OptionCallback) => void;
  setBillingStartDate: (value: string) => void;
  setAcceptContractLegalTerms: (checked: boolean) => void;
  onOpenContractTermsDialog: () => void;
  requestSetupIntentSecret: () => { data: { client_secret: string } };
  refreshSavedPaymentMethodList: () => void;
  onCancelContractPayment: () => void;
  onSubmitContractPayment: (
    _: unknown,
    paymentMethodId: string,
    isPaymentMethodForPastInvoicesSaved: boolean,
    paymentMethodPastInvoicesId: number,
    options?: OptionCallback,
    coupon?: string,
  ) => void;
  companyId: string;
  cardBillingDetailsMandatory: boolean;
  paymentMethodFetchDone: boolean;
};

const MarketplaceContractPayment: React.FC<Props> = React.memo(
  ({
    contract,
    isContractLegalTermsAccepted,
    isLoading,
    billingStartDate,
    enabledPaymentMethodsIds,
    enabledPaymentGroupMethodIdentifierIds,
    savedPaymentMethodList,
    sepaDefaultName,
    sepaDefaultEmail,
    onlinePaymentEnabled,
    isExcludingTax,
    detachPaymentMethod,
    setBillingStartDate,
    setAcceptContractLegalTerms,
    onOpenContractTermsDialog,
    requestSetupIntentSecret,
    refreshSavedPaymentMethodList,
    onCancelContractPayment,
    onSubmitContractPayment,
    companyId,
    cardBillingDetailsMandatory,
    paymentMethodFetchDone,
  }) => {
    const companyCountry = getCompanyCountry() || '';
    const [selectedSavedPaymentMethodId, setSelectedSavedPaymentMethodId] =
      useState<string>(null);
    const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
      useState(false);
    const [voucher, setVoucher] = useState<number>(null);
    const [couponCode, setCouponCode] = useState<string>(null);
    const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] =
      useState<MarketplacePaymentMethods | null>(null);
    const defaultBillingDetailsValues = React.useMemo(() => {
      return {
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
          state: '',
        },
      };
    }, [companyCountry, sepaDefaultEmail, sepaDefaultName]);

    const [billingDetails, setBillingDetails] =
      useState<MarketplacePaymentMethodBillingDetails>(
        defaultBillingDetailsValues,
      );

    const { t } = useTranslation([
      'common',
      'checkout',
      'subscription',
      'coupon',
      'payment',
      'invoice',
    ]);

    const selectedPaymentMethodBillingDetails: MarketplacePaymentMethodBillingDetails =
      React.useMemo(() => {
        if (selectedSavedPaymentMethodId) {
          return cloneDeep(
            savedPaymentMethodList?.find(
              (pm) => pm.id === selectedSavedPaymentMethodId,
            )?.billing_details,
          );
        }
        return defaultBillingDetailsValues;
      }, [
        selectedSavedPaymentMethodId,
        savedPaymentMethodList,
        defaultBillingDetailsValues,
      ]);

    const areSpecificBillingDetailsProvided = React.useCallback(
      (specificBillingDetails: MarketplacePaymentMethodBillingDetails) => {
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

    const areInitialBillingDetailsNecessary =
      cardBillingDetailsMandatory &&
      selectedSavedPaymentMethodId &&
      paymentMethod === MarketplacePaymentMethods.card
        ? areSpecificBillingDetailsProvided(selectedPaymentMethodBillingDetails)
        : true;

    const areBillingDetailsProvided =
      cardBillingDetailsMandatory &&
      paymentMethod === MarketplacePaymentMethods.card
        ? areSpecificBillingDetailsProvided(billingDetails)
        : true;

    useEffect(() => {
      /**
       * If no payment method is provided, the payment method type is initialized.
       * If SEPA is one of the available payment methods for subscription
       * or the available payment method for the marketplace, it will be used.
       */
      if (!paymentMethod) {
        const shouldSetSepaPaymentMethod =
          (enabledPaymentGroupMethodIdentifierIds || [])?.includes(
            PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
          ) ||
          (enabledPaymentMethodsIds || [])?.includes(
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
          );
        setPaymentMethod(
          shouldSetSepaPaymentMethod
            ? MarketplacePaymentMethods.sepa
            : MarketplacePaymentMethods.card,
        );
      }

      if (savedPaymentMethodList?.length || paymentMethod) {
        const selectedPaymentMethodList = savedPaymentMethodList?.filter(
          (savedPaymentMethod) => savedPaymentMethod.type === paymentMethod,
        );
        if (selectedPaymentMethodList?.length) {
          const selectedPaymentMethodByDefault = selectedPaymentMethodList[0];
          setSelectedSavedPaymentMethodId(selectedPaymentMethodByDefault.id);
        }
      }
    }, [
      enabledPaymentGroupMethodIdentifierIds,
      enabledPaymentMethodsIds,
      paymentMethod,
      savedPaymentMethodList,
      savedPaymentMethodList?.length,
      sepaDefaultName,
      sepaDefaultEmail,
    ]);

    // Whenever the paymentMethod changes, we change the state of the billing details
    React.useEffect(() => {
      if (selectedSavedPaymentMethodId) {
        setBillingDetails(selectedPaymentMethodBillingDetails);
      } else {
        setBillingDetails(defaultBillingDetailsValues);
      }
    }, [
      selectedSavedPaymentMethodId,
      defaultBillingDetailsValues,
      selectedPaymentMethodBillingDetails,
    ]);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      async (event) => {
        event.preventDefault();
        const isDateValid = moment(billingStartDate).isSameOrAfter(
          moment(),
          'month',
        );

        if (
          isDateValid &&
          !areInitialBillingDetailsNecessary &&
          selectedSavedPaymentMethodId &&
          paymentMethod === MarketplacePaymentMethods.card
        ) {
          await updatePaymentMethodBillingDetailsAPI({
            payment_method_id: selectedSavedPaymentMethodId,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              address: billingDetails.address,
            },
            company: parseInt(companyId),
          });
        }

        if (isDateValid) {
          onSubmitContractPayment(
            null,
            selectedSavedPaymentMethodId,
            null,
            null,
            null,
            (voucher && couponCode) || null,
          );
        }
      },
      [
        couponCode,
        billingStartDate,
        onSubmitContractPayment,
        selectedSavedPaymentMethodId,
        voucher,
        areInitialBillingDetailsNecessary,
        billingDetails,
        companyId,
        paymentMethod,
      ],
    );

    const handleSubmitCollectPaymentMethod = useCallback(() => {
      if (refreshSavedPaymentMethodList) refreshSavedPaymentMethodList();
    }, [refreshSavedPaymentMethodList]);

    const handleSetPaymentMethod = useCallback(
      (value: MarketplacePaymentMethods) => {
        setPaymentMethod(value);
        setSelectedSavedPaymentMethodId(null);
      },
      [],
    );

    const handleOpenCollectPaymentMethodDialog = useCallback(() => {
      setBillingDetails(defaultBillingDetailsValues);
      setCollectPaymentMethodIsOpen(true);
    }, [defaultBillingDetailsValues]);

    const handleCloseCollectPaymentMethodDialog = useCallback(() => {
      setCollectPaymentMethodIsOpen(false);
    }, []);

    const getIsPaymentMethodAvailable = useCallback(
      (
        paymentMethodIdentifier: number,
        paymentGroupMethodIdentifier: number,
      ) => {
        const isPaymentMethodIdentifierEnabled = (
          enabledPaymentMethodsIds || []
        ).includes(paymentMethodIdentifier);

        const isPaymentGroupMethodIdentifierEnabled = (
          enabledPaymentGroupMethodIdentifierIds || []
        ).includes(paymentGroupMethodIdentifier);

        return (
          isPaymentMethodIdentifierEnabled ||
          isPaymentGroupMethodIdentifierEnabled
        );
      },
      [enabledPaymentGroupMethodIdentifierIds, enabledPaymentMethodsIds],
    );

    const handleApplyCoupon = useCallback(
      async (
        formCouponCode: string,
        options: OptionCallback & { onNotFound: () => void },
      ) => {
        await appliesToContract({
          coupon_code: formCouponCode,
          contract: contract?.id,
          with_prorata: !!contract?.month_billing_day,
          from_timestamp: moment(billingStartDate).unix(),
        })
          .then(({ data }) => {
            if (data.can_be_applied) {
              setCouponCode(formCouponCode);
              setVoucher(data.voucher);
              setIsCouponFormOpen(false);
              if (options && options.onSuccess) options.onSuccess();
            } else if (options && options.onError) options.onError();
          })
          .catch(() => {
            if (options && options.onNotFound) options.onNotFound();
          });
      },
      [contract?.id, contract?.month_billing_day, billingStartDate],
    );

    const handleDeleteCoupon = useCallback(() => {
      setCouponCode('');
      setVoucher(null);
    }, []);

    const handleDetachPaymentMethod = useCallback(
      (id: string) => {
        detachPaymentMethod(id, {
          onSuccess: () => setSelectedSavedPaymentMethodId(null),
        });
      },
      [detachPaymentMethod],
    );

    const handleAcceptContract = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) =>
        setAcceptContractLegalTerms(event.target.checked),
      [setAcceptContractLegalTerms],
    );

    const handleOpenCouponForm = useCallback(
      () => setIsCouponFormOpen(true),
      [],
    );

    const handleCloseCouponForm = useCallback(
      () => setIsCouponFormOpen(false),
      [],
    );

    const handleSelectPaymentMethod = useCallback(
      (id: string) => setSelectedSavedPaymentMethodId(id),
      [],
    );

    const filteredSavedPaymentMethodList = useMemo(
      () =>
        paymentMethod
          ? (savedPaymentMethodList || []).filter(
              (method) => method.type === paymentMethod,
            )
          : savedPaymentMethodList,
      [paymentMethod, savedPaymentMethodList],
    );

    const isCurrencyEuro = useMemo(
      () => getCurrencyCode().toLowerCase() === 'eur',
      [],
    );

    const isDisplayPaymentMethodList = useMemo(
      () =>
        [
          MarketplacePaymentMethods.card,
          MarketplacePaymentMethods.sepa,
          MarketplacePaymentMethods.bacs,
        ].includes(paymentMethod) && !(onlinePaymentEnabled === false),
      [onlinePaymentEnabled, paymentMethod],
    );

    const submitDisabled =
      !areBillingDetailsProvided ||
      !isContractLegalTermsAccepted ||
      isLoading ||
      !selectedSavedPaymentMethodId;

    return (
      <form
        className={classNames({
          'bs-contract-payment__form':
            !areInitialBillingDetailsNecessary && selectedSavedPaymentMethodId,
        })}
        onSubmit={handleOnSubmit}
      >
        <div
          className={classNames(
            {
              'bs-contract-payment__container__scroll':
                !areInitialBillingDetailsNecessary &&
                selectedSavedPaymentMethodId,
            },
            'bs-contract-payment__container',
          )}
        >
          <MarketplaceContractPaymentInfos
            billingStartDate={billingStartDate}
            contractName={contract?.name}
            handleAcceptContract={handleAcceptContract}
            isContractLegalTermsAccepted={isContractLegalTermsAccepted}
            onOpenContractTermsDialog={onOpenContractTermsDialog}
            setBillingStartDate={setBillingStartDate}
          />

          <MarketplaceContractPaymentPricing
            billingStartDate={billingStartDate}
            contract={contract}
            isExcludingTax={isExcludingTax}
            voucher={voucher}
          />

          <div className="bs-contract-payment__pricing">
            <MarketplaceContractPaymentCoupon
              couponCode={couponCode}
              isContractLegalTermsAccepted={isContractLegalTermsAccepted}
              isCouponFormOpen={isCouponFormOpen}
              isLoading={isLoading}
              onCancelCouponForm={handleCloseCouponForm}
              onDeleteCoupon={handleDeleteCoupon}
              onOpenCouponForm={handleOpenCouponForm}
              onSubmitCouponForm={handleApplyCoupon}
              voucher={voucher}
            />

            {(enabledPaymentMethodsIds?.length > 1 ||
              enabledPaymentGroupMethodIdentifierIds?.length > 1) && (
              <div className="bs-contract-payment__payment__method__switcher">
                {getIsPaymentMethodAvailable(
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
                  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
                ) && (
                  <Radio
                    className="bs-contract-payment__payment__method__option"
                    disabled={!isContractLegalTermsAccepted}
                    isChecked={paymentMethod === MarketplacePaymentMethods.card}
                    label={t('subscription:paymentMethod.card')}
                    name="payment-method-card"
                    onClick={handleSetPaymentMethod}
                    value={MarketplacePaymentMethods.card}
                  />
                )}
                {getIsPaymentMethodAvailable(
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
                  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
                ) && (
                  <Radio
                    className="bs-contract-payment__payment__method__option"
                    disabled={!isContractLegalTermsAccepted}
                    isChecked={paymentMethod === MarketplacePaymentMethods.bacs}
                    label={t('subscription:paymentMethod.bacs_debit')}
                    name="payment-method-bacs_debit"
                    onClick={handleSetPaymentMethod}
                    value={MarketplacePaymentMethods.bacs}
                  />
                )}
                {getIsPaymentMethodAvailable(
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
                  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
                ) &&
                  isCurrencyEuro && (
                    <Radio
                      className="bs-contract-payment__payment__method__option"
                      disabled={!isContractLegalTermsAccepted}
                      isChecked={
                        paymentMethod === MarketplacePaymentMethods.sepa
                      }
                      label={t('subscription:paymentMethod.sepa')}
                      name="payment-method-sepa_debit"
                      onClick={handleSetPaymentMethod}
                      value={MarketplacePaymentMethods.sepa}
                    />
                  )}
              </div>
            )}
          </div>

          {isDisplayPaymentMethodList && (
            <div className="bs-contract-payment__payment__methods">
              <MarketplaceContractPaymentMethodList
                isContractLegalTermsAccepted={isContractLegalTermsAccepted}
                onDetachPaymentMethod={handleDetachPaymentMethod}
                onSelectPaymentMethod={handleSelectPaymentMethod}
                paymentMethods={filteredSavedPaymentMethodList}
                paymentMethodType={paymentMethod}
                selectedPaymentMethod={selectedSavedPaymentMethodId}
              />

              <MarketplaceCollectPaymentMethod
                areInitialBillingDetailsNecessary={
                  areInitialBillingDetailsNecessary
                }
                billingDetails={billingDetails}
                cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                companyCountry={companyCountry}
                companyId={companyId}
                isContractLegalTermsAccepted={isContractLegalTermsAccepted}
                isOpen={collectPaymentMethodIsOpen}
                onCancel={handleCloseCollectPaymentMethodDialog}
                onSuccess={handleSubmitCollectPaymentMethod}
                paymentMethodFetchDone={paymentMethodFetchDone}
                requestSetupIntentSecret={requestSetupIntentSecret}
                savedPaymentMethodList={savedPaymentMethodList}
                selectedSavedPaymentMethodId={selectedSavedPaymentMethodId}
                sepaDefaultEmail={sepaDefaultEmail}
                sepaDefaultName={sepaDefaultName}
                setBillingDetails={setBillingDetails}
                type={paymentMethod}
              />

              <Button
                classes={{ root: 'bs-contract-payment__payment__methods__add' }}
                isDisabled={!isContractLegalTermsAccepted}
                onClick={handleOpenCollectPaymentMethodDialog}
              >
                <AddIcon />
                {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
              </Button>
            </div>
          )}

          <div className="bs-contract-payment__actions">
            <Button
              classes={{ root: 'bs-contract-payment__cancel__button' }}
              onClick={onCancelContractPayment}
            >
              {t('common:cancel')}
            </Button>
            <Button
              classes={{ root: 'bs-contract-payment__submit__button' }}
              isDisabled={submitDisabled}
              type={ButtonType.SUBMIT}
            >
              {isLoading ? (
                <CircularProgress contrastStrokeColor size="sm" />
              ) : (
                t('checkout:myBasket.actions.checkoutBasket')
              )}
            </Button>
          </div>
        </div>
      </form>
    );
  },
);

export const MarketplaceContractPaymentForStorybook = marketplaceCssHoc()(
  MarketplaceContractPayment,
);

export default MarketplaceContractPayment;
