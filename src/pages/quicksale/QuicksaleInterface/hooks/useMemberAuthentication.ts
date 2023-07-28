import React from 'react';

import { MemberMap } from '#libs/member/utils';

// @ts-expect-error
import { mapFormData } from '../../../form.utils';
import type { OptionCallback } from '../../../../state/types';
import type { Contract } from '#libs/subscription/types';
import { Basket, QuicksaleMemberUpdateResponse } from '#libs/checkout/types';
import { QuicksaleCardInfo } from '#libs/quicksale/types';
import { Member, MemberMinimal } from '#libs/member/types';

const useMemberAuthentication = (
  createMemberAction: (
    id: number,
    memberData: FormData,
    options?: OptionCallback,
  ) => void,
  setMemberToSubscribe: (member: Member) => void,
  setShowSubscriptionContractModal: (show: boolean) => void,
  closeMemberModal: () => void,
  fetchMembers: (
    params: any,
    options?: OptionCallback<MemberMinimal[]>,
  ) => Promise<void>,
  updateQuicksaleBasketMember: (
    basketId: string,
    memberId: number,
    options?: OptionCallback<QuicksaleMemberUpdateResponse>,
  ) => void,
  setCurrentBasket: (basket: Basket | null) => void,
  setShowWarningRemovedItemsModal: (show: boolean) => void,
  onItemClick: (item: QuicksaleCardInfo, customBasket?: Basket) => void,
  setPendingItemToAdd: (item: QuicksaleCardInfo | null) => void,
  contractToSubscribe?: Contract,
  currentBasket?: Basket,
  pendingItemToAdd?: QuicksaleCardInfo,
  memberById?: {
    [key: string]: Member;
  },
) => {
  const createMember = React.useCallback(
    (data: any, options: OptionCallback) => {
      const memberData = data;
      if (!memberData.birthday) delete memberData.birthday;

      const formData = mapFormData(memberData, MemberMap);
      createMemberAction(null, formData, options);
    },
    [createMemberAction],
  );

  // The authentication of a member is used either to assign the current basket
  // to a member, or to subscribe a member to a contract.
  const onMemberAuthenticate = React.useCallback(
    (memberId: number | null) => {
      if (
        !memberId ||
        (!contractToSubscribe && !currentBasket && !pendingItemToAdd)
      )
        return;

      if (!memberById[memberId]) {
        fetchMembers(
          { id__in: [memberId] },
          contractToSubscribe
            ? {
                onSuccess: (memberList) => {
                  // @ts-expect-error: listData is wrongly typed in MemberState, so
                  // we're forced to tell TS we're using the Member type here even though
                  // it's actually MemberMinimal
                  setMemberToSubscribe(memberList[0]);
                  setShowSubscriptionContractModal(true);
                },
              }
            : {},
        );
      } else if (contractToSubscribe) {
        setMemberToSubscribe(memberById[memberId]);
        setShowSubscriptionContractModal(true);
        closeMemberModal();
      }

      if (!contractToSubscribe)
        updateQuicksaleBasketMember(currentBasket.id, memberId, {
          onSuccess: (updateData) => {
            if (updateData.updated_member) {
              setCurrentBasket(updateData.new_basket);
              closeMemberModal();
              if (updateData.has_removed_incompatible_items)
                setShowWarningRemovedItemsModal(true);
              if (pendingItemToAdd) {
                onItemClick(pendingItemToAdd, updateData.new_basket);
                setPendingItemToAdd(null);
              }
            }
          },
        });
    },
    [
      closeMemberModal,
      contractToSubscribe,
      currentBasket,
      fetchMembers,
      memberById,
      onItemClick,
      pendingItemToAdd,
      setCurrentBasket,
      setMemberToSubscribe,
      setPendingItemToAdd,
      setShowSubscriptionContractModal,
      setShowWarningRemovedItemsModal,
      updateQuicksaleBasketMember,
    ],
  );

  return {
    createMember,
    onMemberAuthenticate,
  };
};

export default useMemberAuthentication;
