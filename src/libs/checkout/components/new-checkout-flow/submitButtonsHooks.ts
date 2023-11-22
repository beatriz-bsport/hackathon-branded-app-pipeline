import React, { useMemo } from 'react';
import { STEPS, SUBMIT_BUTTONS } from '../../types';

export type UseSubmitButtonsDisplayableStateProps = {
  currentStepId: number;
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
};

export type UseSubmitButtonsDisabledStateProps = {
  currentStepId: number;
  paymentProcessing: boolean;
  basketLoading: boolean;
  isOnlinePaymentDisabled: boolean;
  termsAndConditionsAccepted: boolean;
  isEstablishmentBillingGroupSelected: boolean;
};

export type UseSubmitButtonsProcessingStateProps = {
  paymentProcessing: boolean;
  lastSubmitButtonClicked: number | null;
};

export type UseHandleSubmitButtonsCallbacksProps = {
  checkoutStepsRef: React.MutableRefObject<any>;
  setLastSubmitButtonClicked: React.Dispatch<
    React.SetStateAction<null | number>
  >;
};

export const useSubmitButtonsDisplayableState = ({
  currentStepId,
  isOnlinePaymentAvailable,
  isPayLaterAvailable,
  isTotalPriceNull,
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
            isOnlinePaymentAvailable &&
            !isTotalPriceNull
          )
            submitButtonsDisplayable[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          if (
            currentStepId === STEPS.PAYMENT_STEP.id &&
            isPayLaterAvailable &&
            !isTotalPriceNull
          )
            submitButtonsDisplayable[button.id] = true;
          break;
        case SUBMIT_BUTTONS.CONFIRM_BUTTON.id:
          if (isTotalPriceNull) submitButtonsDisplayable[button.id] = true;
          break;
        default:
          break;
      }
    });
    return submitButtonsDisplayable;
  }, [
    currentStepId,
    isOnlinePaymentAvailable,
    isPayLaterAvailable,
    isTotalPriceNull,
  ]);

export const useSubmitButtonsDisabledState = ({
  basketLoading,
  paymentProcessing,
  currentStepId,
  isOnlinePaymentDisabled,
  termsAndConditionsAccepted,
  isEstablishmentBillingGroupSelected,
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
            paymentProcessing ||
            isOnlinePaymentDisabled ||
            !termsAndConditionsAccepted ||
            !isEstablishmentBillingGroupSelected
          )
            submitButtonsDisabled[button.id] = true;
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
        case SUBMIT_BUTTONS.CONFIRM_BUTTON.id:
          if (
            basketLoading ||
            paymentProcessing ||
            !termsAndConditionsAccepted ||
            !isEstablishmentBillingGroupSelected
          )
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
    termsAndConditionsAccepted,
    paymentProcessing,
    isEstablishmentBillingGroupSelected,
  ]);

export const useSubmitButtonsProcessingState = ({
  paymentProcessing,
  lastSubmitButtonClicked,
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
        case SUBMIT_BUTTONS.CONFIRM_BUTTON.id:
          if (paymentProcessing)
            submitButtonsProcessing[button.id] =
              button.id === lastSubmitButtonClicked;
          break;
        default:
          break;
      }
    });
    return submitButtonsProcessing;
  }, [paymentProcessing, lastSubmitButtonClicked]);

export const useHandleSubmitButtonsCallbacks = ({
  checkoutStepsRef,
  setLastSubmitButtonClicked,
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
        case SUBMIT_BUTTONS.CONFIRM_BUTTON.id:
          // The `onSubmit` method defined in the `CheckoutSteps` component will handle the submit for
          // the `ADDRESS_STEP` or the `PAYMENT_STEP`, according to the `currentStep` provided to him.
          submitButtonsCallbacks[button.id] = async (
            event: React.FormEvent<HTMLFormElement>,
          ) => {
            checkoutStepsRef.current.updateMemberDefaultEstablishmentBillingGroup();
            checkoutStepsRef.current.onSubmit(event);

            setLastSubmitButtonClicked(button.id);
          };
          break;
        case SUBMIT_BUTTONS.PAY_LATER_BUTTON.id:
          submitButtonsCallbacks[button.id] = async () => {
            checkoutStepsRef.current.onPayLaterSubmit();
            setLastSubmitButtonClicked(button.id);
          };
          break;
        default:
          break;
      }
    });
    return submitButtonsCallbacks;
  }, [checkoutStepsRef, setLastSubmitButtonClicked]);
