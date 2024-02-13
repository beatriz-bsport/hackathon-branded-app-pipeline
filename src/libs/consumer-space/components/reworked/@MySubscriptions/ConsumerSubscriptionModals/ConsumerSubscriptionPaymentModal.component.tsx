import React from 'react';
import { useTranslation } from 'react-i18next';

import type { AxiosResponse } from 'axios';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import Alert from '#Fabrique/Alert';
import { PortalContainer } from '#Fabrique/PortalContainer';
import BottomDrawer from '#Fabrique/BottomDrawer';
import BigIcon from '#Fabrique/BigIcon';
import Typography from '#Fabrique/Typography';

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
  switchSucceeded: boolean;
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
  Required<
    Omit<
      ContentProps,
      | 'selectedPaymentMethodId'
      | 'setSelectedSavedPaymentMethod'
      | 'switchSucceeded'
    >
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
  switchSucceeded,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (switchSucceeded) {
    return (
      <div className="bs-consumer__subscription__payment__confirmation-dialog__content">
        <BigIcon variant="success" />
        <div className="bs-consumer__subscription__payment__confirmation-dialog__content__text">
          <Typography align="center" variant="title-sm">
            {t('reworked.mySubscriptions.paymentMethodUpdatedTitle')}
          </Typography>
          <Typography align="center" variant="body-md">
            {t('reworked.mySubscriptions.paymentMethodUpdatedContent')}
          </Typography>
        </div>
      </div>
    );
  }
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

  const handleConfirm = React.useCallback(
    () =>
      switchPaymentMethod(selectedSubscription?.id, selectedPaymentMethodId, {
        onSuccess: () => {
          setSwitchSucceeded(true);
        },
      }),
    [switchPaymentMethod, selectedSubscription, selectedPaymentMethodId],
  );

  if (isMobile) {
    return (
      <BottomDrawer
        blanketProps={{ isOpen, onClick: handleClose }}
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
          onClose: handleClose,
          onCancel: handleClose,
          onConfirm:
            !switchSucceeded && selectedSubscription ? handleConfirm : null,
          cancelLabel: switchSucceeded && t('reworked.mySubscriptions.close'),
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
          switchSucceeded={switchSucceeded}
        />
      </BottomDrawer>
    );
  }
  return (
    <PortalContainer wrapperId="bs-consumer-subscription-payment-modal-portal-container">
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={handleClose}
      >
        <ModalDialog
          cancelLabel={switchSucceeded && 'Close'}
          isSubmitLoading={!selectedPaymentMethodId}
          onCancel={handleClose}
          onClose={selectedSubscription && handleClose}
          onConfirm={
            !switchSucceeded && selectedSubscription ? handleConfirm : null
          }
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
            switchSucceeded={switchSucceeded}
          />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionPaymentModal);
