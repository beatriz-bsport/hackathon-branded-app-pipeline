import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

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
import AddIcon from '@material-ui/icons/Add';

import InfoIcon from '@material-ui/icons/Info';
import type { AxiosResponse } from 'axios';
import { OptionCallback } from '../../../../../state/types';
import Tooltip from '#components/Tooltip.component';
import { MAP_MARKETPLACE_PAYMENT_METHOD_TO_IDENTIFIER } from '#libs/marketplace/constants';
import {
  MarketplacePaymentMethods,
  MarketplacePaymentMethodBillingDetails,
} from '#libs/marketplace/types';
import { getBillingDetailsDefaultValue } from '#libs/checkout/utils';
import { PaymentMethod } from '#libs/payment/types';
import { getCurrencyCode } from '#libs/theme/selectors';
import { PaymentMethodCardSelector } from '#libs/payment/components/PaymentMethodCardSelector.component';
import MarketplaceContractPaymentMethodList from '#libs/marketplace/components/MarketplaceContractPaymentMethodList';
import MarketplaceCollectPaymentMethod from '#libs/marketplace/components/MarketplaceCollectPaymentMethod';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import './SubscriptionPaymentStyle.css';

const MAP_IDENTIFIER_TO_MARKETPLACE_PAYMENT_METHOD = Object.fromEntries(
  Object.entries(MAP_MARKETPLACE_PAYMENT_METHOD_TO_IDENTIFIER).map(
    ([key, value]) => [value, key],
  ),
);

export type Props = {
  enabledPaymentMethodsIds: number[];
  enabledPaymentGroupMethodIdentifierIds: number[];
  savedPaymentMethodList: PaymentMethod[];
  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  onlinePaymentEnabled?: boolean;
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  refreshSavedPaymentMethodList: () => void;
  selectedSavedPaymentMethodId: string | null;
  setSelectedSavedPaymentMethodId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  paymentMethodLoading: boolean;
};

const MarketplaceSubscriptionPayment: React.FC<Props> = ({
  enabledPaymentMethodsIds,
  enabledPaymentGroupMethodIdentifierIds,
  savedPaymentMethodList,
  sepaDefaultName,
  sepaDefaultEmail,
  onlinePaymentEnabled,
  detachPaymentMethod,
  requestSetupIntentSecret,
  refreshSavedPaymentMethodList,
  selectedSavedPaymentMethodId,
  setSelectedSavedPaymentMethodId,
  paymentMethodLoading,
}) => {
  const { t } = useTranslation(['subscription', 'payment']);

  const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
    useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<MarketplacePaymentMethods | null>(null);

  const [billingDetails, setBillingDetails] =
    useState<MarketplacePaymentMethodBillingDetails>(
      getBillingDetailsDefaultValue(sepaDefaultName, sepaDefaultEmail),
    );

  useEffect(() => {
    /**
     * If no payment method is provided, the payment method type is initialized.
     * If SEPA is one of the available payment methods for subscription
     * or the available payment method for the marketplace, it will be used.
     */
    if (!paymentMethod && !paymentMethodLoading) {
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
      if (
        selectedPaymentMethodList?.length &&
        selectedSavedPaymentMethodId === null
      ) {
        setSelectedSavedPaymentMethodId(selectedPaymentMethodList[0].id);
      }
    }
  }, [
    enabledPaymentGroupMethodIdentifierIds,
    enabledPaymentMethodsIds,
    paymentMethod,
    savedPaymentMethodList,
    savedPaymentMethodList?.length,
    setSelectedSavedPaymentMethodId,
    selectedSavedPaymentMethodId,
    paymentMethodLoading,
  ]);

  const getIsPaymentMethodAvailable = useCallback(
    (paymentMethodIdentifier: number, paymentGroupMethodIdentifier: number) => {
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

  const handleSetPaymentMethod = useCallback(
    (value: number) => {
      setPaymentMethod(
        MAP_IDENTIFIER_TO_MARKETPLACE_PAYMENT_METHOD[
          value
        ] as MarketplacePaymentMethods,
      );

      setSelectedSavedPaymentMethodId(null);
    },
    [setSelectedSavedPaymentMethodId],
  );

  const isCurrencyEuro = useMemo(
    () => getCurrencyCode().toLowerCase() === 'eur',
    [],
  );

  const paymentMethodChoices = useMemo(
    () =>
      [
        [
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
          PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
        ],
        [
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_BACS_DEBIT,
          PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
        ],
        [
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
          PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
        ],
      ]
        .filter(
          ([bpm, pgm]) =>
            getIsPaymentMethodAvailable(bpm, pgm) &&
            (pgm === PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA
              ? isCurrencyEuro
              : true),
        )
        .map((pm) => pm[1]),
    [isCurrencyEuro, getIsPaymentMethodAvailable],
  );

  const shouldDisplayPaymentMethodList = useMemo(
    () =>
      (paymentMethodLoading ||
        [
          MarketplacePaymentMethods.card,
          MarketplacePaymentMethods.sepa,
          MarketplacePaymentMethods.bacs,
        ].includes(paymentMethod)) &&
      onlinePaymentEnabled !== false,
    [onlinePaymentEnabled, paymentMethod, paymentMethodLoading],
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

  const handleDetachPaymentMethod = useCallback(
    (id: string) => {
      detachPaymentMethod(id, {
        onSuccess: () => setSelectedSavedPaymentMethodId(null),
      });
    },
    [detachPaymentMethod, setSelectedSavedPaymentMethodId],
  );

  const handleSelectPaymentMethod = useCallback(
    (id: string) => setSelectedSavedPaymentMethodId(id),
    [setSelectedSavedPaymentMethodId],
  );

  const handleOpenCollectPaymentMethod = useCallback(() => {
    setCollectPaymentMethodIsOpen(true);
  }, []);

  const handleSubmitCollectPaymentMethod = useCallback(() => {
    if (refreshSavedPaymentMethodList) {
      refreshSavedPaymentMethodList();
    }
  }, [refreshSavedPaymentMethodList]);

  const handleCloseCollectPaymentMethodDialog = useCallback(() => {
    setCollectPaymentMethodIsOpen(false);
  }, []);

  return (
    <div className="bs-contract-payment__payment__methods__container">
      {(enabledPaymentMethodsIds?.length > 1 ||
        enabledPaymentGroupMethodIdentifierIds?.length > 1) && (
        <div>
          <PaymentMethodCardSelector
            paymentMethodChoices={paymentMethodChoices}
            paymentMethodSelected={
              // @ts-expect-error
              MAP_MARKETPLACE_PAYMENT_METHOD_TO_IDENTIFIER[`${paymentMethod}`]
            }
            selectPaymentMethod={handleSetPaymentMethod}
          />
        </div>
      )}
      <div className="bs-contract-payment__payment__details-title">
        {t('subscription:newCheckout.payment.details')}

        <Tooltip title={t('subscription:newCheckout.payment.tooltip')}>
          <div className="bs-contract-payment__payment__details-icon-container">
            <InfoIcon className="bs-contract-payment__payment__details-icon" />
          </div>
        </Tooltip>
      </div>
      {shouldDisplayPaymentMethodList && (
        <div className="bs-contract-payment__payment__details">
          <MarketplaceContractPaymentMethodList
            isContractLegalTermsAccepted
            onDetachPaymentMethod={handleDetachPaymentMethod}
            onSelectPaymentMethod={handleSelectPaymentMethod}
            paymentMethodLoading={paymentMethodLoading}
            paymentMethods={filteredSavedPaymentMethodList}
            paymentMethodType={paymentMethod}
            selectedPaymentMethod={selectedSavedPaymentMethodId}
          />

          {(filteredSavedPaymentMethodList?.length > 0 ||
            collectPaymentMethodIsOpen) && (
            <button
              className={classNames(
                'bs-contract-payment__payment__methods__add',
                {
                  'bs-contract-payment__payment_methods__add--disabled':
                    collectPaymentMethodIsOpen,
                },
              )}
              disabled={collectPaymentMethodIsOpen}
              onClick={handleOpenCollectPaymentMethod}
              type="button"
            >
              <AddIcon />
              {t('payment:forms.paymentMethod.actions.addPaymentMethod')}
            </button>
          )}
        </div>
      )}
      <MarketplaceCollectPaymentMethod
        doNotOpenInDialog
        // DIRTY DISABLE FOR BILLING DETAILS
        // THIS NEEDS A PROPER REFACTOR
        billingDetails={billingDetails}
        cardBillingDetailsMandatory={false}
        hideCancelButton={filteredSavedPaymentMethodList?.length === 0}
        isOpen={
          (collectPaymentMethodIsOpen ||
            filteredSavedPaymentMethodList?.length === 0) &&
          !!paymentMethod &&
          !paymentMethodLoading
        }
        onCancel={handleCloseCollectPaymentMethodDialog}
        onSuccess={handleSubmitCollectPaymentMethod}
        paymentMethodLoading={paymentMethodLoading}
        // @ts-expect-error
        requestSetupIntentSecret={requestSetupIntentSecret}
        sepaDefaultEmail={sepaDefaultEmail}
        sepaDefaultName={sepaDefaultName}
        setBillingDetails={setBillingDetails}
        type={paymentMethod}
      />
    </div>
  );
};

export const MarketplaceSubscriptionPaymentForStorybook = marketplaceCssHoc()(
  MarketplaceSubscriptionPayment,
);

export default MarketplaceSubscriptionPayment;
