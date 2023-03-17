import { useCallback, useMemo } from 'react';

import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#libs/payment-packs/types';
import {
  PrivatePass,
  PrivatePassCategoryWithPasses,
} from '#libs/private-service/types';
import {
  MarketplacePassFiltersHookOptions,
  MarketplacePassSearchHookOptions,
} from '#libs/marketplace/types';
import { PaymentCombo } from '#libs/payment-combo/types';

/**
 * Marketplace filter hook for pass page - returns the associated filtered list according to pass filters
 * @param {MarketplacePassFiltersHookOptions}
 */
export const useMarketplacePassFilters = (
  params: MarketplacePassFiltersHookOptions,
) => {
  const {
    selectedCategories,
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    fuzzySearchPaymentPackResults,
    privatePassByCategory,
    restrictedPrivatePassCategories,
    fuzzySearchPrivatePassResults,
    paymentComboList,
    fuzzySearchPaymentComboResults,
  } = params;

  const getFilteredPaymentPackByCategory = useCallback(() => {
    let filteredPaymentPackByCategory = paymentPackByCategory ?? [];

    // if specific categories selected in BO settings return associated categories
    if (restrictedPaymentPackCategories?.length) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
        (paymentPackCategory) =>
          restrictedPaymentPackCategories.includes(paymentPackCategory.id),
      );
    }

    // handle filter by category case
    if (selectedCategories?.length) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
        (category) =>
          selectedCategories.find((selected) => {
            /*
             * Handle the empty category case:
             * if having no category name, then its the "No category" option
             * -> we always return true so its correctly added ('' === '')
             * {
             *   label: t('marketplace:pass.filters.noCategory'),
             *   value: '',
             * }
             */
            if (!category.name) {
              return selected.value === category.name;
            }
            return parseInt(selected.value) === category.id;
          }),
      );
    }

    // only return categories that have items in it
    filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
      (category) => category.packs.length,
    );

    // handle fuzzy search
    if (fuzzySearchPaymentPackResults) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory
        .map((paymentPackCategory) => {
          return {
            ...paymentPackCategory,
            packs: paymentPackCategory.packs.filter((paymentPack) =>
              fuzzySearchPaymentPackResults.some(
                (searchItem) => searchItem === paymentPack.id,
              ),
            ),
          };
        })
        .filter((category) => category.packs.length);
    }

    return filteredPaymentPackByCategory;
  }, [
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    selectedCategories,
    fuzzySearchPaymentPackResults,
  ]);

  const getFilteredPrivatePassByCategory = useCallback(() => {
    let filteredPrivatePassByCategory = privatePassByCategory ?? [];

    // if specific categories selected in BO settings return associated categories
    if (restrictedPrivatePassCategories?.length) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
        (privatePassCategory) =>
          restrictedPrivatePassCategories.includes(privatePassCategory.id),
      );
    }

    // handle filter by category case
    if (selectedCategories?.length) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
        (category) =>
          selectedCategories.find((selected) => {
            /*
             * Handle the empty category case:
             * if having no category name, then its the "No category" option
             * -> we always return true so its correctly added ('' === '')
             * {
             *   label: t('marketplace:pass.filters.noCategory'),
             *   value: '',
             * }
             */
            if (!category.name) {
              return selected.value === category.name;
            }
            return parseInt(selected.value) === category.id;
          }),
      );
    }

    // only return categories that have items in it
    filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
      (category) => category.passes.length,
    );

    // handle fuzzy search
    if (fuzzySearchPrivatePassResults) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory
        .map((privatePassCategory) => {
          return {
            ...privatePassCategory,
            passes: privatePassCategory.passes.filter((privatePass) =>
              fuzzySearchPrivatePassResults.some(
                (searchItem) => searchItem === privatePass.id,
              ),
            ),
          };
        })
        .filter((category) => category.passes.length);
    }

    return filteredPrivatePassByCategory;
  }, [
    privatePassByCategory,
    restrictedPrivatePassCategories,
    selectedCategories,
    fuzzySearchPrivatePassResults,
  ]);

  const getFilteredPaymentComboList = useCallback(() => {
    let filteredPaymentComboList = paymentComboList ?? [];

    if (fuzzySearchPaymentComboResults) {
      filteredPaymentComboList = filteredPaymentComboList.filter(
        (paymentCombo) =>
          fuzzySearchPaymentComboResults.some(
            (searchItem) => searchItem === paymentCombo.id,
          ),
      );
    }

    return filteredPaymentComboList;
  }, [paymentComboList, fuzzySearchPaymentComboResults]);

  const filteredPaymentPackByCategory: PaymentPackCategoryWithPacks[] =
    getFilteredPaymentPackByCategory();

  const filteredPrivatePassByCategory: PrivatePassCategoryWithPasses[] =
    getFilteredPrivatePassByCategory();

  const filteredPaymentComboList: PaymentCombo[] =
    getFilteredPaymentComboList();

  return {
    filteredPaymentPackByCategory,
    filteredPrivatePassByCategory,
    filteredPaymentComboList,
  };
};

/**
 * Marketplace search data - returns the associated elements according to BO tab category settings if any
 * @param {MarketplacePassFiltersHookOptions}
 */
export const useMarketplacePassFlatLists = (
  params: MarketplacePassSearchHookOptions,
) => {
  const {
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    privatePassByCategory,
    restrictedPrivatePassCategories,
  } = params;

  const filteredPaymentPackList = useMemo(() => {
    if (paymentPackByCategory?.length) {
      return paymentPackByCategory
        .map((category: PaymentPackCategoryWithPacks) => category.packs)
        .flat()
        .filter((pack: PaymentPack) =>
          restrictedPaymentPackCategories
            ? restrictedPaymentPackCategories.some((p) => p === pack.category)
            : pack,
        );
    }
    return [];
  }, [paymentPackByCategory, restrictedPaymentPackCategories]);

  const filteredPrivatePassList = useMemo(() => {
    if (privatePassByCategory?.length) {
      return privatePassByCategory
        .map((category: PrivatePassCategoryWithPasses) => category.passes)
        .flat()
        .filter((pass: PrivatePass) =>
          restrictedPrivatePassCategories
            ? restrictedPrivatePassCategories.some((p) => p === pass.category)
            : pass,
        );
    }
    return [];
  }, [privatePassByCategory, restrictedPrivatePassCategories]);

  return { filteredPaymentPackList, filteredPrivatePassList };
};
