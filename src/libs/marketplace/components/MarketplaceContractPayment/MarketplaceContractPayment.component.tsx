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
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyCode } from '#libs/theme/selectors';
import Radio from '#components/css-only/Radio';
import MarketplaceCollectPaymentMethod from '#libs/marketplace/components/MarketplaceCollectPaymentMethod';
import MarketplaceContractPaymentMethodList from '#libs/marketplace/components/MarketplaceContractPaymentMethodList';
import { MarketplacePaymentMethods } from '#libs/marketplace/types';
import { Contract } from '#libs/subscription/types';
import { PaymentMethod } from '#libs/payment/types';
import { OptionCallback } from '../../../../state/types';
import { appliesToContract } from '#libs/coupon/api';
import CircularProgress from '#components/css-only/CircularProgress';

import './styles.css';
import MarketplaceContractPaymentInfos from './sections/MarketplaceContractPaymentInfos';
import MarketplaceContractPaymentPricing from './sections/MarketplaceContractPaymentPricing.component';
import MarketplaceContractPaymentCoupon from './sections/MarketplaceContractPaymentCoupon';

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
  detachPaymentMethod: (id: string, onSuccess: () => void) => void;
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
  }) => {
    const [selectedSavedPaymentMethodId, setSelectedSavedPaymentMethodId] =
      useState<string>(null);
    const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
      useState(false);
    const [voucher, setVoucher] = useState<number>(null);
    const [couponCode, setCouponCode] = useState<string>(null);
    const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] =
      useState<MarketplacePaymentMethods | null>(null);

    const { t } = useTranslation([
      'common',
      'checkout',
      'subscription',
      'coupon',
      'payment',
      'invoice',
    ]);

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
          setSelectedSavedPaymentMethodId(selectedPaymentMethodList[0].id);
        }
      }
    }, [
      enabledPaymentGroupMethodIdentifierIds,
      enabledPaymentMethodsIds,
      paymentMethod,
      savedPaymentMethodList,
      savedPaymentMethodList?.length,
    ]);

    const handleOnSubmit: FormEventHandler<HTMLFormElement> = useCallback(
      async (event) => {
        event.preventDefault();
        const isDateValid = moment(billingStartDate).isSameOrAfter(
          moment(),
          'month',
        );

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
      setCollectPaymentMethodIsOpen(true);
    }, []);

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
        detachPaymentMethod(id, () => setSelectedSavedPaymentMethodId(null));
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

    return (
      <form
        className={classNames('bs-contract-payment__form')}
        onSubmit={handleOnSubmit}
      >
        <div className="bs-contract-payment__container">
          <MarketplaceContractPaymentInfos
            contractName={contract?.name}
            isContractLegalTermsAccepted={isContractLegalTermsAccepted}
            billingStartDate={billingStartDate}
            setBillingStartDate={setBillingStartDate}
            handleAcceptContract={handleAcceptContract}
            onOpenContractTermsDialog={onOpenContractTermsDialog}
          />

          <MarketplaceContractPaymentPricing
            contract={contract}
            billingStartDate={billingStartDate}
            isExcludingTax={isExcludingTax}
            voucher={voucher}
          />

          <div className="bs-contract-payment__pricing">
            <MarketplaceContractPaymentCoupon
              voucher={voucher}
              couponCode={couponCode}
              isLoading={isLoading}
              isContractLegalTermsAccepted={isContractLegalTermsAccepted}
              isCouponFormOpen={isCouponFormOpen}
              onOpenCouponForm={handleOpenCouponForm}
              onDeleteCoupon={handleDeleteCoupon}
              onCancelCouponForm={handleCloseCouponForm}
              onSubmitCouponForm={handleApplyCoupon}
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
                    name="payment-method-card"
                    value={MarketplacePaymentMethods.card}
                    label={t('subscription:paymentMethod.card')}
                    isChecked={paymentMethod === MarketplacePaymentMethods.card}
                    disabled={!isContractLegalTermsAccepted}
                    onClick={handleSetPaymentMethod}
                  />
                )}
                {getIsPaymentMethodAvailable(
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
                  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
                ) && (
                  <Radio
                    className="bs-contract-payment__payment__method__option"
                    name="payment-method-bacs_debit"
                    value={MarketplacePaymentMethods.bacs}
                    label={t('subscription:paymentMethod.bacs_debit')}
                    isChecked={paymentMethod === MarketplacePaymentMethods.bacs}
                    disabled={!isContractLegalTermsAccepted}
                    onClick={handleSetPaymentMethod}
                  />
                )}
                {getIsPaymentMethodAvailable(
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
                  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
                ) &&
                  isCurrencyEuro && (
                    <Radio
                      className="bs-contract-payment__payment__method__option"
                      name="payment-method-sepa_debit"
                      value={MarketplacePaymentMethods.sepa}
                      label={t('subscription:paymentMethod.sepa')}
                      isChecked={
                        paymentMethod === MarketplacePaymentMethods.sepa
                      }
                      disabled={!isContractLegalTermsAccepted}
                      onClick={handleSetPaymentMethod}
                    />
                  )}
              </div>
            )}
          </div>

          {isDisplayPaymentMethodList && (
            <div className="bs-contract-payment__payment__methods">
              <MarketplaceContractPaymentMethodList
                isContractLegalTermsAccepted={isContractLegalTermsAccepted}
                paymentMethods={filteredSavedPaymentMethodList}
                selectedPaymentMethod={selectedSavedPaymentMethodId}
                paymentMethodType={paymentMethod}
                onDetachPaymentMethod={handleDetachPaymentMethod}
                onSelectPaymentMethod={handleSelectPaymentMethod}
              />

              <button
                type="button"
                className="bs-contract-payment__payment__methods__add"
                onClick={handleOpenCollectPaymentMethodDialog}
              >
                <AddIcon />
                {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
              </button>

              <MarketplaceCollectPaymentMethod
                type={paymentMethod}
                isOpen={collectPaymentMethodIsOpen}
                sepaDefaultName={sepaDefaultName}
                sepaDefaultEmail={sepaDefaultEmail}
                requestSetupIntentSecret={requestSetupIntentSecret}
                onSuccess={handleSubmitCollectPaymentMethod}
                onCancel={handleCloseCollectPaymentMethodDialog}
              />
            </div>
          )}

          <div className="bs-contract-payment__actions">
            <button
              type="button"
              className="bs-contract-payment__cancel__button"
              onClick={onCancelContractPayment}
            >
              {t('common:cancel')}
            </button>
            <button
              disabled={
                !isContractLegalTermsAccepted ||
                isLoading ||
                !selectedSavedPaymentMethodId
              }
              type="submit"
              className="bs-contract-payment__submit__button"
            >
              {isLoading ? (
                <CircularProgress size="sm" contrastStrokeColor />
              ) : (
                t('checkout:myBasket.actions.checkoutBasket')
              )}
            </button>
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
