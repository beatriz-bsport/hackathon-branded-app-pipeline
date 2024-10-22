import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Immutable } from 'seamless-immutable';

import MarketplacePaymentPackCard from '#src/libs/marketplace/components/@PaymentPack/MarketplacePaymentPackCard';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import { useMarketplacePassFilters } from '#src/libs/marketplace/hooks';

import {
  PaymentPack,
  PaymentPackCategoryWithPacks,
} from '#src/libs/payment-packs/types';

import analyticsUtils from '#src/components/analytics/analytics';

import './styles.css';

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

const PaymentPackCard: React.FC<PaymentPackCardProps> = React.memo(
  ({
    pack,
    isExcludingTax,
    pushPackCheckout,
    setSelectedPass,
    hideCredits,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(
      theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
    );

    const handleMobileClick = useCallback(() => {
      if (isMobile) {
        setSelectedPass(pack.id);
        analyticsUtils.showPass(pack);
      }
    }, [isMobile, setSelectedPass, pack]);

    const handleOpenDetailDialog = useCallback(() => {
      setSelectedPass(pack.id);
      analyticsUtils.showPass(pack);
    }, [setSelectedPass, pack]);

    const handleAddToCart = useCallback(() => {
      pushPackCheckout(pack.id);
      analyticsUtils.showPass(pack);
    }, [pushPackCheckout, pack]);

    return (
      <button
        className="bs-pass-page__payment__pack__list__card__button"
        id={`payment-pack-button-container-${pack?.id}`}
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
  },
);

export const MarketplacePaymentPackList: React.FC<Props> = ({
  pushPackCheckout,
  setSelectedPass,
  paymentPackByCategory,
  restrictedPaymentPackCategories,
  selectedCategories,
  searchedPaymentPack,
  isExcludingTax,
  hideCredits,
}) => {
  const { t } = useTranslation('translation');

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
          <div className="bs-pass-page__payment__pack__list__title">
            {t('translation:marketplace.passListTitle')}
          </div>

          {filteredPaymentPackByCategory.map(
            (category: PaymentPackCategoryWithPacks) =>
              !!getAvailableCategoryPacks(category).length && (
                <div
                  key={category.id}
                  className={
                    !category.name
                      ? 'bs-pass-page__payment__pack__list__no__category'
                      : ''
                  }
                >
                  {category.name && (
                    <div className="bs-pass-page__payment__pack__list__title--with-divider">
                      {category.name}
                    </div>
                  )}

                  <div className="bs-pass-page__payment__pack__list__container">
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
};

export default MarketplacePaymentPackList;
