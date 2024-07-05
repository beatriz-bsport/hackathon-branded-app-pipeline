import React from 'react';

const useConsumerSubscriptionsModalManager = () => {
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isSubscriptionTabDrawerOpen, setIsSubscriptionTabDrawerOpen] =
    React.useState(false);
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

  const handleToggleSubscriptionTabDrawer = React.useCallback(() => {
    setIsSubscriptionTabDrawerOpen((openOrClose) => !openOrClose);
  }, []);

  return {
    isPaymentModalOpen,
    isTermsModalOpen,
    handleTermsModalOpen,
    handleTermsModalClose,
    handlePaymentModalOpen,
    handlePaymentModalClose,
    handleToggleSubscriptionTabDrawer,
    isSubscriptionTabDrawerOpen,
  };
};

export default useConsumerSubscriptionsModalManager;
