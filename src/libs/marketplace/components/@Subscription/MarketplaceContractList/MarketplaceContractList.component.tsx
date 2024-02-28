import React, { useCallback } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';

import MarketplaceContractCard from '#marketplacecomponents/@Subscription/MarketplaceContractCard';

import { Contract } from '#libs/subscription/types';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { filterSearchedMarketplaceContracts } from '#libs/marketplace/hooks';

import './styles.css';

type Props = {
  isExcludingTax: boolean;
  contractList: Contract[];
  searchedContractIds: number[];
  onAddToCart: (contract: Contract) => void;
  onOpenDetailDialog: (contract: Contract) => void;
};

type ContractListItemProps = {
  contract: Contract;
  isExcludingTax: boolean;
  onAddToCart: (contract: Contract) => void;
  onOpenDetailDialog: (contract: Contract) => void;
};

const MarkeplaceContractListItem: React.FC<ContractListItemProps> = React.memo(
  ({ contract, isExcludingTax, onAddToCart, onOpenDetailDialog }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(
      theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
    );

    const handleMobileClick = useCallback(() => {
      if (isMobile) {
        onOpenDetailDialog(contract);
      }
    }, [isMobile, onOpenDetailDialog, contract]);

    return (
      <button
        className="bs-contract-page__contract__button__container"
        id={`contract-button-container-${contract?.id}`}
        onClick={handleMobileClick}
        type="button"
      >
        <MarketplaceContractCard
          addToCart={onAddToCart}
          contract={contract}
          isExcludingTax={isExcludingTax}
          onOpenDetailDialog={onOpenDetailDialog}
        />
      </button>
    );
  },
);

const MarketplaceContractList: React.FC<Props> = React.memo(
  ({
    contractList,
    searchedContractIds,
    isExcludingTax,
    onAddToCart,
    onOpenDetailDialog,
  }) => {
    const filteredContractList = React.useMemo(
      () =>
        filterSearchedMarketplaceContracts(contractList, searchedContractIds),
      [contractList, searchedContractIds],
    );

    return (
      <div className="bs-contract-page__contract__list__container">
        {!!filteredContractList.length &&
          filteredContractList.map((contract) => (
            <MarkeplaceContractListItem
              key={contract.id}
              contract={contract}
              isExcludingTax={isExcludingTax}
              onAddToCart={onAddToCart}
              onOpenDetailDialog={onOpenDetailDialog}
            />
          ))}
      </div>
    );
  },
);

export default MarketplaceContractList;
