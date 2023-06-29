import React, { useCallback } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Theme, useTheme } from '@material-ui/core';

import MarketplaceContractCard from '#libs/marketplace/components/MarketplaceContractCard';

import { Contract } from '#libs/subscription/types';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { filterSearchedMarketplaceContracts } from '#libs/marketplace/hooks';

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
    const classes = useStyles();
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
        className={classes.contractButtonContainer}
        type="button"
        onClick={handleMobileClick}
      >
        <MarketplaceContractCard
          isExcludingTax={isExcludingTax}
          contract={contract}
          addToCart={onAddToCart}
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
    const classes = useStyles();

    const filteredContractList = React.useMemo(
      () =>
        filterSearchedMarketplaceContracts(contractList, searchedContractIds),
      [contractList, searchedContractIds],
    );

    return (
      <div className={classes.contractItemsContainer}>
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

const useStyles = makeStyles((theme: Theme) => ({
  contractItemsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: '240px',
    gap: theme.spacing(4),
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.LG)]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM)]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridTemplateRows: '160px',
      gap: theme.spacing(2),
    },
  },
  contractButtonContainer: {
    outline: 'none',
    border: 'none',
    background: 'none',
    padding: 0,
  },
}));

export default MarketplaceContractList;
