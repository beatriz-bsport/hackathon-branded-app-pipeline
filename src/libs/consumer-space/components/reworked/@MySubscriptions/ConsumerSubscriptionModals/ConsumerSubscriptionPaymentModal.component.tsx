import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AxiosResponse } from 'axios';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import Alert from '#Fabrique/Alert';
import { PortalContainer } from '#Fabrique/PortalContainer';
import BottomDrawer from '#Fabrique/BottomDrawer';

import MarketplaceSubscriptionPayment from '#libs/checkout/components/new-checkout-flow/SubscriptionPayment/SubscriptionPayment.component';
import { getMarketplaceEnabledPaymentMethods } from '#libs/payment/utils';
import type { PaymentMethod } from '#libs/payment/types';
import type { OptionCallback } from '../../../../../../state/types';
import type { SubscriptionREST } from '#libs/subscription/types';

type ContentProps = {
  detachPaymentMethod: (id: string, options?: OptionCallback) => void;
  enabledPaymentGroupMethodIdentifierIds: number[];
  memberMail: string;
  memberName: string;
  paymentMethodList: PaymentMethod[];
  paymentMethodLoading: boolean;
  paymentMethodUsed: PaymentMethod;
  refreshSavedPaymentMethodList: () => void;
  requestSetupIntentSecret: () => Promise<
    AxiosResponse<{ client_secret: string }>
  >;
  selectedPaymentMethodId: string | null;
  setSelectedSavedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
};

type ModalProps = {
  isMobile: boolean;
  isOpen: boolean;
  selectedSubscription: SubscriptionREST;
  switchPaymentMethod: (
    subscriptionId: number,
    payment_method_id: string,
    options: OptionCallback,
  ) => void;
  onClose: () => void;
};

type Props = ModalProps &
  Omit<
    ContentProps,
    'selectedPaymentMethodId' | 'setSelectedSavedPaymentMethod'
  >;

const ConsumerSubscriptionPaymentContent: React.FC<ContentProps> = ({
  detachPaymentMethod,
  enabledPaymentGroupMethodIdentifierIds,
  memberMail,
  memberName,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  selectedPaymentMethodId,
  setSelectedSavedPaymentMethod,
}) => {
  const { t } = useTranslation('consumerSpace');
  return (
    <>
      <Alert
        className="bs-consumer__subscription__payment-dialog__alert"
        color="warning"
      >
        {t('reworked.mySubscriptions.paymentModalAlert')}
      </Alert>
      <MarketplaceSubscriptionPayment
        onlinePaymentEnabled
        withoutPaymentMethodPadding
        withPaymentMethodTitle
        detachPaymentMethod={detachPaymentMethod}
        enabledPaymentGroupMethodIdentifierIds={
          enabledPaymentGroupMethodIdentifierIds
        }
        enabledPaymentMethodsIds={getMarketplaceEnabledPaymentMethods({
          paymentMethodAvailableSubscription:
            enabledPaymentGroupMethodIdentifierIds,
        })}
        initialPaymentMethod={paymentMethodUsed?.type}
        paymentMethodLoading={paymentMethodLoading}
        refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        savedPaymentMethodList={paymentMethodList}
        selectedSavedPaymentMethodId={selectedPaymentMethodId}
        sepaDefaultEmail={memberMail}
        sepaDefaultName={memberName}
        setSelectedSavedPaymentMethodId={setSelectedSavedPaymentMethod}
      />
    </>
  );
};

const ConsumerSubscriptionPaymentModal: React.FC<Props> = ({
  detachPaymentMethod,
  enabledPaymentGroupMethodIdentifierIds,
  isMobile,
  isOpen,
  memberMail,
  memberName,
  onClose,
  paymentMethodList,
  paymentMethodLoading,
  paymentMethodUsed,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  selectedSubscription,
  switchPaymentMethod,
}) => {
  const { t } = useTranslation('consumerSpace');

  const [selectedPaymentMethodId, setSelectedSavedPaymentMethod] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    selectedSubscription &&
      setSelectedSavedPaymentMethod(
        selectedSubscription?.stripe_payment_method_id,
      );
  }, [selectedSubscription]);

  const handleConfirm = React.useCallback(
    () =>
      switchPaymentMethod(selectedSubscription?.id, selectedPaymentMethodId, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          onClose();
        },
      }),
    [
      onClose,
      switchPaymentMethod,
      selectedSubscription,
      selectedPaymentMethodId,
    ],
  );

  if (isMobile) {
    return (
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-consumer-booking-details-drawer__root"
        modalDialogProps={{
          classes: {
            content: 'bs-consumer__subscription__modal-dialog__content',
          },
          isSubmitLoading: !selectedPaymentMethodId,
          title: selectedSubscription?.stripe_payment_method_id
            ? t('reworked.mySubscriptions.changePaymentMethod')
            : t(
                'reworked.mySubscriptions.consumerSubscriptionCard.buttonsLabel.addPaymentMethod',
              ),
          onClose,
          onCancel: onClose,
          onConfirm: selectedSubscription ? handleConfirm : null,
        }}
      >
        <ConsumerSubscriptionPaymentContent
          detachPaymentMethod={detachPaymentMethod}
          enabledPaymentGroupMethodIdentifierIds={
            enabledPaymentGroupMethodIdentifierIds
          }
          memberMail={memberMail}
          memberName={memberName}
          paymentMethodList={paymentMethodList}
          paymentMethodLoading={paymentMethodLoading}
          paymentMethodUsed={paymentMethodUsed}
          refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
          requestSetupIntentSecret={requestSetupIntentSecret}
          selectedPaymentMethodId={selectedPaymentMethodId}
          setSelectedSavedPaymentMethod={setSelectedSavedPaymentMethod}
        />
      </BottomDrawer>
    );
  }
  return (
    <PortalContainer wrapperId="bs-consumer-subscription-payment-modal-portal-container">
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={onClose}
      >
        <ModalDialog
          isSubmitLoading={!selectedPaymentMethodId}
          onCancel={onClose}
          onClose={selectedSubscription && onClose}
          onConfirm={selectedSubscription ? handleConfirm : null}
          title={
            selectedSubscription?.stripe_payment_method_id
              ? t('reworked.mySubscriptions.changePaymentMethod')
              : t(
                  'reworked.mySubscriptions.consumerSubscriptionCard.buttonsLabel.addPaymentMethod',
                )
          }
        >
          <ConsumerSubscriptionPaymentContent
            detachPaymentMethod={detachPaymentMethod}
            enabledPaymentGroupMethodIdentifierIds={
              enabledPaymentGroupMethodIdentifierIds
            }
            memberMail={memberMail}
            memberName={memberName}
            paymentMethodList={paymentMethodList}
            paymentMethodLoading={paymentMethodLoading}
            paymentMethodUsed={paymentMethodUsed}
            refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
            requestSetupIntentSecret={requestSetupIntentSecret}
            selectedPaymentMethodId={selectedPaymentMethodId}
            setSelectedSavedPaymentMethod={setSelectedSavedPaymentMethod}
          />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionPaymentModal);
