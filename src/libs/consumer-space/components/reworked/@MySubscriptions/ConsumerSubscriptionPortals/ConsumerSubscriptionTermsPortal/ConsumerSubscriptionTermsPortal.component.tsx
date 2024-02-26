import React from 'react';

import { downloadDocument } from '../../../../../../../utils/downloader';
import {
  ConsumerSubscriptionTermsBottomDrawer,
  ConsumerSubscriptionTermsModal,
} from '.';

import type { OptionCallback } from '../../../../../../../state/types';

import '../styles.css';

type Props = {
  /** PDF link of contract terms at the time the subscription was bought */
  contractTermsLink?: string;
  /** Indicates if we should display bottom drawer instead of a modal */
  displayBottomDrawer: boolean;
  /** In case subscriptions doesn't have a download link, this action will create one in the backend */
  downloadContractTerms?: (options: OptionCallback) => void;
  /** Manages modal opening */
  isOpen: boolean;
  /** Action when closing modal */
  onClose: () => void;
  /** Contract terms at the time the subscription was bought */
  termsContent: string;
};

const ConsumerSubscriptionTermsPortal: React.FC<Props> = ({
  contractTermsLink,
  displayBottomDrawer,
  downloadContractTerms,
  isOpen,
  onClose,
  termsContent,
}) => {
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

  if (displayBottomDrawer) {
    return (
      <ConsumerSubscriptionTermsBottomDrawer
        isOpen={isOpen}
        isProcessing={isProcessing}
        onClose={onClose}
        onDownloadClick={onDownloadClick}
        termsContent={termsContent}
      />
    );
  }

  return (
    <ConsumerSubscriptionTermsModal
      isOpen={isOpen}
      isProcessing={isProcessing}
      onClose={onClose}
      onDownloadClick={onDownloadClick}
      termsContent={termsContent}
    />
  );
};

export default React.memo(ConsumerSubscriptionTermsPortal);
