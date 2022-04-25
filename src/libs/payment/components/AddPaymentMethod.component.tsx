import React from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import PaymentMethodSwitcher from './PaymentMethodSwitcher';
import CollectPaymentMethod from './CollectPaymentMethod.component';

type OwnProps = {
  onChange: (param: string) => void;
  paymentMethodType: string;
  enabledPaymentMethods: Array<number>;
  disabled?: boolean;
  sepaDefaultEmail: string;
  sepaDefaultName: string;
  requestSetupIntentSecret: () => Promise<AxiosResponse<any>>;
  refreshSavedPaymentMethodList: () => void;
  onCancel?: () => void;
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
  onCancel,
}) => {
  const { t } = useTranslation('payment');
  return (
    <>
      <PaymentMethodSwitcher
        paymentMethod={paymentMethodType}
        enabledPaymentMethods={enabledPaymentMethods}
        disabled={disabled}
        onChange={onChange}
      />

      <CollectPaymentMethod
        variant="div"
        requestSetupIntentSecret={requestSetupIntentSecret}
        paymentMethodType={paymentMethodType}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        defaultName={sepaDefaultName}
        defaultEmail={sepaDefaultEmail}
        onClose={onCancel}
        content={t('forms.paymentMethod.collect.contentAdd')}
      />
    </>
  );
};
export default AddPaymentMethod;
