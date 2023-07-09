// @ts-nocheck
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Style } from '@material-ui/icons';

import { useMediaQuery, useTheme } from '@material-ui/core';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ToolTip from '#components/Tooltip.component';
import Card from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import type { PrivatePass } from '#libs/private-service/types';
import { CardSize } from '#components/css-only/Card/types';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';

import { useValidityInfoForPrivatePassCard } from '../../utils/private-pass';
import { getCreditFactor } from '#libs/theme/selectors';
import './styles.css';

export type Props = {
  privatePass: PrivatePass;
  isExcludingTax: boolean;
  addToCart: () => void;
  onOpenDetailDialog: () => void;
  hideCredits?: boolean;
};

const MarketplacePrivatePassCard: React.FC<Props> = ({
  privatePass,
  isExcludingTax,
  addToCart,
  onOpenDetailDialog,
  hideCredits,
}) => {
  const { t } = useTranslation(['marketplace']);
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      addToCart();
    },
    [addToCart],
  );

  return (
    <Card size={CardSize.AUTO} classes={{ 'bs-pass-card': 'bs-pass-card' }}>
      <Content
        padding
        classes={{ 'bs-pass-card-content': 'bs-pass-card-content' }}
      >
        <Grid classes={{ 'bs-pass-card__grid': 'bs-pass-card__grid' }}>
          <Item
            alignment={Alignment.FLEX_START}
            justification={
              isMobile ? Justification.SPACE_BETWEEN : Justification.FLEX_START
            }
            columnEnd={1}
          >
            <div className="bs-pass-card__title">
              {!!privatePass?.linked_payment_pack && (
                <ToolTip title={t('genericCard.title.universalPassMessage')}>
                  <Style className="bs-pass-card__title__icon" />
                </ToolTip>
              )}
              {privatePass.name}
            </div>
            {!hideCredits && (
              <div className="bs-pass-card__subtitle">
                {t('genericCard.credits.availableCredit', {
                  count: privatePass.credits / getCreditFactor(),
                })}
              </div>
            )}
            {privatePass.description && (
              <div className="bs-pass-card__description">
                {privatePass.description}
              </div>
            )}
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-pass-card__validity">
              <div className="bs-pass-card__validity__content">
                {useValidityInfoForPrivatePassCard(privatePass)}
              </div>
            </div>
            <Price
              tax={privatePass.tax}
              isExcludingTax={isExcludingTax}
              amount={privatePass.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
            >
              <button
                type="button"
                className="bs-pass-card__price-icon"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon />
              </button>
            </Price>
          </Item>
        </Grid>
        <Item
          justification={Justification.SPACE_BETWEEN}
          direction={Direction.ROW}
          classes={{ 'bs-pass-card__footer': 'bs-pass-card__footer' }}
        >
          <button
            type="button"
            className="bs-pass-card__left-button"
            onClick={onOpenDetailDialog}
          >
            <div className="bs-pass-card__left-button__content">
              <VisibilityIcon className="bs-pass-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            type="button"
            className="bs-pass-card__right-button"
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export const MarketplacePrivatePassCardForStorybook = marketplaceCssHoc()(
  MarketplacePrivatePassCard,
);

export default React.memo(MarketplacePrivatePassCard);
