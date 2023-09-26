import React, { useMemo } from 'react';

import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Immutable } from 'seamless-immutable';

import PassSearch from '#components/css-only/Search/PassSearch';
import { MarketplaceCategoryPassFilterOption } from '#libs/marketplace/types';
import { useMarketplacePassFlatLists } from '#libs/marketplace/hooks';

import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';
import { PaymentCombo } from '#libs/payment-combo/types';
import { PaymentPackCategoryWithPacks } from '#libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
import Select from '#components/css-only/Select';
import MarketplaceFilter from '#marketplacecomponents/@RessourceFilter/MarketplaceFilter/MarketplaceFilter.component';

import './styles.css';

type Props = {
  searchFiltersState: {
    type: string;
    selectedCategories: (number | null)[];
    allCategories: MarketplaceCategoryPassFilterOption[];
  };
  searchResultState: {
    query: string;
    paymentPack: number[] | null;
    privatePass: number[] | null;
    paymentCombo: number[] | null;
  };
  paymentComboList: PaymentCombo[];
  hidePaymentPack: boolean;
  hidePrivatePass: boolean;
  hidePaymentCombo: boolean;
  paymentPackByCategory: Immutable<PaymentPackCategoryWithPacks[]>;
  restrictedPaymentPackCategories: number[];
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>;
  restrictedPrivatePassCategories: number[];
  isExcludingTax: boolean;
  addPaymentPackToCart: (packId: number) => void;
  addPrivatePassToCart: (packId: number) => void;
  addComboToCart: (comboId: number) => void;
  onSearchPressEnter: (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => void;
  onShowPaymentPackDetail: (id: number) => void;
  onShowPrivatePassDetail: (id: number) => void;
  onShowPaymentComboDetail: (id: number) => void;
  onClearSearchResult: () => void;
  onChangeType: (value: string) => void;
  onChangeCategory: (options: number[]) => void;
};

const MarketplacePassFilters: React.FC<Props> = React.memo(
  ({
    searchFiltersState,
    searchResultState,
    paymentComboList,
    hidePaymentPack,
    hidePrivatePass,
    hidePaymentCombo,
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    privatePassByCategory,
    restrictedPrivatePassCategories,
    isExcludingTax,
    onSearchPressEnter,
    addPaymentPackToCart,
    addPrivatePassToCart,
    addComboToCart,
    onShowPaymentPackDetail,
    onShowPrivatePassDetail,
    onShowPaymentComboDetail,
    onClearSearchResult,
    onChangeType,
    onChangeCategory,
  }) => {
    const { t } = useTranslation();
    const { filteredPaymentPackList, filteredPrivatePassList } =
      useMarketplacePassFlatLists({
        paymentPackByCategory,
        restrictedPaymentPackCategories,
        privatePassByCategory,
        restrictedPrivatePassCategories,
      });

    const filteredPaymentComboList = useMemo(
      () => paymentComboList.filter((combo) => !hidePaymentCombo && combo),
      [hidePaymentCombo, paymentComboList],
    );

    const searchResultCount = useMemo(
      () =>
        searchResultState.paymentPack?.length +
          searchResultState.privatePass?.length +
          searchResultState.paymentCombo?.length ?? 0,
      [
        searchResultState.paymentCombo?.length,
        searchResultState.paymentPack?.length,
        searchResultState.privatePass?.length,
      ],
    );

    const searchFilterTypeOptions = useMemo(
      () => [
        {
          label: t('marketplace:pass.filters.type.paymentPack'),
          value: 'paymentPack',
        },
        {
          label: t('marketplace:pass.filters.type.privatePass'),
          value: 'privatePass',
        },
      ],
      [t],
    );

    return (
      <>
        <div className="bs-pass-page__pass__filters__search__container">
          <PassSearch
            addPaymentComboToBasket={addComboToCart}
            addPaymentPackToBasket={addPaymentPackToCart}
            addPrivatePassToBasket={addPrivatePassToCart}
            isExcludingTax={isExcludingTax}
            onClearInput={onClearSearchResult}
            onPressEnter={onSearchPressEnter}
            paymentComboList={filteredPaymentComboList}
            paymentPackList={filteredPaymentPackList}
            privatePassList={filteredPrivatePassList}
            showPaymentComboDetail={onShowPaymentComboDetail}
            showPaymentPackDetail={onShowPaymentPackDetail}
            showPrivatePassDetail={onShowPrivatePassDetail}
          />

          <div className="bs-pass-page__pass__filters">
            {!hidePaymentPack && !hidePrivatePass && (
              <Select
                isClearable
                id="bs-pass-page__pass__filters__type_selector"
                onChange={onChangeType}
                options={searchFilterTypeOptions}
                placeholder={t('marketplace:pass.filters.placeholder.type')}
                value={searchFiltersState.type}
              />
            )}

            {!!searchFiltersState.allCategories?.length && (
              <MarketplaceFilter
                id="bs-pass-page__pass__filters__category_selector"
                levelVariant={false}
                onSelect={onChangeCategory}
                options={searchFiltersState.allCategories}
                selectedOptions={searchFiltersState.selectedCategories}
                text={t('marketplace:pass.filters.placeholder.categories')}
              />
            )}
          </div>
        </div>

        {!!searchResultState.query && (
          <div className="bs-pass-page__pass__filters__search__result__text__container">
            <span>
              {t('marketplace:pass.search.result', {
                count: searchResultCount,
                queryText: searchResultState.query,
              })}
            </span>

            <Button
              color="primary"
              onClick={onClearSearchResult}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              {t('marketplace:pass.search.goBack')}
            </Button>
          </div>
        )}
      </>
    );
  },
);

export default MarketplacePassFilters;
