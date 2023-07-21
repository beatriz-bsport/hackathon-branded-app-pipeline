import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import InitialPrice from './InitialPrice';
import PaymentComboItemList from './PaymentComboItemList';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';

import './styles.css';

import type { PaymentCombo } from '#libs/payment-combo/types';
import { CARD_VARIANTS } from '#libs/marketplace/constants';

export type Props = {
  paymentCombo: PaymentCombo;
  isExcludingTax: boolean;
  onClick?: () => void;
  addToCart?: () => void;
  onOpenDetailDialog?: () => void;
  isSelected?: boolean;
  variant?: string;
};

const MarketplacePaymentComboCard: React.FC<Props> = ({
  paymentCombo,
  isExcludingTax,
  onClick,
  addToCart,
  onOpenDetailDialog,
  isSelected,
  variant,
}) => {
  const { t } = useTranslation(['marketplace', 'booking']);

  const [showAllDescription, setShowAllDescription] = React.useState(false);

  const descriptionText = useIsTextExpandable(showAllDescription);

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const cardVariant = variant ?? CARD_VARIANTS.MARKETPLACE;

  return (
    <Card
      size={CardSize.AUTO}
      classes={{
        'bs-pack-card': 'bs-pack-card',
        'bs-pack-card--background': cardVariant === CARD_VARIANTS.MARKETPLACE,
      }}
      onClick={onClick}
      isSelected={isSelected}
    >
      <Content>
        <Grid
          classes={{
            'bs-pack-card__grid': cardVariant === CARD_VARIANTS.MARKETPLACE,
          }}
        >
          <Item
            alignment={Alignment.FLEX_START}
            justification={Justification.SPACE_BETWEEN}
            columnStart={1}
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--left': '--left',
            }}
          >
            <div className="bs-pack-card__text-container">
              <div
                className={classNames('bs-pack-card__title', {
                  'bs-pack-card__title--small':
                    cardVariant === CARD_VARIANTS.PRICING_PAGE,
                })}
              >
                {paymentCombo.name}
              </div>
              {cardVariant === CARD_VARIANTS.PRICING_PAGE && (
                <div className="bs-pack-card__list--horizontal">
                  {paymentCombo.payment_packs
                    .concat(
                      paymentCombo.shop_items,
                      paymentCombo.private_passes,
                    )
                    .map((item) => {
                      return (
                        <li
                          key={item.id}
                          className="bs-pack-card__list--horizontal__item"
                        >
                          {item.name}
                        </li>
                      );
                    })}
                </div>
              )}
              <div
                ref={descriptionText.ref}
                className={classNames('bs-pack-card__description', {
                  'bs-pack-card__description--2-lines':
                    cardVariant === CARD_VARIANTS.PRICING_PAGE &&
                    !showAllDescription,
                })}
              >
                {paymentCombo.description}
              </div>
              {descriptionText.isExpandable &&
                cardVariant === CARD_VARIANTS.PRICING_PAGE && (
                  <button
                    type="button"
                    className="bs-pack-card__seemore"
                    onClick={onClickSeeMore}
                  >
                    {showAllDescription ? (
                      <div className="bs-pack-card__seemore__row">
                        <KeyboardArrowUp />
                        {t('booking:newBookingModule.cards.seeLess')}
                      </div>
                    ) : (
                      <div className="bs-pack-card__seemore__row">
                        <KeyboardArrowDown />
                        {t('booking:newBookingModule.cards.seeMore')}
                      </div>
                    )}
                  </button>
                )}
            </div>
          </Item>
          <Item
            justification={Justification.SPACE_BETWEEN}
            columnStart={2}
            classes={{
              'bs-pack-card__item': 'bs-pack-card__item',
              '--rigth': '--rigth',
            }}
          >
            {cardVariant === CARD_VARIANTS.MARKETPLACE && (
              <PaymentComboItemList
                paymentCombo={paymentCombo}
                classes={{ 'bs-pack-card__list': 'bs-pack-card__list' }}
                onOpenDetailDialog={onOpenDetailDialog}
              />
            )}
            <div className="bs-pack-card__prices-container">
              <InitialPrice
                paymentCombo={paymentCombo}
                isExcludingTax={isExcludingTax}
              />
              <Price
                tax={paymentCombo.tax}
                isExcludingTax={isExcludingTax}
                amount={paymentCombo.price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-pack-card__price': 'bs-pack-card__price',
                  'bs-pack-card__price--small':
                    cardVariant === CARD_VARIANTS.PRICING_PAGE,
                }}
              >
                {!!addToCart && (
                  <button
                    type="button"
                    className="bs-pack-card__price__icon"
                    onClick={addToCart}
                  >
                    <ShoppingCartIcon />
                  </button>
                )}
              </Price>
            </div>
          </Item>
        </Grid>
        {!!onOpenDetailDialog && !!addToCart && (
          <Item
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            alignment={Alignment.CENTER}
            classes={{ 'bs-pack-card__footer': 'bs-pack-card__footer' }}
          >
            <button
              type="button"
              className="bs-pack-card__footer__button__left"
              onClick={onOpenDetailDialog}
            >
              <div className="bs-pack-card__footer__left__button__content">
                <VisibilityIcon className="bs-pack-card__button__icon" />
                {t('genericCard.details.buttonContent')}
              </div>
            </button>

            <button
              type="button"
              className="bs-pack-card__footer__button__right"
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

export const MarketplacePaymentComboCardForStorybook = marketplaceCssHoc()(
  MarketplacePaymentComboCard,
);

export default React.memo(MarketplacePaymentComboCard);
