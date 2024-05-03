import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AxiosResponse } from 'axios';
import type { StripeReader } from '#libs/terminal/types';
import type { StripeInit } from '#libs/payment/types';
import CollectPaymentMethod from './CollectPaymentMethod.component';
import PaymentMethodSwitcher from './PaymentMethodSwitcher.component';

type Props = {
  addViaTerminal?: boolean;
  cardBillingDetailsMandatory: boolean;
  companyId?: number;
  disabled?: boolean;
  enabledPaymentMethods: Array<number>;
  labelClose?: string;
  paymentMethodType?: string;
  sepaDefaultEmail: string;
  sepaDefaultName: string;
  stripeReaders?: StripeReader[];
  onCancel?: () => void;
  onChange?: (param: string) => void;
  onSuccess?: () => void;
  refreshSavedPaymentMethodList?: () => void;
  requestSetupIntentSecret: () => Promise<AxiosResponse<any>>;
  stripePromise?: StripeInit;
};

export const AddPaymentMethod: React.FC<Props> = ({
  addViaTerminal,
  cardBillingDetailsMandatory,
  companyId,
  disabled,
  enabledPaymentMethods,
  labelClose,
  paymentMethodType,
  sepaDefaultEmail,
  sepaDefaultName,
  stripeReaders,
  onCancel,
  onChange,
  onSuccess,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  stripePromise,
}) => {
  const { t } = useTranslation('payment');

  const [paymentMethodTypeControlled, setPaymentMethodTypeControlled] =
    React.useState('card');

  const changePaymentMethod = (value: string) => {
    setPaymentMethodTypeControlled(value);
  };

  return (
    <>
      <PaymentMethodSwitcher
        disabled={disabled}
        enabledPaymentMethods={enabledPaymentMethods}
        onChange={onChange || changePaymentMethod}
        paymentMethod={paymentMethodType || paymentMethodTypeControlled}
      />
      <CollectPaymentMethod
        addViaTerminal={!!addViaTerminal}
        cardBillingDetailsMandatory={cardBillingDetailsMandatory}
        companyId={companyId}
        content={t('forms.paymentMethod.collect.contentAdd')}
        defaultEmail={sepaDefaultEmail}
        defaultName={sepaDefaultName}
        labelClose={labelClose}
        onClose={onCancel}
        onSuccess={onSuccess}
        paymentMethodType={paymentMethodType || paymentMethodTypeControlled}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        stripePromise={stripePromise}
        stripeReaders={stripeReaders || []}
        variant="div"
      />
    </>
  );
};

export default memo(AddPaymentMethod);
