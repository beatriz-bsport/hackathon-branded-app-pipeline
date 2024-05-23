import { useCallback, useMemo, useState } from 'react';
import uniqBy from 'lodash/uniqBy';

import type { ShopItem } from '#libs/shop/types';

type ActiveFilterState = {
  company: string | null;
  color: string | null;
  size: string | null;
};

/**
 * Manage all filters data for inventory tab in item details page
 * @param shopItemVariantList The list of variants from the base item
 */
export default function useShopItemDetailInventoryFilters(
  shopItemVariantList: ShopItem[],
) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilterState>({
    company: null,
    color: null,
    size: null,
  });

  const safeShopItemVariantList = useMemo(
    () => (shopItemVariantList ?? []).filter((item) => !!item?.company),
    [shopItemVariantList],
  );

  const companyFilterOptionList = useMemo(
    () =>
      uniqBy(safeShopItemVariantList ?? [], 'company')
        .map((variant) => ({
          label: variant.company.toString(), // TODO company_details.name MA
          value: variant.company.toString(),
        }))
        .filter((option) => !!option.value),
    [safeShopItemVariantList],
  );

  const variantSizeFilterOptionList = useMemo(
    () =>
      uniqBy(safeShopItemVariantList ?? [], 'size')
        .map((variant) => ({
          label: variant.size,
          value: variant.size,
        }))
        .filter((option) => !!option.value),
    [safeShopItemVariantList],
  );

  const variantColorFilterOptionList = useMemo(
    () =>
      uniqBy(safeShopItemVariantList ?? [], 'color').map((variant) => ({
        label: variant.color,
        value: variant.color,
      })),
    [safeShopItemVariantList],
  );

  const filteredVariantList = useMemo(() => {
    let baseVariantList = safeShopItemVariantList ?? [];

    if (activeFilters.company) {
      baseVariantList = baseVariantList.filter(
        (variant) => variant.company === parseInt(activeFilters.company, 10),
      );
    }
    if (activeFilters.color) {
      baseVariantList = baseVariantList.filter(
        (variant) => variant.color === activeFilters.color,
      );
    }
    if (activeFilters.size) {
      baseVariantList = baseVariantList.filter(
        (variant) => variant.size === activeFilters.size,
      );
    }
    return baseVariantList;
  }, [activeFilters, safeShopItemVariantList]);

  const handleFilterValueChange = useCallback(
    (filterKey: 'company' | 'color' | 'size') =>
      (option: { label: string; value: string } | null) => {
        if (option) {
          setActiveFilters((prevState) => ({
            ...prevState,
            [filterKey]: option.value,
          }));
        } else {
          setActiveFilters((prevState) => ({
            ...prevState,
            [filterKey]: null,
          }));
        }
      },
    [],
  );

  return {
    companyFilterOptionList,
    variantSizeFilterOptionList,
    variantColorFilterOptionList,
    filteredVariantList,
    handleFilterValueChange,
  };
}
