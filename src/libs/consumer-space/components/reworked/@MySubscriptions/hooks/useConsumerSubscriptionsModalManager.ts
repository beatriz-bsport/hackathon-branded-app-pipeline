import React from 'react';

const useConsumerSubscriptionsModalManager = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);

  const handleTermsModalClose = React.useCallback(
    () => setIsTermsModalOpen(false),
    [],
  );

  const handleTermsModalOpen = React.useCallback(
    () => setIsTermsModalOpen(true),
    [],
  );
  return { isTermsModalOpen, handleTermsModalOpen, handleTermsModalClose };
};

export default useConsumerSubscriptionsModalManager;
