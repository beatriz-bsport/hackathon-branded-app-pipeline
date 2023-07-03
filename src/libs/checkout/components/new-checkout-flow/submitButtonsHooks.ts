import React, { useMemo } from 'react';
import { STEPS, SUBMIT_BUTTONS } from '../../types';

export type UseSubmitButtonsDisplayableStateProps = {
  currentStepId: number;
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
};

export type UseSubmitButtonsDisabledStateProps = {
  currentStepId: number;
  basketLoading: boolean;
  isOnlinePaymentDisabled: boolean;
  isTotalPriceNull: boolean;
  termsAndConditionsAccepted: boolean;
};

export type UseSubmitButtonsProcessingStateProps = {
  paymentProcessing: boolean;
};

export type UseHandleSubmitButtonsCallbacksProps = {
  checkoutStepsRef: React.MutableRefObject<any>;
};

export const useSubmitButtonsDisplayableState = ({
  currentStepId,
  isOnlinePaymentAvailable,
  isPayLaterAvailable,
}: UseSubmitButtonsDisplayableStateProps): { [key: number]: boolean } =>
  useMemo(() => {
    const submitButtonsDisplayable: { [key: number]: boolean } = {};

    Object.values(SUBMIT_BUTTONS).forEach((button) => {
      submitButtonsDisplayable[button.id] = false;
      switch (button.id) {
        case SUBMIT_BUTTONS.NEXT_BUTTON.id:
          if (currentStepId === STEPS.ADDRESS_STEP.id)
            submitButtonsDisplayable[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_NOW_BUTTON.id:
          if (
            currentStepId === STEPS.PAYMENT_STEP.id &&
            isOnlinePaymentAvailable
          )
            submitButtonsDisplayable[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          if (currentStepId === STEPS.PAYMENT_STEP.id && isPayLaterAvailable)
            submitButtonsDisplayable[button.id] = true;
          break;
        default:
          break;
      }
    });
    return submitButtonsDisplayable;
  }, [currentStepId, isOnlinePaymentAvailable, isPayLaterAvailable]);

export const useSubmitButtonsDisabledState = ({
  basketLoading,
  currentStepId,
  isOnlinePaymentDisabled,
  isTotalPriceNull,
  termsAndConditionsAccepted,
}: UseSubmitButtonsDisabledStateProps): { [key: number]: boolean } =>
  useMemo(() => {
    const submitButtonsDisabled: { [key: number]: boolean } = {};

    Object.values(SUBMIT_BUTTONS).forEach((button) => {
      submitButtonsDisabled[button.id] = false;
      switch (button.id) {
        case SUBMIT_BUTTONS.NEXT_BUTTON.id:
          if (currentStepId === STEPS.ADDRESS_STEP.id && basketLoading)
            submitButtonsDisabled[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_NOW_BUTTON.id:
          if (
            basketLoading ||
            (!isTotalPriceNull && isOnlinePaymentDisabled) ||
            !termsAndConditionsAccepted
          )
            submitButtonsDisabled[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          if (basketLoading || !termsAndConditionsAccepted)
            submitButtonsDisabled[button.id] = true;
          break;
        default:
          break;
      }
    });
    return submitButtonsDisabled;
  }, [
    basketLoading,
    currentStepId,
    isOnlinePaymentDisabled,
    isTotalPriceNull,
    termsAndConditionsAccepted,
  ]);

export const useSubmitButtonsProcessingState = ({
  paymentProcessing,
}: UseSubmitButtonsProcessingStateProps): { [key: number]: boolean } =>
  useMemo(() => {
    const submitButtonsProcessing: { [key: number]: boolean } = {};

    Object.values(SUBMIT_BUTTONS).forEach((button) => {
      submitButtonsProcessing[button.id] = false;
      switch (button.id) {
        case SUBMIT_BUTTONS.NEXT_BUTTON.id:
          break;
        case SUBMIT_BUTTONS.PAY_NOW_BUTTON.id:
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          if (paymentProcessing) submitButtonsProcessing[button.id] = true;
          break;
        default:
          break;
      }
    });
    return submitButtonsProcessing;
  }, [paymentProcessing]);

export const useHandleSubmitButtonsCallbacks = ({
  checkoutStepsRef,
}: UseHandleSubmitButtonsCallbacksProps): {
  [key: number]: (event: React.MouseEvent<any>) => Promise<void>;
} =>
  useMemo(() => {
    const submitButtonsCallbacks: {
      [key: number]: (event: React.MouseEvent<any>) => Promise<void>;
    } = {};

    Object.values(SUBMIT_BUTTONS).forEach((button) => {
      submitButtonsCallbacks[button.id] = async () => {};
      switch (button.id) {
        case SUBMIT_BUTTONS.NEXT_BUTTON.id:
        case SUBMIT_BUTTONS.PAY_NOW_BUTTON.id:
          // The `onSubmit` method defined in the `CheckoutSteps` component will handle the submit for
          // the `ADDRESS_STEP` or the `PAYMENT_STEP`, according to the `currentStep` provided to him.
          submitButtonsCallbacks[button.id] = async (
            event: React.FormEvent<HTMLFormElement>,
          ) => {
            checkoutStepsRef.current.onSubmit(event);
          };
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          submitButtonsCallbacks[button.id] = async () => {
            checkoutStepsRef.current.onPayLaterSubmit();
          };
          break;
        default:
          break;
      }
    });
    return submitButtonsCallbacks;
  }, [checkoutStepsRef]);
