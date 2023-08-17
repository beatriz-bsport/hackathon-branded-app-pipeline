import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import PaymentMethodSwitcher from './PaymentMethodSwitcher.component';
import CollectPaymentMethod from './CollectPaymentMethod.component';
import type { StripeReader } from '#libs/terminal/types';

type OwnProps = {
  onChange?: (param: string) => void;
  paymentMethodType?: string;
  enabledPaymentMethods: Array<number>;
  disabled?: boolean;
  sepaDefaultEmail: string;
  sepaDefaultName: string;
  requestSetupIntentSecret: () => Promise<AxiosResponse<any>>;
  refreshSavedPaymentMethodList?: () => void;
  onCancel?: () => void;
  stripeReaders?: StripeReader[];
  addViaTerminal?: boolean;
  onSuccess?: () => void;
  labelClose?: string;
  companyId?: number;
  cardBillingDetailsMandatory: boolean;
};
type Props = OwnProps;
export const AddPaymentMethod: React.FC<Props> = ({
  onChange,
  requestSetupIntentSecret,
  refreshSavedPaymentMethodList,
  paymentMethodType,
  enabledPaymentMethods,
  disabled,
  sepaDefaultName,
  sepaDefaultEmail,
  labelClose,
  onCancel,
  stripeReaders,
  addViaTerminal,
  onSuccess,
  companyId,
  cardBillingDetailsMandatory,
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
        stripeReaders={stripeReaders || []}
        variant="div"
      />
    </>
  );
};
export default memo(AddPaymentMethod);
