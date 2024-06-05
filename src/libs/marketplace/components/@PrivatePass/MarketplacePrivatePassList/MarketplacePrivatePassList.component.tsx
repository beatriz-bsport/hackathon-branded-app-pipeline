import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useMediaQuery, useTheme } from '@material-ui/core';
import { Immutable } from 'seamless-immutable';


import MarketplacePrivatePassCard from '#src/libs/marketplace/components/@PrivatePass/MarketplacePrivatePassCard';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import { useMarketplacePassFilters } from '#src/libs/marketplace/hooks';

import {
  PrivatePass,
  PrivatePassCategoryWithPasses,
} from '#src/libs/private-service/types';
// @ts-expect-error
import Analytics from '../../../../../components/analytics/Analytics.component';

import './styles.css';

type Props = {
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>;
  restrictedPrivatePassCategories?: number[];
  isExcludingTax: boolean;
  selectedCategories: (number | null)[];
  searchedPrivatePass: number[] | null;
  onAddBasket: (privatePassId: number) => void;
  setSelectedPass: (id: number) => void;
  hideCredits?: boolean;
};

type PrivatePassCardProps = {
  pass: PrivatePass;
  isExcludingTax: boolean;
  onAddBasket: (privatePassId: number) => void;
  setSelectedPass: (id: number) => void;
  hideCredits?: boolean;
};

const PrivatePassCard: React.FC<PrivatePassCardProps> = React.memo(
  ({ pass, isExcludingTax, onAddBasket, setSelectedPass, hideCredits }) => {
    const theme = useTheme();
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
        className="bs-pass-page__private__pass__list__card__button"
        id={`private-pass-button-container-${pass?.id}`}
        onClick={handleClickMobile}
        type="button"
      >
        <MarketplacePrivatePassCard
          key={pass.id}
          addToCart={handleAddToCart}
          hideCredits={!!hideCredits}
          isExcludingTax={isExcludingTax}
          onOpenDetailDialog={handleOpenDetailDialog}
          privatePass={pass}
        />
      </button>
    );
  },
);

export const MarketplacePrivatePassList: React.FC<Props> = ({
  selectedCategories,
  privatePassByCategory,
  searchedPrivatePass,
  restrictedPrivatePassCategories,
  isExcludingTax,
  setSelectedPass,
  onAddBasket,
  hideCredits,
}) => {
  const { t } = useTranslation('translation');

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
          <div className="bs-pass-page__private__pass__list__title">
            {t('translation:marketplace.privatePassListTitle')}
          </div>

          {filteredPrivatePassByCategory.map((category) => {
            return (
              <div
                key={category.id}
                className={
                  !category.name
                    ? 'bs-pass-page__private__pass__list__no__category'
                    : null
                }
              >
                {category?.name && (
                  <div className="bs-pass-page__private__pass__list__title--with-divider">
                    {category.name}
                  </div>
                )}

                <div className="bs-pass-page__private__pass__list__container">
                  {category.passes.map((pass) => (
                    <PrivatePassCard
                      key={pass.id}
                      hideCredits={!!hideCredits}
                      isExcludingTax={isExcludingTax}
                      onAddBasket={onAddBasket}
                      pass={pass}
                      setSelectedPass={setSelectedPass}
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

export default React.memo(MarketplacePrivatePassList);
