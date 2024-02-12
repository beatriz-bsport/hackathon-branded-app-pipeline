import React from 'react';

const useConsumerSubscriptionsModalManager = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  const handleTermsModalClose = React.useCallback(
    () => setIsTermsModalOpen(false),
    [],
  );

  const handleTermsModalOpen = React.useCallback(
    () => setIsTermsModalOpen(true),
    [],
  );

  const handlePaymentModalOpen = React.useCallback(
    () => setIsPaymentModalOpen(true),
    [],
  );

  const handlePaymentModalClose = React.useCallback(
    () => setIsPaymentModalOpen(false),
    [],
  );
  return {
    isPaymentModalOpen,
    isTermsModalOpen,
    handleTermsModalOpen,
    handleTermsModalClose,
    handlePaymentModalOpen,
    handlePaymentModalClose,
  };
};

export default useConsumerSubscriptionsModalManager;
