import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { DateTime } from 'luxon';

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
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { getCompanyCountry, getCurrencyCode } from '#src/libs/theme/selectors';
import Radio from '#src/components/css-only/Radio';
import MarketplaceCollectPaymentMethod from '#src/libs/marketplace/components/@Payment/MarketplaceCollectPaymentMethod';
import MarketplaceContractPaymentMethodList from '#src/libs/marketplace/components/@Payment/MarketplaceContractPaymentMethodList';
import {
  MarketplacePaymentMethodBillingDetails,
  MarketplacePaymentMethods,
} from '#src/libs/marketplace/types';
import { Contract } from '#src/libs/subscription/types';
import { PaymentMethod } from '#src/libs/payment/types';
import { appliesToContract } from '#src/libs/coupon/api';
import CircularProgress from '#src/components/css-only/CircularProgress';

import { updatePaymentMethodBillingDetails as updatePaymentMethodBillingDetailsAPI } from '#src/libs/payment/api';
import Button, { ButtonType } from '#src/components/css-only/Fabrique/Button';

import { CouponErrorCodes } from '#src/libs/coupon/constants';
import type { Coupon } from '#src/libs/coupon/types';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import MarketplaceContractPaymentAlert from './sections/MarketplaceContractPaymentAlert.component';
import MarketplaceContractPaymentCoupon from './sections/MarketplaceContractPaymentCoupon';
import MarketplaceContractPaymentPricing from './sections/MarketplaceContractPaymentPricing.component';
import MarketplaceContractPaymentInfos from './sections/MarketplaceContractPaymentInfos';
import {
  OptionCallBackWithKeyedCallbacks,
  OptionCallback,
} from '../../../../../state/types';

import './styles.css';

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
    establishmentBillingGroupId?: number,
  ) => void;
  companyId: string;
  cardBillingDetailsMandatory: boolean;
  paymentMethodFetchDone: boolean;
  defaultEstablishmentBillingGroup?: EstablishmentBillingGroup;
  enableMultiLocalization: boolean;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
  isEstablishmentBillingGroupSelected?: boolean;
  setIsEstablishmentBillingGroupSelected?: (_: boolean) => void;
  updateMemberBillingGroup?: (establishmentBillingGroupId: number) => void;
  memberId?: number;
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
    defaultEstablishmentBillingGroup,
    enableMultiLocalization,
    establishmentBillingGroups,
    setIsEstablishmentBillingGroupSelected,
    updateMemberBillingGroup,
  }) => {
    const companyCountry = getCompanyCountry() || '';
    const [selectedSavedPaymentMethodId, setSelectedSavedPaymentMethodId] =
      useState<string>(null);
    const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
      useState(false);
    const [voucher, setVoucher] = useState<number>(null);
    const [couponCode, setCouponCode] = useState<string>(null);
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

    const [
      selectedEstablishmentBillingGroup,
      setSelectedEstablishmentBillingGroup,
    ] = useState<EstablishmentBillingGroup | null>(
      defaultEstablishmentBillingGroup || null,
    );

    useEffect(() => {
      setSelectedEstablishmentBillingGroup(defaultEstablishmentBillingGroup);
      setIsEstablishmentBillingGroupSelected(true);
    }, [
      defaultEstablishmentBillingGroup,
      setIsEstablishmentBillingGroupSelected,
      setSelectedEstablishmentBillingGroup,
    ]);

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
        const isBacsEnabled = getIsPaymentMethodAvailable(
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
          PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
        );

        const isSepaEnabled = getIsPaymentMethodAvailable(
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
          PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        );
        if (isBacsEnabled) {
          setPaymentMethod(MarketplacePaymentMethods.bacs);
        } else if (isSepaEnabled) {
          setPaymentMethod(MarketplacePaymentMethods.sepa);
        } else {
          setPaymentMethod(MarketplacePaymentMethods.card);
        }
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
      getIsPaymentMethodAvailable,
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
        if (enableMultiLocalization && selectedEstablishmentBillingGroup) {
          updateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
        }
        const isDateValid =
          DateTime.fromISO(billingStartDate).startOf('month') >=
          DateTime.now().startOf('month');

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
            selectedEstablishmentBillingGroup?.id,
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
        updateMemberBillingGroup,
        selectedEstablishmentBillingGroup,
        enableMultiLocalization,
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

    const handleApplyCoupon = useCallback(
      async (
        formCouponCode: string,
        options: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
      ) => {
        await appliesToContract({
          coupon_code: formCouponCode,
          contract: contract?.id,
          with_prorata: !!contract?.month_billing_day,
          from_timestamp: DateTime.fromISO(billingStartDate).toSeconds(),
        })
          .then(({ data }) => {
            if (data.can_be_applied) {
              setCouponCode(formCouponCode);
              setVoucher(Math.round(data.voucher * 100) / 100);
              if (options && options.onSuccess) options.onSuccess();
            } else if (options && options.onError) options.onError();
          })
          .catch(() => {
            if (options && options.onError) options.onError();
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
      (enableMultiLocalization &&
        !selectedEstablishmentBillingGroup &&
        !!establishmentBillingGroups?.length) ||
      isLoading ||
      !selectedSavedPaymentMethodId;

    return (
      <form className="bs-contract-payment__form" onSubmit={handleOnSubmit}>
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

          <MarketplaceContractPaymentAlert
            billingStartDate={billingStartDate}
            contract={contract}
            voucher={voucher}
          />

          <MarketplaceContractPaymentCoupon
            contractId={contract?.id}
            couponCode={couponCode}
            isContractLegalTermsAccepted={isContractLegalTermsAccepted}
            isLoading={isLoading}
            onDeleteCoupon={handleDeleteCoupon}
            onSubmitCouponForm={handleApplyCoupon}
            voucher={voucher}
          />

          <MarketplaceContractPaymentPricing
            billingStartDate={billingStartDate}
            contract={contract}
            isExcludingTax={isExcludingTax}
            voucher={voucher}
          />

          <div className="bs-contract-payment__pricing">
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

          <CheckoutBillingGroupSelector
            enableMultiLocalization={enableMultiLocalization}
            establishmentBillingGroups={establishmentBillingGroups}
            selectedEstablishmentBillingGroup={
              selectedEstablishmentBillingGroup
            }
            setIsEstablishmentBillingGroupSelected={
              setIsEstablishmentBillingGroupSelected
            }
            setSelectedEstablishmentBillingGroup={
              setSelectedEstablishmentBillingGroup
            }
          />

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
