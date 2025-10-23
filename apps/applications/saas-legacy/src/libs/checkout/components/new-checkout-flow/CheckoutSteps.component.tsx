import React, { forwardRef, useImperativeHandle } from 'react';
import { ImmutableArray } from 'seamless-immutable';
import { useTranslation } from 'react-i18next';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { OptionCallback } from 'src/state/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import { TermsAndConditionType } from '#src/libs/payment/types';
import {
  Basket,
  BasketAddress,
  PrepaidLine,
  STEPS,
  StepType,
} from '#src/libs/checkout/types';

import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import BasketDeliveryForm from '#src/libs/checkout/components/BasketDeliveryForm.component';
import { PaymentStep } from './PaymentStep.component';

type CheckoutStepsProps = {
  allowConsumerToUseInternalAccount: boolean;
  auth: any;
  basket: Basket<string, PrepaidLine>;
  basketLoading: boolean;
  billingGroupSelectorRef: React.Ref<React.ReactNode>;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  clientSecretLoading: boolean;
  companyCountry?: string;
  companyId: number;
  createPendingBookingsAndBlockBasket?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  invalidatePendingBookingsAndUnblockBasket?: () => void;
  creditAccountBalance?: number | null;
  currentStep: StepType;
  detachPaymentMethod: (pm_id: string) => void;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization?: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  instalmentPaymentConfigurationList: InstalmentPaymentApiWithBasketId[] | null;
  isEstablishmentBillingGroupSelected: boolean;
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
  paymentGroupPriceCts: number;
  paymentProcessing: boolean;
  paymentMethodChoices: any;
  ref: React.Ref<any>;
  setCurrentStep: (step: StepType) => void;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setIsOnlinePaymentDisabled: (isLoading: boolean) => void;
  setPaymentProcessing: (isPaymentProcessing: boolean) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  snackbarErrorMsg: (msg: string) => void;
  steps: ImmutableArray<StepType>;
  stripePaymentElementConfig: StripePaymentElementConfig;
  termsAndConditions: string;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
  cardBillingDetailsMandatory: boolean;
  basketHasOffers: boolean;
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setSelectedEstablishmentBillingGroup: (
    establishmentBillinggroup: EstablishmentBillingGroup,
  ) => void;
  paymentEngine: number;
  setPaymentEngine: (paymentEngine: number) => void;
  refreshBasket: (options?: OptionCallback) => void;
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
      clientSecretLoading,
      companyCountry,
      companyId,
      updateMemberBillingGroup,
      createPendingBookingsAndBlockBasket,
      creditAccountBalance,
      currentStep,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      enableMultiLocalization,
      establishmentBillingGroups,
      instalmentPaymentConfigurationList,
      invalidatePendingBookingsAndUnblockBasket,
      isEstablishmentBillingGroupSelected,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onSelectInstalmentPayment,
      onPaymentSuccess,
      patchBasket,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentProcessing,
      paymentMethodChoices,
      refreshBasket,
      setCurrentStep,
      setIsEstablishmentBillingGroupSelected,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      steps,
      stripePaymentElementConfig,
      termsAndConditions,
      setPaymentEngine,
      paymentEngine,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
      cardBillingDetailsMandatory,
      basketHasOffers,
      selectedEstablishmentBillingGroup,
      setSelectedEstablishmentBillingGroup,
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
              ref={basketDeliveryRef}
              basket={basket}
              companyCountry={companyCountry}
              onSubmit={handleBasketDeliverySubmit}
            />
          );
        case STEPS.PAYMENT_STEP.id:
        default:
          return (
            <>
              <PaymentStep
                ref={paymentStepRef}
                allowConsumerToUseInternalAccount={
                  allowConsumerToUseInternalAccount
                }
                basket={basket}
                basketHasOffers={basketHasOffers}
                cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                checkItemsBasket={checkItemsBasket}
                clientSecret={clientSecret}
                clientSecretLoading={clientSecretLoading}
                companyId={companyId}
                createPendingBookingsAndBlockBasket={
                  createPendingBookingsAndBlockBasket
                }
                creditAccountBalance={creditAccountBalance}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={detachPaymentMethodLoading}
                enableMultiLocalization={enableMultiLocalization}
                establishmentBillingGroups={establishmentBillingGroups}
                instalmentPaymentConfigurationList={
                  instalmentPaymentConfigurationList
                }
                invalidatePendingBookingsAndUnblockBasket={
                  invalidatePendingBookingsAndUnblockBasket
                }
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                isOnlinePaymentAvailable={isOnlinePaymentAvailable}
                isPayLaterAvailable={isPayLaterAvailable}
                isTotalPriceNull={isTotalPriceNull}
                loading={basketLoading || paymentProcessing}
                onPaymentSuccess={onPaymentSuccess}
                onSelectInstalmentPayment={onSelectInstalmentPayment}
                paymentEngine={paymentEngine}
                paymentGroupId={paymentGroupId}
                paymentGroupPriceCts={paymentGroupPriceCts}
                paymentMethodChoices={paymentMethodChoices}
                paymentProcessing={paymentProcessing}
                refreshBasket={refreshBasket}
                selectedEstablishmentBillingGroup={
                  selectedEstablishmentBillingGroup
                }
                sepaDefaultEmail={auth.username}
                sepaDefaultName={auth.name}
                setIsEstablishmentBillingGroupSelected={
                  setIsEstablishmentBillingGroupSelected
                }
                setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                setPaymentEngine={setPaymentEngine}
                setPaymentProcessing={setPaymentProcessing}
                setSelectedEstablishmentBillingGroup={
                  setSelectedEstablishmentBillingGroup
                }
                setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
                snackbarErrorMsg={snackbarErrorMsg}
                stripePaymentElementConfig={stripePaymentElementConfig}
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
      clientSecretLoading,
      companyCountry,
      companyId,
      createPendingBookingsAndBlockBasket,
      invalidatePendingBookingsAndUnblockBasket,
      creditAccountBalance,
      currentStep.id,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      enableMultiLocalization,
      handleBasketDeliverySubmit,
      instalmentPaymentConfigurationList,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onPaymentSuccess,
      onSelectInstalmentPayment,
      paymentEngine,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodChoices,
      paymentProcessing,
      selectedEstablishmentBillingGroup,
      setIsOnlinePaymentDisabled,
      setPaymentEngine,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
      cardBillingDetailsMandatory,
      basketHasOffers,
      isEstablishmentBillingGroupSelected,
      establishmentBillingGroups,
      setIsEstablishmentBillingGroupSelected,
      setSelectedEstablishmentBillingGroup,
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
