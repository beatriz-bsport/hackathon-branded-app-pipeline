// @ts-nocheck
import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Immutable } from 'seamless-immutable';

import Analytics from '../../../components/analytics/Analytics.component';

import MarketplacePrivatePassCard from '#libs/marketplace/components/MarketplacePrivatePassCard';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { useMarketplacePassFilters } from '#libs/marketplace/hooks';

import {
  PrivatePass,
  PrivatePassCategoryWithPasses,
} from '#libs/private-service/types';

type Props = {
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>;
  restrictedPrivatePassCategories?: number[];
  isExcludingTax: boolean;
  selectedCategories: (number | null)[];
  searchedPrivatePass: number[] | null;
  onAddBasket: (privatePassId: number) => void;
  setSelectedPass: (id: number) => void;
};

type PrivatePassCardProps = {
  pass: PrivatePass;
  isExcludingTax: boolean;
  onAddBasket: (privatePassId: number) => void;
  setSelectedPass: (id: number) => void;
};

const PrivatePassCard = (props: PrivatePassCardProps) => {
  const { pass, isExcludingTax, onAddBasket, setSelectedPass } = props;
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const handleClickMobile = useCallback(() => {
    if (isMobile) {
      setSelectedPass(pass.id);
    }
  }, [isMobile, pass.id, setSelectedPass]);

  const handleOpenDetailDialog = useCallback(() => {
    setSelectedPass(pass.id);
  }, [pass.id, setSelectedPass]);

  const handleAddToCart = useCallback(() => {
    onAddBasket(pass.id);
    Analytics.addPrivatePassToCart(pass);
  }, [onAddBasket, pass]);

  return (
    <button
      className={classes.privatePassButtonContainer}
      type="button"
      onClick={handleClickMobile}
    >
      <MarketplacePrivatePassCard
        key={pass.id}
        privatePass={pass}
        isExcludingTax={isExcludingTax}
        onOpenDetailDialog={handleOpenDetailDialog}
        addToCart={handleAddToCart}
      />
    </button>
  );
};

export const MarketplacePrivatePassList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    selectedCategories,
    privatePassByCategory,
    searchedPrivatePass,
    restrictedPrivatePassCategories,
    isExcludingTax,
    setSelectedPass,
    onAddBasket,
  } = props;

  const { filteredPrivatePassByCategory } = useMarketplacePassFilters({
    selectedCategories,
    privatePassByCategory,
    restrictedPrivatePassCategories,
    fuzzySearchPrivatePassResults: searchedPrivatePass,
  });

  return (
    <>
      {!!filteredPrivatePassByCategory.length && (
        <>
          <Typography
            component="h3"
            variant="h6"
            className={classes.sectionTitle}
          >
            {t('marketplace.privatePassListTitle')}
          </Typography>

          {filteredPrivatePassByCategory.map((category) => {
            return (
              <div
                key={category.id}
                className={!category.name ? classes.noCategory : null}
              >
                {category?.name && (
                  <Typography
                    component="h3"
                    variant="subtitle1"
                    className={classes.sectionTitleWithDivider}
                  >
                    {category.name}
                  </Typography>
                )}

                <div className={classes.passesItemsContainer}>
                  {category.passes.map((pass) => (
                    <PrivatePassCard
                      key={pass.id}
                      pass={pass}
                      isExcludingTax={isExcludingTax}
                      setSelectedPass={setSelectedPass}
                      onAddBasket={onAddBasket}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

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
  privatePassButtonContainer: {
    outline: 'none',
    border: 'none',
    background: 'none',
    padding: 0,
  },
}));

export default MarketplacePrivatePassList;
