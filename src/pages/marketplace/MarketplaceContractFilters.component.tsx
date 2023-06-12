import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import {
  BaseAdditionalData,
  SearchItemData,
} from '#components/css-only/Search/Search.component';
import ContractSearch from '#components/css-only/Search/ContractSearch';
import { ContractWithPaymentPack } from '#libs/subscription/types';

type Props = {
  searchResultState: {
    query: string;
    contract: number[] | null;
  };
  contractList: ContractWithPaymentPack[];
  isExcludingTax: boolean;
  onSearchPressEnter: (
    searchResult: SearchItemData<BaseAdditionalData>[],
    searchText: string,
  ) => void;
  addContractToCart: (contract: ContractWithPaymentPack) => void;
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
  const classes = useStyles();

  return (
    <>
      <div className={classes.searchContainer}>
        <ContractSearch
          contractList={contractList}
          isExcludingTax={isExcludingTax}
          onPressEnter={onSearchPressEnter}
          onClearInput={onClearSearchResult}
          showContractDetail={onShowContractDetail}
          addContractToBasket={addContractToCart}
        />
      </div>

      {!!searchResultState.query && (
        <div className={classes.searchResultTextContainer}>
          <span>
            {t('marketplace:pass.search.result', {
              count: searchResultState.contract?.length ?? 0,
              queryText: searchResultState.query,
            })}
          </span>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={onClearSearchResult}
          >
            {t('marketplace:pass.search.goBack')}
          </Button>
        </div>
      )}
    </>
  );
};

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
    gridTemplateColumns: 'repeat(2, 250px)',
    gap: theme.spacing(2),
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
      gridTemplateColumns: '250px 350px',
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

export default React.memo(MarketplaceContractFilters);
