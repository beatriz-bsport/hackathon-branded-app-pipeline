import React from 'react';

import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';
import ContractSearch from '#components/css-only/Search/ContractSearch';
import { Contract } from '#libs/subscription/types';

import './styles.css';

type Props = {
  searchResultState: {
    query: string;
    contractIds: number[] | null;
  };
  contractList: Contract[];
  isExcludingTax: boolean;
  onSearchPressEnter: (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => void;
  addContractToCart: (contract: Contract) => void;
  onShowContractDetail: (id: number) => void;
  onClearSearchResult: () => void;
};

const MarketplaceContractFilters: React.FC<Props> = ({
  searchResultState,
  contractList,
  isExcludingTax,
  onSearchPressEnter,
  addContractToCart,
  onShowContractDetail,
  onClearSearchResult,
}) => {
  const { t } = useTranslation('marketplace');

  return (
    <>
      <div className="bs-contract-page__pass__filters__search__container">
        <ContractSearch
          addContractToBasket={addContractToCart}
          contractList={contractList}
          isExcludingTax={isExcludingTax}
          onClearInput={onClearSearchResult}
          onPressEnter={onSearchPressEnter}
          showContractDetail={onShowContractDetail}
        />
      </div>

      {!!searchResultState.query && (
        <div className="bs-contract-page__pass__filters__search__result__text__container">
          <span>
            {t('marketplace:pass.search.result', {
              count: searchResultState.contractIds?.length ?? 0,
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
};

export default React.memo(MarketplaceContractFilters);
