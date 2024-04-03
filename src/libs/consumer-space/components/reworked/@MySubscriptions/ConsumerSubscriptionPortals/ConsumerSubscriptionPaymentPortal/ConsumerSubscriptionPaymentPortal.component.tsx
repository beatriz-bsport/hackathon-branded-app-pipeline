import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AxiosResponse } from 'axios';

import {
  ConsumerSubscriptionPaymentModal,
  ConsumerSubscriptionPaymentBottomDrawer,
} from '.';

import type { OptionCallback } from '#state/types';
import type { PaymentMethod } from '#libs/payment/types';
import type { SubscriptionREST } from '#libs/subscription/types';

type Props = {
  displayBottomDrawer: boolean;
  enabledPaymentGroupMethodIdentifierIds: number[];
  isOpen: boolean;
  memberMail: string;
  memberName: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodLoading: boolean;
  paymentMethodUsed: PaymentMethod;
  selectedSubscription: SubscriptionREST;
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  onClose: () => void;
  refreshSavedPaymentMethodList: () => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  switchPaymentMethod: (
    subscriptionId: number,
    payment_method_id: string,
    options: OptionCallback,
  ) => void;
};

const ConsumerSubscriptionPaymentPortal: React.FC<Props> = ({
  displayBottomDrawer,
  enabledPaymentGroupMethodIdentifierIds,
  isOpen,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  selectedSubscription,
  detachPaymentMethod,
  onClose,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  switchPaymentMethod,
}) => {
  const { t } = useTranslation('consumerSpace');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [switchSucceeded, setSwitchSucceeded] = React.useState(false);

  const [selectedPaymentMethodId, setSelectedSavedPaymentMethod] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    selectedSubscription &&
      setSelectedSavedPaymentMethod(
        selectedSubscription?.stripe_payment_method_id,
      );
  }, [selectedSubscription]);

  const handleClose = React.useCallback(() => {
    onClose();
    setSwitchSucceeded(false);
  }, [onClose]);

  const handleConfirm = React.useCallback(() => {
    setIsProcessing(true);
    switchPaymentMethod(selectedSubscription?.id, selectedPaymentMethodId, {
      onSuccess: () => {
        setSwitchSucceeded(true);
        setIsProcessing(false);
      },
      onError: () => {
        setIsProcessing(false);
      },
    });
  }, [switchPaymentMethod, selectedSubscription, selectedPaymentMethodId]);

  const title = selectedSubscription?.stripe_payment_method_id
    ? t('reworked.mySubscriptions.changePaymentMethod')
    : t(
        'reworked.mySubscriptions.consumerSubscriptionCard.buttonsLabel.addPaymentMethod',
      );

  const cancelLabel = t('reworked.mySubscriptions.close');

  if (displayBottomDrawer) {
    return (
      <ConsumerSubscriptionPaymentBottomDrawer
        cancelLabel={cancelLabel}
        detachPaymentMethod={detachPaymentMethod}
        enabledPaymentGroupMethodIdentifierIds={
          enabledPaymentGroupMethodIdentifierIds
        }
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        isOpen={isOpen}
        isProcessing={isProcessing}
        memberMail={memberMail}
        memberName={memberName}
        paymentMethodList={paymentMethodList}
        paymentMethodLoading={paymentMethodLoading}
        paymentMethodUsed={paymentMethodUsed}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        selectedPaymentMethodId={selectedPaymentMethodId}
        selectedSubscription={selectedSubscription}
        setSelectedSavedPaymentMethod={setSelectedSavedPaymentMethod}
        switchSucceeded={switchSucceeded}
        title={title}
      />
    );
  }

  return (
    <ConsumerSubscriptionPaymentModal
      cancelLabel={cancelLabel}
      detachPaymentMethod={detachPaymentMethod}
      enabledPaymentGroupMethodIdentifierIds={
        enabledPaymentGroupMethodIdentifierIds
      }
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      isOpen={isOpen}
      isProcessing={isProcessing}
      memberMail={memberMail}
      memberName={memberName}
      paymentMethodList={paymentMethodList}
      paymentMethodLoading={paymentMethodLoading}
      paymentMethodUsed={paymentMethodUsed}
      refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
      requestSetupIntentSecret={requestSetupIntentSecret}
      selectedPaymentMethodId={selectedPaymentMethodId}
      selectedSubscription={selectedSubscription}
      setSelectedSavedPaymentMethod={setSelectedSavedPaymentMethod}
      switchSucceeded={switchSucceeded}
      title={title}
    />
  );
};

export default React.memo(ConsumerSubscriptionPaymentPortal);
