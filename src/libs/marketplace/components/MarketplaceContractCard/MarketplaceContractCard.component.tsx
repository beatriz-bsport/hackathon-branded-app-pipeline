import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import UpdateIcon from '@material-ui/icons/Update';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';

import BillingInterval from '../MarketplaceBillingInterval';

import './styles.css';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type {
  ContractWithPaymentPack,
  Contract,
} from '#libs/subscription/types';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';
import { CARD_VARIANTS } from '#libs/marketplace/constants';

export type Props = {
  isExcludingTax: boolean;
  contract: Contract | ContractWithPaymentPack;
  addToCart?: (contract: Contract | ContractWithPaymentPack) => void;
  onOpenDetailDialog?: (contract: Contract | ContractWithPaymentPack) => void;
  isSelected?: boolean;
  variant?: string;
};

const MarketplaceContractCard: React.FC<Props> = ({
  contract,
  isExcludingTax,
  addToCart,
  onOpenDetailDialog,
  isSelected,
  variant,
}) => {
  const cardVariant = variant ?? CARD_VARIANTS.MARKETPLACE;

  const { t } = useTranslation(['marketplace', 'booking']);

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      addToCart(contract);
    },
    [addToCart, contract],
  );

  const handleOpenDetailDialog = useCallback(() => {
    onOpenDetailDialog(contract);
  }, [contract, onOpenDetailDialog]);

  const shouldDisplayFlatFee =
    !!contract?.flat_fee && parseFloat(contract?.flat_fee.toString()) > 0;

  const [showAllDescription, setShowAllDescription] = React.useState(false);

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const descriptionText = useIsTextExpandable(showAllDescription);

  return (
    <Card
      size={CardSize.AUTO}
      isSelected={isSelected}
      classes={{
        'bs-contract-card': 'bs-contract-card',
        'bs-contract-card--background':
          cardVariant === CARD_VARIANTS.MARKETPLACE,
      }}
    >
      <Content padding>
        <Grid>
          <Item
            alignment={Alignment.FLEX_START}
            columnEnd={1}
            justification={Justification.FLEX_START}
          >
            <div
              className={classNames('bs-contract-card__title', {
                ' bs-contract-card__title--small':
                  cardVariant === CARD_VARIANTS.PRICING_PAGE,
              })}
            >
              {cardVariant === CARD_VARIANTS.MARKETPLACE && (
                <UpdateIcon className="bs-contract-card__title__icon" />
              )}
              {contract?.name}
            </div>
            {shouldDisplayFlatFee && (
              <div className="bs-contract-card__subtitle">
                {t('contractCard.fees', {
                  fees: getCurrencyDisplayWithPrice(contract.flat_fee),
                })}
              </div>
            )}
            <div
              ref={descriptionText.ref}
              className={classNames('bs-contract-card__description', {
                'bs-contract-card__description--short':
                  cardVariant === CARD_VARIANTS.MARKETPLACE ||
                  !showAllDescription,
              })}
            >
              {contract?.description}
            </div>
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
            justification={Justification.FLEX_START}
            rowStart={1}
            columnEnd={2}
          >
            {!!contract?.nb_interval &&
              cardVariant === CARD_VARIANTS.MARKETPLACE && (
                <div className="bs-contract-card__planned-invoices">
                  <div className="bs-contract-card__planned-invoices__content">
                    {t('contractCard.invoice', {
                      count: contract.nb_interval,
                    })}
                  </div>
                </div>
              )}
          </Item>
          <Item
            rowStart={1}
            columnStart={1}
            justification={
              cardVariant === CARD_VARIANTS.PRICING_PAGE
                ? Justification.FLEX_START
                : Justification.FLEX_END
            }
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-item': 'bs-contract-card__price-item',
            }}
          >
            {!!contract?.nb_interval &&
              cardVariant === CARD_VARIANTS.PRICING_PAGE && (
                <div className="bs-contract-card__planned-invoices">
                  <div className="bs-contract-card__planned-invoices__content">
                    {t('contractCard.invoice', {
                      count: contract.nb_interval,
                    })}
                  </div>
                </div>
              )}
            <div className="bs-contract-card__price-container">
              <Price
                isExcludingTax={isExcludingTax}
                tax={parseFloat(contract?.tax) || 0}
                amount={contract?.recurrent_price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-contract-card__price': 'bs-contract-card__price',
                  'bs-contract-card__price--small':
                    cardVariant === CARD_VARIANTS.PRICING_PAGE,
                }}
              >
                <div className="bs-contract-card__billing-interval--desktop">
                  <BillingInterval contract={contract} />
                </div>
                <div className="bs-contract-card__billing-interval--mobile">
                  <BillingInterval contract={contract} />
                </div>
              </Price>
            </div>
          </Item>
          <Item
            rowStart={2}
            columnStart={1}
            justification={Justification.FLEX_START}
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-icon': 'bs-contract-card__price-icon',
            }}
          >
            {!!addToCart && (
              <button
                type="button"
                className="bs-contract-card__price-icon"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon />
              </button>
            )}
          </Item>
        </Grid>
        {addToCart && onOpenDetailDialog && (
          <Item
            justification={Justification.SPACE_BETWEEN}
            direction={Direction.ROW}
            classes={{
              'bs-contract-card__footer': 'bs-contract-card__footer',
            }}
          >
            <button
              type="button"
              className="bs-contract-card__left-button"
              onClick={handleOpenDetailDialog}
            >
              <div className="bs-contract-card__left-button__content">
                <VisibilityIcon className="bs-contract-card__left-button__icon" />
                {t('genericCard.details.buttonContent')}
              </div>
            </button>

            <button
              type="button"
              className="bs-contract-card__right-button"
              onClick={handleAddToCart}
            >
              {t('contractCard.registerButton')}
            </button>
          </Item>
        )}
      </Content>
    </Card>
  );
};

export const MarketplaceContractCardForStorybook = marketplaceCssHoc()(
  MarketplaceContractCard,
);

export default React.memo(MarketplaceContractCard);
