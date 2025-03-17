import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '#src/reducers';
import { OptionCallback } from '#src/state/types';

import {
  fetchMemberPaymentMethodList as fetchMemberPaymentMethodListAction,
  resetPaymentMethodList as resetPaymentMethodListAction,
} from '#src/libs/payment/payment-module-revamped/actions';
import { getPaymentMethodList } from '#src/libs/payment/payment-module-revamped/selectors';
import { PaymentMethod } from '#src/libs/payment/types';

type UsePaymentMethodListProvider = {
  isPaymentMethodListLoading: boolean;
  paymentMethodListAll: Array<PaymentMethod>;
  paymentMethodListError: Error | null | undefined;
  handleFetchMemberPaymentMethodList: (options?: OptionCallback) => void;
  hasFetchedPaymentMethodList: boolean;
  resetPaymentMethodList: () => void;
};
/***
 * @description Provider for payment method list
 * Define context for everything related to payment methods attached to a member
 *
 * Only concerns card and SEPA payment methods
 * @param memberId The member ID
 * ***/
export const useMemberPaymentMethodListProvider = ({
  memberId,
}: any): UsePaymentMethodListProvider => {
  const paymentMethodList = useSelector((state: RootState) =>
    getPaymentMethodList(state, memberId),
  );
  const dispatch = useDispatch();

  /***
   * @description Fetch the list of all saved payment methods for a member
   * Only concerns card and SEPA payment methods
   * ***/
  const handleFetchMemberPaymentMethodList = React.useCallback(
    (options?: any) => {
      if (memberId) {
        dispatch(
          fetchMemberPaymentMethodListAction(
            {
              memberId,
            },
            options,
          ),
        );
      }
    },
    [dispatch, memberId],
  );

  const resetPaymentMethodList = React.useCallback(() => {
    dispatch(resetPaymentMethodListAction(memberId));
  }, [dispatch, memberId]);

  return {
    isPaymentMethodListLoading: paymentMethodList?.loading,
    paymentMethodListAll: paymentMethodList?.paymentMethods || [],
    paymentMethodListError: paymentMethodList?.error,
    handleFetchMemberPaymentMethodList,
    hasFetchedPaymentMethodList: paymentMethodList?.hasFetchSucceeded,
    resetPaymentMethodList,
  };
};
