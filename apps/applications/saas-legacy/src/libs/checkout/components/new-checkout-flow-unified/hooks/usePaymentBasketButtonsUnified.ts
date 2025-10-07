import React, { useMemo, useState } from 'react';

import {
  PAYMENT_ENGINE_PAYPAL,
  PAYMENT_ENGINE_STRIPE,
} from '@bsport/common/lib/master-data/payment-group.js';
import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';

import { STEPS, type StepType, SUBMIT_BUTTONS } from '#src/libs/checkout/types';

import { useBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasket';
import { useBasketPaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentStatusTracker';
import { useBasketPaymentActions } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentActions';
import { useBasketPaymentContext } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import { useCompanyPaymentSettings } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useCompanyPaymentSettings';
import { usePayment } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePayment';

type GetButtonConditionsParams = {
  currentStepId: number;
  isOnlinePaymentAvailable: boolean;
  paymentEngine: number;
  isTotalPriceNull: boolean;
  isPayLaterAvailable: boolean;
};

type GetButtonsDisabledStatusParams = {
  currentStepId: number;
  isBasketLoading: boolean;
  isCurrentBasketProcessing: boolean;
  isPaymentProcessing: boolean;
  isOnlinePaymentDisabled: boolean;
  isEstablishmentBillingGroupSelected: boolean;
  isAddressSubmitting: boolean;
  hasPaymentSucceeded?: boolean;
  isExpressPayLoading?: boolean;
};

export type SubmitButtonId =
  (typeof SUBMIT_BUTTONS)[keyof typeof SUBMIT_BUTTONS]['id'];

export type UseSubmitButtonsProps = {
  paymentBasketRef: React.MutableRefObject<any>;
  // The ids we need to retrieve data from useBasket and  useBasketPaymentStatusTracker
  paymentContext: {
    basketId: string;
    memberId: number;
    companyId: number;
  };
  /**  We need this props to control which buttons can be displayed.
   * For example, we don't want the pay later button in the one click checkout.
   * If we don't pass anything, all buttons could be displayed.
   */
  submitButtons?: Partial<typeof SUBMIT_BUTTONS>;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
};

type Callbacks = {
  createOrder?: () => Promise<string>;
  onApprove?: () => Promise<void>;
  onError?: () => Promise<void>;
  onCancel?: () => Promise<void>;
  onClick?: (event?: React.MouseEvent<HTMLElement>) => Promise<void>;
};

type ButtonsConfiguration = {
  button: (typeof SUBMIT_BUTTONS)[keyof typeof SUBMIT_BUTTONS];
  isDisabled: boolean;
  isProcessing: boolean;
  callbacks: Callbacks;
}[];

const getVisibleButtons = ({
  currentStepId,
  isOnlinePaymentAvailable,
  paymentEngine,
  isTotalPriceNull,
  isPayLaterAvailable,
}: GetButtonConditionsParams) => ({
  [SUBMIT_BUTTONS.NEXT_BUTTON.id]: currentStepId === STEPS.ADDRESS_STEP.id,
  [SUBMIT_BUTTONS.PAY_NOW_BUTTON.id]:
    currentStepId === STEPS.PAYMENT_STEP.id &&
    isOnlinePaymentAvailable &&
    paymentEngine === PAYMENT_ENGINE_STRIPE &&
    !isTotalPriceNull,
  [SUBMIT_BUTTONS.PAYPAL_BUTTON.id]:
    currentStepId === STEPS.PAYMENT_STEP.id &&
    isOnlinePaymentAvailable &&
    paymentEngine === PAYMENT_ENGINE_PAYPAL &&
    !isTotalPriceNull,
  [SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]:
    currentStepId === STEPS.PAYMENT_STEP.id &&
    isPayLaterAvailable &&
    !isTotalPriceNull,
  [SUBMIT_BUTTONS.CONFIRM_BUTTON.id]: isTotalPriceNull,
});

const getButtonsDisabledStatus = ({
  isBasketLoading,
  isCurrentBasketProcessing,
  currentStepId,
  isEstablishmentBillingGroupSelected,
  isOnlinePaymentDisabled,
  isPaymentProcessing,
  isAddressSubmitting,
  hasPaymentSucceeded,
  isExpressPayLoading,
}: GetButtonsDisabledStatusParams) => {
  const baseDisabled =
    isBasketLoading ||
    isPaymentProcessing ||
    isCurrentBasketProcessing ||
    hasPaymentSucceeded ||
    !isEstablishmentBillingGroupSelected ||
    isExpressPayLoading;

  return {
    [SUBMIT_BUTTONS.NEXT_BUTTON.id]:
      currentStepId === STEPS.ADDRESS_STEP.id &&
      (isBasketLoading || isAddressSubmitting),
    [SUBMIT_BUTTONS.PAY_NOW_BUTTON.id]: baseDisabled || isOnlinePaymentDisabled,
    [SUBMIT_BUTTONS.PAYPAL_BUTTON.id]: baseDisabled || isOnlinePaymentDisabled,
    [SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]: baseDisabled,
    [SUBMIT_BUTTONS.CONFIRM_BUTTON.id]: baseDisabled,
  };
};

export const usePaymentBasketButtonsUnified = ({
  paymentContext,
  paymentBasketRef,
  submitButtons,
  onConfirmPaymentSuccess,
}: UseSubmitButtonsProps) => {
  const { basketId, companyId, memberId } = paymentContext ?? {};

  const [lastSubmitButtonClicked, setLastSubmitButtonClicked] =
    useState<SubmitButtonId | null>(null);

  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

  const {
    isBasketLoading,
    isCurrentBasketProcessing,
    basketTotalPriceCts,
    basketTotalPricePrepaidLinesCts,
    availablePaymentMethods,
    needAddress,
    submitUnpaidBasket,
  } = useBasket(basketId, companyId, memberId);

  const {
    instalmentPaymentSelectedId,
    isEstablishmentBillingGroupSelected,
    isExpressPayLoading,
    selectedEstablishmentBillingGroup,
  } = useBasketPaymentContext();

  const { isPaymentProcessing, hasPaymentSucceeded } =
    useBasketPaymentStatusTracker(basketId, memberId);

  const { handleAssignInstalmentPayment } = useBasketPaymentActions(
    basketId,
    companyId,
    memberId,
  );

  const { handleUpdateMemberBillingGroup } = usePayment(
    basketId,
    companyId,
    memberId,
  );

  const { establishmentBillingGroups } = useCompanyPaymentSettings(companyId);

  const steps: StepType[] = useMemo(
    () =>
      needAddress
        ? [STEPS.ADDRESS_STEP, STEPS.PAYMENT_STEP]
        : [STEPS.PAYMENT_STEP],
    [needAddress],
  );

  const [currentStep, setCurrentStep] = React.useState<StepType>(steps[0]);

  React.useEffect(() => {
    if (!steps.map((step) => step.id).includes(currentStep.id))
      setCurrentStep(steps[0]);
  }, [currentStep, steps]);

  const buttonsConfiguration: ButtonsConfiguration = [];

  /** The data we'll use to build the button configuration.
   *  Exposed by paymentBasketRef, hooks or declared directly in this hook (local states)
   **/
  const paymentEngine = paymentBasketRef?.current?.paymentEngine;

  const isOnlinePaymentDisabled =
    paymentBasketRef?.current?.isOnlinePaymentDisabled;

  const isTotalPriceNull = !(
    (basketTotalPriceCts || 0) - (basketTotalPricePrepaidLinesCts || 0)
  );

  const isOnlinePaymentAvailable = availablePaymentMethods?.includes(CB.id);

  const isPayLaterAvailable = availablePaymentMethods?.includes(
    CREDIT_ACCOUNT.id,
  );

  const isEstablishmentBillingGroupSelectedOrNotRequired =
    isEstablishmentBillingGroupSelected ||
    establishmentBillingGroups.length === 0;

  const visibleButtons = getVisibleButtons({
    currentStepId: currentStep.id,
    isOnlinePaymentAvailable,
    isPayLaterAvailable,
    isTotalPriceNull,
    paymentEngine,
  });

  const disabledButtons = getButtonsDisabledStatus({
    isBasketLoading,
    isCurrentBasketProcessing,
    currentStepId: currentStep.id,
    isEstablishmentBillingGroupSelected:
      isEstablishmentBillingGroupSelectedOrNotRequired,
    isOnlinePaymentDisabled,
    isPaymentProcessing,
    isAddressSubmitting,
    hasPaymentSucceeded,
    isExpressPayLoading,
  });

  const BUTTON_ORDER = [
    SUBMIT_BUTTONS.NEXT_BUTTON.id,
    SUBMIT_BUTTONS.PAY_NOW_BUTTON.id,
    SUBMIT_BUTTONS.CONFIRM_BUTTON.id,
    SUBMIT_BUTTONS.PAYPAL_BUTTON.id,
    SUBMIT_BUTTONS.PAY_LATER_BUTTON.id,
  ];

  BUTTON_ORDER.forEach((buttonId) => {
    const button = Object.values(submitButtons ?? SUBMIT_BUTTONS).find(
      (btn) => btn.id === buttonId,
    );
    if (button && visibleButtons[button.id]) {
      const isDisabled = !!disabledButtons[button.id];

      const isProcessing =
        (isPaymentProcessing ||
          isCurrentBasketProcessing ||
          hasPaymentSucceeded) &&
        button.id === lastSubmitButtonClicked;

      const handleClick = async (event?: React.MouseEvent<HTMLElement>) => {
        if (selectedEstablishmentBillingGroup?.id)
          handleUpdateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
        setLastSubmitButtonClicked(button.id);
        if (button.id === SUBMIT_BUTTONS.PAY_LATER_BUTTON.id) {
          paymentBasketRef.current?.onPayLaterSubmit();
        } else if (button.id === SUBMIT_BUTTONS.NEXT_BUTTON.id) {
          setIsAddressSubmitting(true);
          paymentBasketRef.current?.onAddressSubmit({
            onSuccess: () => {
              setCurrentStep(STEPS.PAYMENT_STEP);
              setIsAddressSubmitting(false);
            },
            onError: () => setIsAddressSubmitting(false),
          });
        } else if (button.id === SUBMIT_BUTTONS.CONFIRM_BUTTON.id) {
          submitUnpaidBasket({ onSuccess: () => onConfirmPaymentSuccess() });
        } else {
          handleAssignInstalmentPayment(instalmentPaymentSelectedId, {
            onSuccess: () => paymentBasketRef.current?.onPaymentConfirm(event),
          });
        }
      };

      const callbacks: Callbacks =
        button.id === SUBMIT_BUTTONS.PAYPAL_BUTTON.id
          ? {
              createOrder: async () => {
                if (selectedEstablishmentBillingGroup?.id)
                  handleUpdateMemberBillingGroup(
                    selectedEstablishmentBillingGroup.id,
                  );
                setLastSubmitButtonClicked(button.id);
                return paymentBasketRef.current?.onPayPalCreateOrder();
              },
              onApprove: async () => {
                paymentBasketRef.current?.onPayPalApprove();
                setLastSubmitButtonClicked(button.id);
              },
              onError: async () => {
                paymentBasketRef.current?.onPayPalError();
                setLastSubmitButtonClicked(button.id);
              },
              onCancel: async () => {
                paymentBasketRef.current?.onPayPalCancel();
                setLastSubmitButtonClicked(button.id);
              },
            }
          : {
              onClick: handleClick,
            };

      buttonsConfiguration.push({
        button,
        isDisabled,
        isProcessing,
        callbacks,
      });
    }
  });

  return buttonsConfiguration;
};
