import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import classNames from 'classnames';
import { Immutable } from 'seamless-immutable';

import PassSearch from '#components/css-only/Search/PassSearch';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
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
import MarketplaceFilter from '#libs/marketplace/components/MarketplaceFilter/MarketplaceFilter.component';

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
    const classes = useStyles();
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
        <div className={classes.searchContainer}>
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

          <div
            className={classNames(
              classes.searchFilters,
              'bs-marketplace-pass-filters',
            )}
          >
            {!hidePaymentPack && !hidePrivatePass && (
              <Select
                isClearable
                onChange={onChangeType}
                options={searchFilterTypeOptions}
                placeholder={t('marketplace:pass.filters.placeholder.type')}
                value={searchFiltersState.type}
              />
            )}

            {!!searchFiltersState.allCategories?.length && (
              <MarketplaceFilter
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
          <div className={classes.searchResultTextContainer}>
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

const useStyles = makeStyles((theme: Theme) => ({
  searchContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    width: 'fit-content',
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM)]: {
      width: '100%',
    },
  },
  searchFilters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, auto)',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
      gridTemplateColumns: 'repeat(2, auto)',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM)]: {
      gridTemplateColumns: '2fr 3fr',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.XS)]: {
      gridTemplateColumns: '1fr',
    },
  },
  selectedCategoriesCount: {
    background: theme.palette.primary.main,
    borderRadius: '99px',
    margin: 0,
    alignSelf: 'center',
    padding: '2px',
    color: theme.palette.primary.contrastText,
    height: theme.spacing(3),
    width: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    gap: theme.spacing(2),
  },
}));

export default MarketplacePassFilters;
