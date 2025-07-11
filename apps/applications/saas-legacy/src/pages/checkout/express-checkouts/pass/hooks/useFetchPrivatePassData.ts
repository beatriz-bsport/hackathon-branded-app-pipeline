import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllPrivatePassCategory,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
  fetchPrivatePassRetrieve,
} from '#src/libs/private-service/actions';
import type { RootState } from '#src/reducers';

export const useFetchPrivatePassData = (privatePassId: number) => {
  const dispatch = useDispatch();

  const companyId = useSelector(
    (state: RootState) => state.theme.theme.company,
  );

  useEffect(() => {
    dispatch(fetchPrivatePassRetrieve(privatePassId));
    dispatch(fetchAllPrivatePassCategory(companyId));
    dispatch(fetchMarketplacePrivateServices(companyId));
    dispatch(fetchMarketplacePrivateSlots(companyId));
  }, [privatePassId, dispatch, companyId]);
};
