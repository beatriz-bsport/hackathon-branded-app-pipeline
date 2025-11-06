import React, { forwardRef, useImperativeHandle } from 'react';
import { ImmutableArray } from 'seamless-immutable';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { getTheme } from '#src/libs/theme/selectors';

import type { OptionCallback } from 'src/state/types';
import type {
  BasketDeliveryFormRef,
  CheckoutStepsRef,
  OnlinePaymentBasketRef,
} from './types';

import {
  type Basket,
  type BasketAddress,
  type PrepaidLine,
  STEPS,
  type StepType,
} from '#src/libs/checkout/types';

import { useBasketPaymentContext } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import { useBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasket';
import BasketDeliveryFormUnified from '#src/libs/checkout/components/new-checkout-flow-unified/BasketDeliveryFormUnified.component';
import { BasketNullPriceUnified } from './BasketNullPriceUnified.component';
import { OnlinePaymentBasketUnified } from './OnlinePaymentBasketUnified.component';

type CheckoutStepsProps = {
  basket: Basket<string, PrepaidLine>;
  basketHasOffers: boolean;
  companyCountry?: string;
  companyId: number;
  currentStep: StepType;
  displayedAmountToPayCts: number;
  displayedAmountToPayPrepaidLinesCts?: number;
  enableMultiLocalization: boolean;
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  setCurrentStep: (step: StepType) => void;
  steps: ImmutableArray<StepType>;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  ref: React.Ref<CheckoutStepsRef>;
};

export const CheckoutStepsUnified: React.FC<CheckoutStepsProps> = forwardRef(
  (
    {
      basket,
      basketHasOffers,
      companyCountry,
      companyId,
      currentStep,
      displayedAmountToPayCts,
      displayedAmountToPayPrepaidLinesCts,
      enableMultiLocalization,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onConfirmPaymentSuccess,
      patchBasket,
      setCurrentStep,
      steps,
      updateMemberBillingGroup,
    },
    ref,
  ) => {
    const companyTheme = useSelector(getTheme);
    const { t } = useTranslation('checkout');

    const basketDeliveryRef = React.useRef<BasketDeliveryFormRef>(null);
    const paymentStepRef = React.useRef<OnlinePaymentBasketRef>(null);
    const classes = useStyles();

    const { selectedEstablishmentBillingGroup } = useBasketPaymentContext();
    const { submitUnpaidBasket } = useBasket(
      basket.id,
      companyId,
      basket.member,
    );

    const handlePayLaterSubmit = React.useCallback(() => {
      submitUnpaidBasket({ onSuccess: () => onConfirmPaymentSuccess() });
    }, [submitUnpaidBasket, onConfirmPaymentSuccess]);

    useImperativeHandle(ref, () => ({
      updateMemberDefaultEstablishmentBillingGroup() {
        if (selectedEstablishmentBillingGroup) {
          updateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
        }
      },
      onAddressSubmit: (options?: { onSuccess?: () => void }) =>
        basketDeliveryRef.current?.onAddressSubmit(options),
      onPaymentConfirm: paymentStepRef.current?.onPaymentConfirm,
      onPayLaterSubmit:
        paymentStepRef.current?.onPayLaterSubmit || handlePayLaterSubmit,
      onPayPalCreateOrder: paymentStepRef.current?.onPayPalCreateOrder,
      onPayPalApprove: paymentStepRef.current?.onPayPalApprove,
      onPayPalCancel: paymentStepRef.current?.onPayPalCancel,
      onPayPalError: paymentStepRef.current?.onPayPalError,
      paymentEngine: paymentStepRef.current?.paymentEngine,
      isOnlinePaymentDisabled: paymentStepRef.current?.isOnlinePaymentDisabled,
    }));

    const handleBasketDeliverySubmit = React.useCallback(
      (basketAddress, options) =>
        patchBasket(basketAddress, {
          onSuccess: () => {
            setCurrentStep(STEPS.PAYMENT_STEP);
            options?.onSuccess?.();
          },
          onError: () => options?.onError?.(),
        }),
      [patchBasket, setCurrentStep],
    );

    const renderStep = React.useCallback(() => {
      switch (currentStep.id) {
        case STEPS.ADDRESS_STEP.id:
          return (
            <BasketDeliveryFormUnified
              ref={basketDeliveryRef}
              basket={basket}
              companyCountry={companyCountry ?? ''}
              onSubmit={handleBasketDeliverySubmit}
            />
          );
        case STEPS.PAYMENT_STEP.id:
        default:
          if (
            isTotalPriceNull ||
            (isPayLaterAvailable && !isOnlinePaymentAvailable)
          )
            return (
              <BasketNullPriceUnified
                basketHasOffers={basketHasOffers}
                companyId={companyId}
                enableMultiLocalization={enableMultiLocalization}
              />
            );

          const shouldDisplayOnlinePayment =
            !!basket?.id && !!basket?.total_price_cts;

          return isOnlinePaymentAvailable && shouldDisplayOnlinePayment ? (
            <OnlinePaymentBasketUnified
              ref={paymentStepRef}
              hideConfirmPaymentButton
              showAcceptTermsAndConditions
              basketId={basket.id}
              companyId={companyId}
              displayedAmountToPayCts={displayedAmountToPayCts}
              displayedAmountToPayPrepaidLinesCts={
                displayedAmountToPayPrepaidLinesCts
              }
              onConfirmPaymentSuccess={onConfirmPaymentSuccess}
              payerContext={{ memberId: basket.member }}
              stripePaymentElementConfig={{
                isDefaultForRegion: companyTheme.is_default_for_region,
                stripeId: companyTheme.stripe_id,
              }}
            />
          ) : null;
      }
    }, [
      basket,
      basketHasOffers,
      companyCountry,
      companyId,
      companyTheme.is_default_for_region,
      companyTheme.stripe_id,
      currentStep.id,
      enableMultiLocalization,
      handleBasketDeliverySubmit,
      displayedAmountToPayCts,
      displayedAmountToPayPrepaidLinesCts,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onConfirmPaymentSuccess,
      paymentStepRef,
    ]);

    return (
      <div className={classes.paymentStepsContainer}>
        {steps.length > 1 && (
          <Stepper alternativeLabel activeStep={currentStep.id}>
            {steps.map((step) => (
              <Step key={step.id}>
                <StepLabel>
                  {t(`myBasket.finalize.steps.${step.label}`)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        {renderStep()}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  paymentStepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
}));
