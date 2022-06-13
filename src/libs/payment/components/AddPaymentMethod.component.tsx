import React from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import PaymentMethodSwitcher from './PaymentMethodSwitcher.component';
import CollectPaymentMethod from './CollectPaymentMethod.component';
import type { StripeReader } from '#libs/terminal/types';

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
  stripeReaders?: StripeReader[];
  addViaTerminal?: boolean;
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
  stripeReaders,
  addViaTerminal,
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
        stripeReaders={stripeReaders || []}
        addViaTerminal={!!addViaTerminal}
      />
    </>
  );
};
export default AddPaymentMethod;
