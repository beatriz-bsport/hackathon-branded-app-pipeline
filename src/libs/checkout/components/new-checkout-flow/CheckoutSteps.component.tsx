import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles, Theme } from '@material-ui/core';

import { ImmutableArray } from 'seamless-immutable';
import BasketDeliveryForm from '#libs/checkout/components/BasketDeliveryForm.component';
import AcceptTermsAndConditions from '#libs/payment/components/AcceptTermsAndConditions.component';
import type { InstalmentPaymentApiWithBasketId } from '#libs/instalment-payment-configuration/types';

import type { OptionCallback } from '../../../../state/types';
import {
  BasketAddress,
  Basket,
  PrepaidLine,
  StepType,
  STEPS,
} from '../../types';
import { PaymentStep } from './PaymentStep.component';
import { TermsAndConditionType } from '#libs/payment/types';

type CheckoutStepsProps = {
  allowConsumerToUseInternalAccount: boolean;
  auth: any;
  basket: Basket<string, PrepaidLine>;
  basketLoading: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  companyCountry?: string;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  creditAccountBalance?: number | null;
  currentStep: StepType;
  detachPaymentMethod: (pm_id: string) => void;
  detachPaymentMethodLoading: boolean;
  instalmentPaymentConfigurationList: InstalmentPaymentApiWithBasketId[] | null;
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onPaymentSuccess: () => void;
  patchBasket: (basketAddress: BasketAddress, options: OptionCallback) => void;
  paymentGroupId: number;
  paymentProcessing: boolean;
  paymentMethodChoices: any;
  ref: React.Ref<any>;
  setCurrentStep: (step: StepType) => void;
  setIsOnlinePaymentDisabled: (isLoading: boolean) => void;
  setPaymentProcessing: (isPaymentProcessing: boolean) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  stripeId: string | null;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  steps: ImmutableArray<StepType>;
  termsAndConditions: string;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
};

export const CheckoutSteps: React.FC<CheckoutStepsProps> = forwardRef(
  (
    {
      allowConsumerToUseInternalAccount,
      auth,
      basket,
      basketLoading,
      checkItemsBasket,
      clientSecret,
      companyCountry,
      companyId,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      currentStep,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      instalmentPaymentConfigurationList,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onSelectInstalmentPayment,
      onPaymentSuccess,
      patchBasket,
      paymentGroupId,
      paymentProcessing,
      paymentMethodChoices,
      setCurrentStep,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      steps,
      stripeId,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
    },
    ref,
  ) => {
    const { t } = useTranslation('checkout');

    const basketDeliveryRef = React.useRef(null);
    const paymentStepRef = React.useRef(null);

    const classes = useStyles();

    useImperativeHandle(ref, () => {
      return {
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          switch (currentStep.id) {
            case STEPS.ADDRESS_STEP.id:
              basketDeliveryRef.current.onAddressSubmit();
              break;
            case STEPS.PAYMENT_STEP.id:
              paymentStepRef.current.onPaymentConfirm(event);
              break;
            default:
          }
        },
        onPayLaterSubmit: paymentStepRef.current?.onPayLaterSubmit,
      };
    });

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
              basket={basket}
              companyCountry={companyCountry}
              onSubmit={handleBasketDeliverySubmit}
              ref={basketDeliveryRef}
            />
          );
        case STEPS.PAYMENT_STEP.id:
        default:
          return (
            <>
              <PaymentStep
                allowConsumerToUseInternalAccount={
                  allowConsumerToUseInternalAccount
                }
                basket={basket}
                checkItemsBasket={checkItemsBasket}
                clientSecret={clientSecret}
                companyId={companyId}
                createPendingBookingsIfNecessary={
                  createPendingBookingsIfNecessary
                }
                creditAccountBalance={creditAccountBalance}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={detachPaymentMethodLoading}
                instalmentPaymentConfigurationList={
                  instalmentPaymentConfigurationList
                }
                isOnlinePaymentAvailable={isOnlinePaymentAvailable}
                isPayLaterAvailable={isPayLaterAvailable}
                isTotalPriceNull={isTotalPriceNull}
                loading={basketLoading || paymentProcessing}
                onSelectInstalmentPayment={onSelectInstalmentPayment}
                onPaymentSuccess={onPaymentSuccess}
                paymentGroupId={paymentGroupId}
                paymentMethodChoices={paymentMethodChoices}
                paymentProcessing={paymentProcessing}
                ref={paymentStepRef}
                sepaDefaultEmail={auth.username}
                sepaDefaultName={auth.name}
                setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                setPaymentProcessing={setPaymentProcessing}
                setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
                snackbarErrorMsg={snackbarErrorMsg}
                snackbarSuccessMsg={snackbarSuccessMsg}
                stripeId={stripeId}
                termsAndConditions={termsAndConditions}
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                useInternalAccount={useInternalAccount}
                validateUnpaid={validateUnpaid}
              />
              {termsAndConditions && (
                <AcceptTermsAndConditions
                  accepted={termsAndConditionsAccepted}
                  onChecked={setTermsAndConditionsAccepted}
                  termsAndConditions={termsAndConditions}
                  type={TermsAndConditionType.TERMS_AND_CONDITIONS}
                />
              )}
            </>
          );
      }
    }, [
      allowConsumerToUseInternalAccount,
      auth.name,
      auth.username,
      basket,
      basketLoading,
      checkItemsBasket,
      clientSecret,
      companyCountry,
      companyId,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      currentStep.id,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      handleBasketDeliverySubmit,
      instalmentPaymentConfigurationList,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onPaymentSuccess,
      onSelectInstalmentPayment,
      paymentGroupId,
      paymentMethodChoices,
      paymentProcessing,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      stripeId,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
    ]);

    return (
      <div className={classes.paymentStepsContainer}>
        {steps.length > 1 && (
          <Stepper activeStep={currentStep.id} alternativeLabel>
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

const useStyles = makeStyles((theme: Theme) => ({
  paymentStepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
}));
