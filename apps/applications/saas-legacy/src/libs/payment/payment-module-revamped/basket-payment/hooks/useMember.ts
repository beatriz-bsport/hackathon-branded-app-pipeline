import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembership } from '#src/libs/membership/actions';

import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';

import type { Membership } from '#src/libs/membership/types';
import type { OptionCallback } from '#src/state/types';
import { RootState } from '#src/reducers';
import { getMemberDetail } from '#src/libs/member/selectors';

type UseMember = {
  creditAccount: {
    creditAccountBalance: number | null;
  };
  member: {
    handleFetchMember: (options?: OptionCallback<Membership>) => void;
    sepaDefaultEmail: string;
    sepaDefaultName: string;
  };
};

/**
 * Custom hook to manage member operationswithin OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} memberId - The ID of the member.
 * @returns {UseMember} An object containing various functions to handle member operations.
 */
export const useMember = (basketId: string, memberId: number): UseMember => {
  const dispatch = useDispatch();

  const { creditAccountBalance } = useBasketPaymentStoreData(
    basketId,
    memberId,
  );

  const { email: sepaDefaultEmail, name: sepaDefaultName } =
    useSelector((state: RootState) => getMemberDetail(state, memberId)) ?? {};

  const handleFetchMember = useCallback(
    (options?: OptionCallback<Membership>) => {
      if (memberId) dispatch(fetchMembership(memberId, options));
    },
    [dispatch, memberId],
  );

  return {
    creditAccount: {
      creditAccountBalance,
    },
    member: {
      handleFetchMember,
      sepaDefaultEmail,
      sepaDefaultName,
    },
  };
};
