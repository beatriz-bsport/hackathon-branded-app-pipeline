import React, { useMemo, useState } from 'react';
import {
  PAYMENT_ENGINE_PAYPAL,
  PAYMENT_ENGINE_STRIPE,
} from '@bsport/common/lib/master-data/payment-group.js';
import { STEPS, SUBMIT_BUTTONS, StepType } from '#src/libs/checkout/types';
import { useBasket } from './useBasket';
import { useBasketPaymentStatusTracker } from './useBasketPaymentStatusTracker';
import {
  CB,
  CREDIT_ACCOUNT,
} from '@bsport/common/lib/master-data/payment-methods';
import { usePayment } from './usePayment';

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
  isPaymentProcessing: boolean;
  isOnlinePaymentDisabled: boolean;
  isEstablishmentBillingGroupSelected: boolean;
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
   * If we don't pass anything, every buttons could be displayed.
   */
  submitButtons?: Partial<typeof SUBMIT_BUTTONS>;
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
  currentStepId,
  isEstablishmentBillingGroupSelected,
  isOnlinePaymentDisabled,
  isPaymentProcessing,
}: GetButtonsDisabledStatusParams) => ({
  [SUBMIT_BUTTONS.NEXT_BUTTON.id]:
    currentStepId === STEPS.ADDRESS_STEP.id && isBasketLoading,
  [SUBMIT_BUTTONS.PAY_NOW_BUTTON.id]:
    isBasketLoading ||
    isPaymentProcessing ||
    isOnlinePaymentDisabled ||
    !isEstablishmentBillingGroupSelected,
  [SUBMIT_BUTTONS.PAYPAL_BUTTON.id]:
    isBasketLoading ||
    isPaymentProcessing ||
    isOnlinePaymentDisabled ||
    !isEstablishmentBillingGroupSelected,
  [SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]:
    isBasketLoading ||
    isPaymentProcessing ||
    !isEstablishmentBillingGroupSelected,
  [SUBMIT_BUTTONS.CONFIRM_BUTTON.id]:
    isBasketLoading ||
    isPaymentProcessing ||
    !isEstablishmentBillingGroupSelected,
});

export const usePaymentBasketButtons = ({
  paymentContext,
  paymentBasketRef,
  submitButtons,
}: UseSubmitButtonsProps) => {
  const { basketId, companyId, memberId } = paymentContext ?? {};

  const [lastSubmitButtonClicked, setLastSubmitButtonClicked] =
    useState<SubmitButtonId | null>(null);

  const {
    isBasketLoading,
    basketTotalPriceCts,
    basketTotalPricePrepaidLinesCts,
    availablePaymentMethods,
    needAddress,
  } = useBasket(basketId, companyId, memberId);

  const { isPaymentProcessing } = useBasketPaymentStatusTracker(
    basketId,
    memberId,
  );

  const { handleUpdateMemberBillingGroup } = usePayment(
    basketId,
    companyId,
    memberId,
  );

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

  const isEstablishmentBillingGroupSelected =
    paymentBasketRef?.current?.isEstablishmentBillingGroupSelected;

  const selectedEstablishmentBillingGroup =
    paymentBasketRef?.current?.selectedEstablishmentBillingGroup;

  const isTotalPriceNull = !(
    (basketTotalPriceCts || 0) - (basketTotalPricePrepaidLinesCts || 0)
  );

  const isOnlinePaymentAvailable = availablePaymentMethods?.includes(CB.id);

  const isPayLaterAvailable = availablePaymentMethods?.includes(
    CREDIT_ACCOUNT.id,
  );

  const visibleButtons = getVisibleButtons({
    currentStepId: currentStep.id,
    isOnlinePaymentAvailable,
    isPayLaterAvailable,
    isTotalPriceNull,
    paymentEngine,
  });

  const disabledButtons = getButtonsDisabledStatus({
    isBasketLoading: isBasketLoading,
    currentStepId: currentStep.id,
    isEstablishmentBillingGroupSelected,
    isOnlinePaymentDisabled,
    isPaymentProcessing: isPaymentProcessing,
  });

  Object.values(submitButtons ?? SUBMIT_BUTTONS).forEach((button) => {
    if (visibleButtons[button.id]) {
      const isDisabled = disabledButtons[button.id];

      const isProcessing =
        isPaymentProcessing && button.id === lastSubmitButtonClicked;

      const handleClick = async (event?: React.MouseEvent<HTMLElement>) => {
        if (selectedEstablishmentBillingGroup?.id)
          handleUpdateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
        setLastSubmitButtonClicked(button.id);
        if (button.id === SUBMIT_BUTTONS.PAY_LATER_BUTTON.id) {
          paymentBasketRef.current.onPayLaterSubmit();
        } else {
          paymentBasketRef.current.onPaymentConfirm(event);
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
                return paymentBasketRef.current.onPayPalCreateOrder();
              },
              onApprove: async () => {
                paymentBasketRef.current.onPayPalApprove();
                setLastSubmitButtonClicked(button.id);
              },
              onError: async () => {
                paymentBasketRef.current.onPayPalError();
                setLastSubmitButtonClicked(button.id);
              },
              onCancel: async () => {
                paymentBasketRef.current.onPayPalCancel();
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
