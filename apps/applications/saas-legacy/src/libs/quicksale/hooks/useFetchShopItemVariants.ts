import { fetchShopItemVariantList } from '#src/libs/shop/actions/shopItemReworked';
import {
  getShopItemVariantListLoading,
  getShopItemVariantState,
} from '#src/libs/shop/selectors';
import { RootState } from '#src/reducers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useFetchShopItemVariants = (itemId: number) => {
  const dispatch = useDispatch();

  const fetchVariants = useCallback(() => {
    dispatch(
      fetchShopItemVariantList({
        id: itemId,
        page_size: 0,
        page: 1,
        is_variant: true,
      }),
    );
  }, [itemId, dispatch]);

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
