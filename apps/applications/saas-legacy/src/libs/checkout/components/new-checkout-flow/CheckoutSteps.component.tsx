import React, { forwardRef, useImperativeHandle } from 'react';
import { ImmutableArray } from 'seamless-immutable';
import { useTranslation } from 'react-i18next';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { OptionCallback } from 'src/state/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

import {
  type Basket,
  type BasketAddress,
  type PrepaidLine,
  STEPS,
  type StepType,
} from '#src/libs/checkout/types';

import BasketDeliveryForm from '#src/libs/checkout/components/BasketDeliveryForm.component';
import { PaymentStep } from './PaymentStep.component';

type CheckoutStepsProps = {
  basket: Basket<string, PrepaidLine>;
  basketHasOffers: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  companyCountry?: string;
  companyId: number;
  currentStep: StepType;
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
  onPaymentSuccess: () => void;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setCurrentStep: (step: StepType) => void;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setPaymentProcessing: (isPaymentProcessing: boolean) => void;
  setSelectedEstablishmentBillingGroup: (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  steps: ImmutableArray<StepType>;
  termsAndConditionsAccepted: boolean;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
  ref: React.Ref<any>;
};

export const CheckoutSteps: React.FC<CheckoutStepsProps> = forwardRef(
  (
    {
      basket,
      basketHasOffers,
      checkItemsBasket,
      companyCountry,
      companyId,
      currentStep,
      enableMultiLocalization,
      establishmentBillingGroups,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onPaymentSuccess,
      onSelectInstalmentPayment,
      patchBasket,
      selectedEstablishmentBillingGroup,
      setCurrentStep,
      setIsEstablishmentBillingGroupSelected,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      steps,
      termsAndConditionsAccepted,
      updateMemberBillingGroup,
      validateUnpaid,
    },
    ref,
  ) => {
    const { t } = useTranslation('checkout');

    const basketDeliveryRef = React.useRef<any>(null);
    const paymentStepRef = React.useRef<any>(null);
    const classes = useStyles();

    useImperativeHandle(ref, () => ({
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        switch (currentStep.id) {
          case STEPS.ADDRESS_STEP.id:
            basketDeliveryRef.current?.onAddressSubmit();
            break;
          case STEPS.PAYMENT_STEP.id:
            paymentStepRef.current?.onPaymentConfirm(event);
            break;
          default:
        }
      },
      updateMemberDefaultEstablishmentBillingGroup: () => {
        if (selectedEstablishmentBillingGroup) {
          updateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
        }
      },
      onPayLaterSubmit: paymentStepRef.current?.onPayLaterSubmit,
      onPayPalPaymentCreateOrder: paymentStepRef.current?.onPayPalCreateOrder,
      onPayPalPaymentApprove: paymentStepRef.current?.onPayPalApprove,
      onPayPalPaymentCancel: paymentStepRef.current?.onPayPalCancel,
      onPayPalPaymentError: paymentStepRef.current?.onPayPalError,
    }));

    const handleBasketDeliverySubmit = React.useCallback(
      (basketAddress) =>
        patchBasket(basketAddress, {
          onSuccess: () => {
            setCurrentStep(STEPS.PAYMENT_STEP);
          },
        }),
      [patchBasket, setCurrentStep],
    );

    const renderStep = React.useCallback(() => {
      switch (currentStep.id) {
        case STEPS.ADDRESS_STEP.id:
          return (
            <BasketDeliveryForm
              ref={basketDeliveryRef}
              basket={basket}
              companyCountry={companyCountry ?? ''}
              onSubmit={handleBasketDeliverySubmit}
            />
          );
        case STEPS.PAYMENT_STEP.id:
        default:
          return (
            <PaymentStep
              ref={paymentStepRef}
              basket={basket}
              basketHasOffers={basketHasOffers}
              checkItemsBasket={checkItemsBasket}
              companyId={companyId}
              enableMultiLocalization={enableMultiLocalization}
              establishmentBillingGroups={establishmentBillingGroups}
              isOnlinePaymentAvailable={isOnlinePaymentAvailable}
              isPayLaterAvailable={isPayLaterAvailable}
              isTotalPriceNull={isTotalPriceNull}
              onPaymentSuccess={onPaymentSuccess}
              onSelectInstalmentPayment={onSelectInstalmentPayment}
              selectedEstablishmentBillingGroup={
                selectedEstablishmentBillingGroup
              }
              setIsEstablishmentBillingGroupSelected={
                setIsEstablishmentBillingGroupSelected
              }
              setPaymentProcessing={setPaymentProcessing}
              setSelectedEstablishmentBillingGroup={
                setSelectedEstablishmentBillingGroup
              }
              setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
              termsAndConditionsAccepted={termsAndConditionsAccepted}
              validateUnpaid={validateUnpaid}
            />
          );
      }
    }, [
      basket,
      basketHasOffers,
      checkItemsBasket,
      companyCountry,
      companyId,
      currentStep.id,
      enableMultiLocalization,
      establishmentBillingGroups,
      handleBasketDeliverySubmit,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onPaymentSuccess,
      onSelectInstalmentPayment,
      selectedEstablishmentBillingGroup,
      setIsEstablishmentBillingGroupSelected,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      termsAndConditionsAccepted,
      validateUnpaid,
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
