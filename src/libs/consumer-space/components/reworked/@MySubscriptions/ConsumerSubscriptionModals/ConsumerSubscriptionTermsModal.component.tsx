import React from 'react';
import { useTranslation } from 'react-i18next';

import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';
import BottomDrawer from '#Fabrique/BottomDrawer';

import { downloadDocument } from '../../../../../../utils/downloader';
import type { OptionCallback } from '../../../../../../state/types';

import './styles.css';

type Props = {
  /** PDF link of contract terms at the time the subscription was bought */
  contractTermsLink?: string;
  /** In case subscriptions doesn't have a download link, this action will create one in the backend */
  downloadContractTerms?: (options: OptionCallback) => void;
  /** Mobile version which displays a bottom drawer instead of a modal */
  isMobile: boolean;
  /** Manages modal opening */
  isOpen: boolean;
  /** Action when closing modal */
  onClose: () => void;
  /** Contract terms at the time the subscription was bought */
  termsContent: string;
};

const ConsumerSubscriptionTermsModal: React.FC<Props> = ({
  contractTermsLink,
  downloadContractTerms,
  isMobile,
  isOpen,
  onClose,
  termsContent,
}) => {
  const { t } = useTranslation('consumerSpace');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const onDownloadClick = React.useCallback(() => {
    if (contractTermsLink) {
      downloadDocument(contractTermsLink);
      onClose();
    } else {
      setIsProcessing(true);
      downloadContractTerms?.({
        onSuccess: () => {
          setIsProcessing(false);
          onClose();
        },
        onError: () => {
          setIsProcessing(false);
        },
      });
    }
  }, [onClose, contractTermsLink, downloadContractTerms]);

  if (isMobile) {
    return (
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-consumer-booking-details-drawer__root"
        modalDialogProps={{
          title: t(
            'reworked.mySubscriptions.consumerSubscriptionCardDetails.terms',
          ),
          onClose,
          onCancel: onClose,
          classes: {
            content: 'bs-consumer__subscription__modal-dialog__content',
          },
        }}
      >
        {termsContent}
      </BottomDrawer>
    );
  }

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
