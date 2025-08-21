import React from 'react';
import ButtonV2 from '#src/components/css-only/Fabrique/ButtonV2';
import {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from '#src/components/css-only/Fabrique/ButtonV2/constants';
import {
  UseSubmitButtonsProps,
  usePaymentBasketButtons,
} from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePaymentBasketButtons';
import Loader from './Loader';
import { useTranslation } from 'react-i18next';
import { SUBMIT_BUTTONS } from '#src/libs/checkout/types';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { getPayPalScriptProviderOptions } from '#src/libs/payment/utils';
import PayPalPaymentButton from '#src/libs/payment/components/paypal/PayPalPaymentButton.component';
import { usePayment } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePayment';

type Props = UseSubmitButtonsProps & {
  enforceDisabled?: boolean;
  label?: string;
};

type PayPalButtonProps = {
  isProcessing: boolean;
  isDisabled: boolean;
  clientSecret: string;
  isClientSecretLoading: boolean;
  createOrder: () => Promise<string>;
  onApprove: () => Promise<void>;
  onError: () => Promise<void>;
  onCancel: () => Promise<void>;
};

const PayPalButton: React.FC<PayPalButtonProps> = ({
  clientSecret,
  isClientSecretLoading,
  isProcessing,
  isDisabled,
  createOrder,
  onApprove,
  onError,
  onCancel,
}) => {
  return isClientSecretLoading ? (
    <Loader />
  ) : (
    <PayPalScriptProvider
      options={getPayPalScriptProviderOptions(clientSecret)}
    >
      {isProcessing && (
        <div className="bs-light-signup-form__submit-button-loader">
          <Loader />
        </div>
      )}
      <PayPalPaymentButton
        createOrder={createOrder}
        isDisabled={isDisabled || isProcessing}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

/**
 *
 * This component renders payment buttons for a payment basket, including PayPal and other custom buttons.
 * It utilizes the PayPalScriptProvider to integrate PayPal payments and handles various states such as loading, processing, and disabled states.
 *
 * @param props.paymentBasketRef - A reference to the payment basket.
 * @param props.paymentContext - The context for the payment, including basketId, companyId, and memberId.
 * @param props.submitButtons - An array of submit button configurations.
 * @param props.enforceDisabled - A flag to enforce the disabled state on all buttons.
 * @param props.label - An optional props to override the button label.
 * @returns The rendered PaymentButtons component.
 */
export const PaymentButtons: React.FC<Props> = ({
  paymentBasketRef,
  paymentContext,
  submitButtons,
  enforceDisabled,
  label,
}) => {
  const { t } = useTranslation('booking');

  const { clientSecret, isClientSecretLoading } = usePayment(
    paymentContext?.basketId,
    paymentContext?.companyId,
    paymentContext?.memberId,
  );

  const buttonsConfiguration =
    usePaymentBasketButtons({
      paymentBasketRef,
      paymentContext,
      submitButtons,
    }) ?? [];

  return (
    <div className="bs-oneclick-booking__book-button-container">
      {buttonsConfiguration.map(
        ({ button, callbacks, isDisabled, isProcessing }) =>
          button.id === SUBMIT_BUTTONS.PAYPAL_BUTTON.id ? (
            <PayPalButton
              key={button.id}
              clientSecret={clientSecret}
              createOrder={callbacks.createOrder!!}
              isClientSecretLoading={isClientSecretLoading}
              isDisabled={enforceDisabled || isDisabled}
              isProcessing={isProcessing}
              onApprove={callbacks.onApprove!!}
              onCancel={callbacks.onCancel!!}
              onError={callbacks.onError!!}
            />
          ) : (
            <ButtonV2
              key={button.id}
              className="bs-oneclick-booking__book-button"
              color={ButtonColor.PRIMARY}
              isDisabled={enforceDisabled || isDisabled}
              onClick={callbacks.onClick!!}
              size={ButtonSize.LG}
              variant={ButtonVariant.CONTAINED}
            >
              {isProcessing ? (
                <div className="bs-light-signup-form__submit-button-loader">
                  <Loader />
                </div>
              ) : (
                label ?? t('oneClickBooking.bookButtonLabel')
              )}
            </ButtonV2>
          ),
      )}
    </div>
  );
};
