import React from 'react';
import { QUICKSALE_ITEMS_REQUIRING_AUTHENTICATION } from '#src/libs/quicksale/constants';
import type { Basket } from '#src/libs/checkout/types';
import type { Member } from '#src/libs/member/types';

const useModals = ({
  goBack,
  basket,
  member,
}: {
  goBack: () => void;
  basket?: Basket;
  member?: Member;
}) => {
  const [showCannotSignOutModal, setShowCannotSignOutModal] =
    React.useState(false);

  const [showMemberAuthenticationModal, setShowMemberAuthenticationModal] =
    React.useState(false);

  const [
    someObjectsRequireAuthentication,
    setSomeObjectsRequireAuthentication,
  ] = React.useState(false);

  const [showWarningRemovedItemsModal, setShowWarningRemovedItemsModal] =
    React.useState(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    React.useState(false);

  const [showPartialPaymentSuccesModal, setShowPartialPaymentSuccesModal] =
    React.useState(false);

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
    if (someObjectsRequireAuthentication) {
      goBack();
    }
    setShowMemberAuthenticationModal(false);
  }, [goBack, someObjectsRequireAuthentication]);

  const closeWarningRemovedItemsModal = React.useCallback(() => {
    setShowWarningRemovedItemsModal(false);
  }, []);

  React.useEffect(() => {
    if (
      basket &&
      member &&
      member.is_pos &&
      (basket?.checkout_items ?? []).some((checkoutItem) =>
        QUICKSALE_ITEMS_REQUIRING_AUTHENTICATION.includes(
          checkoutItem.buyable_item_identifier,
        ),
      )
    ) {
      openMemberModal();
      setSomeObjectsRequireAuthentication(true);
    }
  }, [basket, member, openMemberModal]);

  return {
    showCannotSignOutModal,
    setShowCannotSignOutModal,
    showMemberAuthenticationModal,
    setShowMemberAuthenticationModal,
    showWarningRemovedItemsModal,
    setShowWarningRemovedItemsModal,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    showPartialPaymentSuccesModal,
    setShowPartialPaymentSuccesModal,
    openCannotSignOutModal,
    closeCannotSignOutModal,
    openMemberModal,
    closeMemberModal,
    closeWarningRemovedItemsModal,
    someObjectsRequireAuthentication,
    setSomeObjectsRequireAuthentication,
  };
};

export default useModals;
