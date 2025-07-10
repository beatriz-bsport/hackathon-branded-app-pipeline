import { fetchOne } from '#src/libs/payment-packs/actions';
import { fetchPrivatePassAsConsumerList } from '#src/libs/private-service/actions';
import { RootState } from '#src/reducers';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchPaymentPackData = (paymentPackId: number) => {
  const dispatch = useDispatch();

  const companyId = useSelector(
    (state: RootState) => state.theme.theme.company,
  );

  useEffect(() => {
    dispatch(fetchOne(paymentPackId));
    dispatch(fetchPrivatePassAsConsumerList(companyId));
  }, [paymentPackId, dispatch, companyId]);
};
