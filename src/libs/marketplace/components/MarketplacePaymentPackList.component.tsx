// @ts-nocheck
import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Immutable } from 'seamless-immutable';

import Analytics from '../../../components/analytics/Analytics.component';

import MarketplacePaymentPackCard from '#libs/marketplace/components/MarketplacePaymentPackCard';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { useMarketplacePassFilters } from '#libs/marketplace/hooks';

import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#libs/payment-packs/types';

type Props = {
  paymentPackByCategory: Immutable<PaymentPackCategoryWithPacks[]>;
  restrictedPaymentPackCategories?: number[];
  isExcludingTax: boolean;
  selectedCategories: (number | null)[];
  searchedPaymentPack: number[] | null;
  pushPackCheckout: (id: number) => void;
  setSelectedPass: (id: number) => void;
  hideCredits?: boolean;
};

type PaymentPackCardProps = {
  pack: PaymentPack;
  isExcludingTax: boolean;
  pushPackCheckout: (id: number) => void;
  setSelectedPass: (id: number) => void;
  hideCredits?: boolean;
};

const PaymentPackCard = (props: PaymentPackCardProps) => {
  const {
    pack,
    isExcludingTax,
    pushPackCheckout,
    setSelectedPass,
    hideCredits,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const handleMobileClick = useCallback(() => {
    if (isMobile) {
      setSelectedPass(pack.id);
      Analytics.selectPaymentPack(pack);
    }
  }, [isMobile, setSelectedPass, pack]);

  const handleOpenDetailDialog = useCallback(() => {
    setSelectedPass(pack.id);
    Analytics.selectPaymentPack(pack);
  }, [setSelectedPass, pack]);

  const handleAddToCart = useCallback(() => {
    pushPackCheckout(pack.id);
    Analytics.addPassToCart(pack, 'payment_pack');
  }, [pushPackCheckout, pack]);

  return (
    <button
      className={classes.paymentPackButtonContainer}
      onClick={handleMobileClick}
      type="button"
    >
      <MarketplacePaymentPackCard
        key={pack.id}
        addToCart={handleAddToCart}
        hideCredits={!!hideCredits}
        isExcludingTax={isExcludingTax}
        onOpenDetailDialog={handleOpenDetailDialog}
        paymentPack={pack}
      />
    </button>
  );
};

export function MarketplacePaymentPackList(props: Props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    pushPackCheckout,
    setSelectedPass,
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    selectedCategories,
    searchedPaymentPack,
    isExcludingTax,
    hideCredits,
  } = props;

  const { filteredPaymentPackByCategory } = useMarketplacePassFilters({
    selectedCategories,
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    fuzzySearchPaymentPackResults: searchedPaymentPack,
  });

  const getAvailableCategoryPacks = useCallback(
    (category: PaymentPackCategoryWithPacks) =>
      category.packs?.filter((pack) => !pack.manager_only),
    [],
  );

  return (
    <>
      {!!filteredPaymentPackByCategory.length && (
        <>
          <Typography
            className={classes.sectionTitle}
            component="h3"
            variant="h6"
          >
            {t('marketplace.passListTitle')}
          </Typography>

          {filteredPaymentPackByCategory.map(
            (category: PaymentPackCategoryWithPacks) =>
              !!getAvailableCategoryPacks(category).length && (
                <div
                  key={category.id}
                  className={!category.name ? classes.noCategory : ''}
                >
                  {category.name && (
                    <Typography
                      className={classes.sectionTitleWithDivider}
                      component="h3"
                      variant="subtitle1"
                    >
                      {category.name}
                    </Typography>
                  )}

                  <div className={classes.passesItemsContainer}>
                    {getAvailableCategoryPacks(category).map((pack) => (
                      <PaymentPackCard
                        key={pack.id}
                        hideCredits={!!hideCredits}
                        isExcludingTax={isExcludingTax}
                        pack={pack}
                        pushPackCheckout={pushPackCheckout}
                        setSelectedPass={setSelectedPass}
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </>
      )}
    </>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  sectionTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  sectionTitleWithDivider: {
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
  noCategory: {
    marginTop: theme.spacing(5),
  },
  passesItemsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: '230px',
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
  paymentPackButtonContainer: {
    outline: 'none',
    border: 'none',
    background: 'none',
    padding: 0,
  },
}));

export default MarketplacePaymentPackList;
