import React from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';

import '../styles.css';

type Props = {
  /** Manages modal opening */
  isOpen: boolean;
  /** Download process is active  */
  isProcessing: boolean;
  /** Action when closing modal */
  onClose: () => void;
  //* Action when clicking on download*/
  onDownloadClick: () => void;
  /** Contract terms at the time the subscription was bought */
  termsContent: string;
};

const ConsumerSubscriptionTermsBottomDrawer: React.FC<Props> = ({
  isOpen,
  isProcessing,
  onClose,
  onDownloadClick,
  termsContent,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <PortalContainer wrapperId="bs-consumer-subscription-terms-modal-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-consumer-booking-details-drawer__root"
        modalDialogProps={{
          title: t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.terms',
          ),
          onClose,
          onCancel: onClose,
          confirmLabel: t('reworked.mySubscriptions.download'),
          onConfirm: onDownloadClick,
          classes: {
            content: 'bs-consumer__subscription__modal-dialog__content',
          },
          isSubmitLoading: isProcessing,
        }}
      >
        {termsContent}
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionTermsBottomDrawer);
