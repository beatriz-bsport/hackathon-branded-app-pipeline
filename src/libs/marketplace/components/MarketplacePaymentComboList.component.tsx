// @ts-nocheck

import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Analytics from '../../../components/analytics/Analytics.component';

import MarketplacePaymentComboCard from '#libs/marketplace/components/MarketplacePaymentComboCard';
import { useMarketplacePassFilters } from '#libs/marketplace/hooks';

import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  paymentComboList: PaymentCombo[];
  isExcludingTax: boolean;
  searchedPaymentCombo: number[] | null;
  setSelectedPass: (id: number) => void;
  onAddBasket: (comboId: number) => void;
};

type PaymentComboCardProps = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  setSelectedPass: (id: number) => void;
  onAddBasket: (comboId: number) => void;
};

const PaymentComboCard = (props: PaymentComboCardProps) => {
  const { paymentCombo, isExcludingTax, setSelectedPass, onAddBasket } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const handleMobileClick = useCallback(() => {
    if (isMobile) {
      setSelectedPass(paymentCombo.id);
    }
  }, [isMobile, paymentCombo.id, setSelectedPass]);

  const handleAddToCart = useCallback(() => {
    onAddBasket(paymentCombo.id);
    Analytics.addPackToCart(paymentCombo);
  }, [onAddBasket, paymentCombo]);

  const handleOpenDetailDialog = useCallback(
    () => setSelectedPass(paymentCombo.id),
    [paymentCombo.id, setSelectedPass],
  );

  return (
    <MarketplacePaymentComboCard
      key={paymentCombo.id}
      paymentCombo={paymentCombo}
      isExcludingTax={isExcludingTax}
      addToCart={handleAddToCart}
      onClick={handleMobileClick}
      onOpenDetailDialog={handleOpenDetailDialog}
    />
  );
};

export const MarketplacePaymentComboList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    searchedPaymentCombo,
    paymentComboList,
    isExcludingTax,
    onAddBasket,
    setSelectedPass,
  } = props;

  const { filteredPaymentComboList } = useMarketplacePassFilters({
    paymentComboList,
    fuzzySearchPaymentComboResults: searchedPaymentCombo,
  });

  return (
    <>
      <Typography component="h3" variant="h6" className={classes.sectionTitle}>
        {t('marketplace.paymentComboListTitle')}
      </Typography>

      {!!filteredPaymentComboList.length && (
        <div className={classes.passesItemsContainer}>
          {filteredPaymentComboList.map((paymentCombo) => (
            <PaymentComboCard
              key={paymentCombo.id}
              paymentCombo={paymentCombo}
              isExcludingTax={isExcludingTax}
              setSelectedPass={setSelectedPass}
              onAddBasket={onAddBasket}
            />
          ))}
        </div>
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
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: '260px',
    gap: theme.spacing(4),
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.MD)]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM)]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridTemplateRows: '220px',
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

export default MarketplacePaymentComboList;
