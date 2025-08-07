import { fetchShopItemVariantList } from '#src/libs/shop/actions/shopItemReworked';
import {
  getShopItemVariantListLoading,
  getShopItemVariantState,
} from '#src/libs/shop/selectors';
import { RootState } from '#src/reducers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchShopItemVariants = (
  itemId: number,
  establishmentBillingGroupId?: number,
) => {
  const dispatch = useDispatch();

  const fetchVariants = useCallback(() => {
    const params = {
      id: itemId,
      page_size: 0,
      page: 1,
      is_variant: true,
      ...(establishmentBillingGroupId && {
        establishment_billing_group: establishmentBillingGroupId,
      }),
    };

    dispatch(fetchShopItemVariantList(params));
  }, [itemId, establishmentBillingGroupId, dispatch]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const variants = useSelector((state: RootState) =>
    getShopItemVariantState(state, itemId),
  ).variants;

  const loading = useSelector((state: RootState) =>
    getShopItemVariantListLoading(state),
  );

  const error = useSelector(
    (state: RootState) => state.shopReworked.shopItemReworked.itemVariant.error,
  );

  return { variants, loading, error };
};
