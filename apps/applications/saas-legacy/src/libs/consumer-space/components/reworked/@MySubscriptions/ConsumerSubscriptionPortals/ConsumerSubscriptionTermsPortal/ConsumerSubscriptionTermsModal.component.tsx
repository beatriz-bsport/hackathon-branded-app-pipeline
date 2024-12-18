import React from 'react';
import { useTranslation } from 'react-i18next';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';

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

const ConsumerSubscriptionTermsModal: React.FC<Props> = ({
  isOpen,
  isProcessing,
  onClose,
  onDownloadClick,
  termsContent,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <PortalContainer wrapperId="bs-consumer-subscription-terms-modal-portal-container">
      <Blanket
        className="bs-consumer__subscription__blanket"
        isOpen={isOpen}
        onClick={onClose}
      >
        <ModalDialog
          classes={{
            content: 'bs-consumer__subscription__modal-dialog__content',
          }}
          confirmLabel={t('reworked.mySubscriptions.download')}
          isSubmitLoading={isProcessing}
          onCancel={onClose}
          onClose={onClose}
          onConfirm={onDownloadClick}
          title={t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.terms',
          )}
        >
          {termsContent}
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(ConsumerSubscriptionTermsModal);
