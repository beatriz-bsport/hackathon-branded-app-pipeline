import React from 'react';

const useModals = ({ goBack }: { goBack: () => void }) => {
  const [showCannotSignOutModal, setShowCannotSignOutModal] =
    React.useState(false);

  const [showMemberAuthenticationModal, setShowMemberAuthenticationModal] =
    React.useState(false);

  const [showWarningRemovedItemsModal, setShowWarningRemovedItemsModal] =
    React.useState(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    React.useState(false);

  const [
    showAnonymousPaymentSuccessModal,
    setShowAnonymousPaymentSuccessModal,
  ] = React.useState(false);

  const openCannotSignOutModal = React.useCallback(() => {
    setShowCannotSignOutModal(true);
  }, []);

  const closeCannotSignOutModal = React.useCallback(() => {
    setShowCannotSignOutModal(false);
  }, []);

  const openMemberModal = React.useCallback(() => {
    setShowMemberAuthenticationModal(true);
  }, []);

  const closeMemberModal = React.useCallback(() => {
    setShowMemberAuthenticationModal(false);
  }, []);

  const closeWarningRemovedItemsModal = React.useCallback(() => {
    setShowWarningRemovedItemsModal(false);
  }, []);

  const closeAnonymousPaymentSuccessModal = React.useCallback(() => {
    setShowAnonymousPaymentSuccessModal(false);
    goBack();
  }, [goBack]);

  return {
    showCannotSignOutModal,
    setShowCannotSignOutModal,
    showMemberAuthenticationModal,
    setShowMemberAuthenticationModal,
    showWarningRemovedItemsModal,
    setShowWarningRemovedItemsModal,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    showAnonymousPaymentSuccessModal,
    setShowAnonymousPaymentSuccessModal,
    openCannotSignOutModal,
    closeCannotSignOutModal,
    openMemberModal,
    closeMemberModal,
    closeWarningRemovedItemsModal,
    closeAnonymousPaymentSuccessModal,
  };
};

export default useModals;
