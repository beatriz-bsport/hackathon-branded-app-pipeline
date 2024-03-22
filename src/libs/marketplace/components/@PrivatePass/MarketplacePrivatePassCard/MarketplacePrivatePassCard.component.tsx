import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Style } from '@material-ui/icons';

import { useMediaQuery, useTheme } from '@material-ui/core';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ToolTip from '#components/Tooltip.component';
import Card from '#csscomponents/Card';
import CardContent from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '#libs/theme/selectors';
import { CardSize } from '#components/css-only/Card/types';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import { useValidityInfoForPrivatePassCard } from '#libs/marketplace/utils/private-pass';
import Button, { ButtonColor } from '#csscomponents/Fabrique/Button';

import type { PrivatePass } from '#libs/private-service/types';
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
    <Card
      classes={{ 'bs-pass-card': 'bs-pass-card' }}
      id={`private-pass-${privatePass?.id}`}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{ 'bs-pass-card-content': 'bs-pass-card-content' }}
      >
        <Grid classes={{ 'bs-pass-card__grid': 'bs-pass-card__grid' }}>
          <GridItem
            alignment={Alignment.FLEX_START}
            columnEnd={2}
            columnStart={1}
            justification={
              isMobile ? Justification.SPACE_BETWEEN : Justification.FLEX_START
            }
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
          </GridItem>
          <GridItem
            alignment={Alignment.FLEX_END}
            columnEnd={3}
            columnStart={2}
            justification={Justification.SPACE_BETWEEN}
          >
            <div className="bs-pass-card__validity">
              <div className="bs-pass-card__validity__content">
                {useValidityInfoForPrivatePassCard(privatePass)}
              </div>
            </div>
            <Price
              amount={privatePass.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={isExcludingTax}
              tax={privatePass.tax}
            >
              <Button
                classes={{
                  root: 'bs-pass-card__price-icon',
                }}
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon />
              </Button>
            </Price>
          </GridItem>
        </Grid>
        <GridItem
          classes={{ 'bs-pass-card__footer': 'bs-pass-card__footer' }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <Button
            classes={{
              root: 'bs-pass-card__left-button',
              text: 'bs-pass-card__left-button__content',
            }}
            onClick={onOpenDetailDialog}
          >
            <VisibilityIcon className="bs-pass-card__left-button__icon" />
            {t('genericCard.details.buttonContent')}
          </Button>

          <Button
            classes={{
              root: 'bs-pass-card__right-button',
            }}
            color={ButtonColor.PRIMARY}
            onClick={addToCart}
          >
            {t('genericCard.addButton.buttonContent')}
          </Button>
        </GridItem>
      </CardContent>
    </Card>
  );
};

export const MarketplacePrivatePassCardForStorybook = marketplaceCssHoc()(
  MarketplacePrivatePassCard,
);

export default React.memo(MarketplacePrivatePassCard);
