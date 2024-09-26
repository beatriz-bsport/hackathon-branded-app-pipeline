import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '#src/reducers';
import { OptionCallback } from '#src/state/types';

import {
  fetchMemberPaymentMethodList as fetchMemberPaymentMethodListAction,
  resetInvoicePaymentMethodList as resetInvoicePaymentMethodListAction,
} from '#src/libs/payment/payment-module-revamped/actions';
import { getPaymentMethodList } from '#src/libs/payment/payment-module-revamped/selectors';
import { PaymentMethod } from '#src/libs/payment/types';

type UseInvoicePaymentMethodListProvider = {
  isPaymentMethodListLoading: boolean;
  paymentMethodListAll: Array<PaymentMethod>;
  paymentMethodListError: Error;
  handleFetchMemberPaymentMethodList: (options?: OptionCallback) => void;
  hasFetchedPaymentMethodList: boolean;
  resetPaymentMethodList: () => void;
};
/***
 * @description Provider for invoice payment method list
 * Define context for everything related to payment methods attached to a member
 *
 * Only concerns card and SEPA payment methods
 * @param memberId The member ID
 * ***/
export const useInvoicePaymentMethodListProvider = ({
  memberId,
}: any): UseInvoicePaymentMethodListProvider => {
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
    dispatch(resetInvoicePaymentMethodListAction(memberId));
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
