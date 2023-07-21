import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Style from '@material-ui/icons/Style';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useMediaQuery, useTheme } from '@material-ui/core';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';
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
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '#libs/theme/selectors';
import type { PaymentPack } from '#libs/payment-packs/types';
import { CardSize } from '#components/css-only/Card/types';
import {
  MARKETPLACE_BREAKPOINT,
  CARD_VARIANTS,
} from '#libs/marketplace/constants';
import { useValidityInfoForPaymentPackCard } from '../../utils/payment-pack';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  isExcludingTax?: boolean;
  addToCart?: () => void;
  onOpenDetailDialog?: () => void;
  hideCredits?: boolean;
  isSelected?: boolean;
  variant?: string;
};

const MarketplacePaymentPackCard: React.FC<Props> = ({
  paymentPack,
  isExcludingTax,
  addToCart,
  onOpenDetailDialog,
  hideCredits,
  isSelected,
  variant,
}) => {
  const cardVariant = variant ?? CARD_VARIANTS.MARKETPLACE;

  const { t } = useTranslation(['marketplace', 'booking']);
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', {
        count: paymentPack.credits / getCreditFactor(),
      });

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      addToCart();
    },
    [addToCart],
  );

  const [showAllDescription, setShowAllDescription] = React.useState(false);

  const descriptionText = useIsTextExpandable(showAllDescription);

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  return (
    <Card
      size={CardSize.AUTO}
      classes={{
        'bs-paymentpack-card': 'bs-paymentpack-card',
        'bs-paymentpack-card--background':
          cardVariant === CARD_VARIANTS.MARKETPLACE,
      }}
      isSelected={isSelected}
    >
      <Content
        padding
        classes={{ 'bs-pass-card-content': 'bs-pass-card-content' }}
      >
        <Grid
          classes={{
            'bs-paymentpack-card__grid':
              cardVariant === CARD_VARIANTS.MARKETPLACE,
          }}
        >
          <Item
            alignment={Alignment.FLEX_START}
            justification={
              isMobile ? Justification.SPACE_BETWEEN : Justification.FLEX_START
            }
            columnEnd={1}
          >
            <div
              className={classNames('bs-paymentpack-card__title', {
                'bs-paymentpack-card__title--small':
                  cardVariant === CARD_VARIANTS.PRICING_PAGE,
              })}
            >
              {!!paymentPack.linked_private_pass && (
                <ToolTip title={t('genericCard.title.universalPassMessage')}>
                  <Style className="bs-paymentpack-card__title__icon" />
                </ToolTip>
              )}
              {paymentPack.name}
            </div>
            {!hideCredits && (
              <div className="bs-paymentpack-card__subtitle">
                {formatedCredits}
              </div>
            )}
            {paymentPack.description && (
              <div
                ref={descriptionText.ref}
                className={classNames('bs-paymentpack-card__description', {
                  'bs-paymentpack-card__description--short':
                    cardVariant === CARD_VARIANTS.MARKETPLACE ||
                    !showAllDescription,
                })}
              >
                {paymentPack.description}
              </div>
            )}
            {descriptionText.isExpandable &&
              cardVariant === CARD_VARIANTS.PRICING_PAGE && (
                <button
                  type="button"
                  className="bs-paymentpack-card__seemore"
                  onClick={onClickSeeMore}
                >
                  {showAllDescription ? (
                    <div className="bs-paymentpack-card__seemore__row">
                      <KeyboardArrowUp />
                      {t('booking:newBookingModule.cards.seeLess')}
                    </div>
                  ) : (
                    <div className="bs-paymentpack-card__seemore__row">
                      <KeyboardArrowDown />
                      {t('booking:newBookingModule.cards.seeMore')}
                    </div>
                  )}
                </button>
              )}
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            justification={
              cardVariant === CARD_VARIANTS.MARKETPLACE
                ? Justification.SPACE_BETWEEN
                : Justification.FLEX_START
            }
          >
            <div
              className={classNames('bs-paymentpack-card__validity', {
                'bs-paymentpack-card__validity--margin':
                  cardVariant === CARD_VARIANTS.PRICING_PAGE,
              })}
            >
              <div>{useValidityInfoForPaymentPackCard(paymentPack)}</div>
            </div>
            <Price
              tax={paymentPack.tax}
              isExcludingTax={isExcludingTax}
              amount={paymentPack.price}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              classes={{
                'bs-paymentpack-card__price--small':
                  cardVariant === CARD_VARIANTS.PRICING_PAGE,
              }}
            >
              {!!addToCart && (
                <button
                  type="button"
                  className="bs-pass-card__price-icon"
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon />
                </button>
              )}
            </Price>
          </Item>
        </Grid>
        {!!onOpenDetailDialog && !!addToCart && (
          <Item
            justification={Justification.SPACE_BETWEEN}
            direction={Direction.ROW}
            classes={{
              'bs-paymentpack-card__footer': 'bs-paymentpack-card__footer',
            }}
          >
            <button
              type="button"
              className="bs-paymentpack-card__left-button"
              onClick={onOpenDetailDialog}
            >
              <div className="bs-paymentpack-card__left-button__content">
                <VisibilityIcon className="bs-paymentpack-card__left-button__icon" />
                {t('genericCard.details.buttonContent')}
              </div>
            </button>

            <button
              type="button"
              className="bs-paymentpack-card__right-button"
              onClick={addToCart}
            >
              {t('genericCard.addButton.buttonContent')}
            </button>
          </Item>
        )}
      </Content>
    </Card>
  );
};

export const MarketplacePaymentPackCardForStorybook = marketplaceCssHoc()(
  MarketplacePaymentPackCard,
);

export default React.memo(MarketplacePaymentPackCard);
