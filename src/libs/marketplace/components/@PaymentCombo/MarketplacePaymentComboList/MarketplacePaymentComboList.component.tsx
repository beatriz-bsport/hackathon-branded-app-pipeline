import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';

import MarketplacePaymentComboCard from '#src/libs/marketplace/components/@PaymentCombo/MarketplacePaymentComboCard';
import { useMarketplacePassFilters } from '#src/libs/marketplace/hooks';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';

import { PaymentCombo } from '#src/libs/payment-combo/types';

import analyticsUtils from '#src/components/analytics/analytics';

import './styles.css';

export type Props = {
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

const PaymentComboCard: React.FC<PaymentComboCardProps> = React.memo(
  ({ paymentCombo, isExcludingTax, setSelectedPass, onAddBasket }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(
      theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
    );

    const handleMobileClick = useCallback(() => {
      if (isMobile) {
        setSelectedPass(paymentCombo.id);
        analyticsUtils.viewBuyableItem(paymentCombo);
      }
    }, [isMobile, paymentCombo, setSelectedPass]);

    const handleAddToCart = useCallback(() => {
      onAddBasket(paymentCombo.id);
      analyticsUtils.addItemToCart(paymentCombo);
    }, [onAddBasket, paymentCombo]);

    const handleOpenDetailDialog = useCallback(() => {
      setSelectedPass(paymentCombo.id);
      analyticsUtils.viewBuyableItem(paymentCombo);
    }, [paymentCombo, setSelectedPass]);

    return (
      <MarketplacePaymentComboCard
        key={paymentCombo.id}
        addToCart={handleAddToCart}
        isExcludingTax={isExcludingTax}
        onClick={handleMobileClick}
        onOpenDetailDialog={handleOpenDetailDialog}
        paymentCombo={paymentCombo}
      />
    );
  },
);

export const MarketplacePaymentComboList: React.FC<Props> = ({
  searchedPaymentCombo,
  paymentComboList,
  isExcludingTax,
  onAddBasket,
  setSelectedPass,
}) => {
  const { t } = useTranslation('translation');

  const { filteredPaymentComboList } = useMarketplacePassFilters({
    paymentComboList,
    fuzzySearchPaymentComboResults: searchedPaymentCombo,
  });

  return (
    <>
      <div className="bs-pass-page__combo__list__title">
        {t('translation:marketplace.paymentComboListTitle')}
      </div>

      {!!filteredPaymentComboList.length && (
        <div className="bs-pass-page__combo__list__container">
          {filteredPaymentComboList.map((paymentCombo) => (
            <PaymentComboCard
              key={paymentCombo.id}
              isExcludingTax={isExcludingTax}
              onAddBasket={onAddBasket}
              paymentCombo={paymentCombo}
              setSelectedPass={setSelectedPass}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default React.memo(MarketplacePaymentComboList);
