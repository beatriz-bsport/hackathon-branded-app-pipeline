import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import UpdateIcon from '@material-ui/icons/Update';

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

import type { Contract } from '#libs/subscription/types';

export type Props = {
  isExcludingTax: boolean;
  contract: Contract;
  addToCart: (contract: Contract) => void;
  onOpenDetailDialog: (contract: Contract) => void;
};

const MarketplaceContractCard: React.FC<Props> = ({
  contract,
  isExcludingTax,
  addToCart,
  onOpenDetailDialog,
}) => {
  const { t } = useTranslation('marketplace');

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
    !!contract?.flat_fee && parseFloat(contract?.flat_fee) > 0;

  return (
    <Card
      classes={{ 'bs-contract-card': 'bs-contract-card' }}
      size={CardSize.AUTO}
    >
      <Content padding>
        <Grid
          classes={{
            'bs-contract-card__grid': 'bs-contract-card__grid',
          }}
        >
          <Item
            alignment={Alignment.FLEX_START}
            columnEnd={1}
            justification={Justification.FLEX_START}
          >
            <div className="bs-contract-card__title">
              <UpdateIcon className="bs-contract-card__title__icon" />
              {contract?.name}
            </div>
            {shouldDisplayFlatFee && (
              <div className="bs-contract-card__subtitle">
                {t('contractCard.fees', {
                  fees: getCurrencyDisplayWithPrice(contract.flat_fee),
                })}
              </div>
            )}
            <div className="bs-contract-card__description">
              {contract?.description}
            </div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            columnEnd={2}
            justification={Justification.FLEX_START}
            rowStart={1}
          >
            {!!contract?.nb_interval && (
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
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-item': 'bs-contract-card__price-item',
            }}
            columnStart={1}
            justification={Justification.FLEX_END}
            rowStart={1}
          >
            <div className="bs-contract-card__price-container">
              <Price
                amount={contract?.recurrent_price}
                classes={{
                  'bs-contract-card__price': 'bs-contract-card__price',
                }}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                isExcludingTax={isExcludingTax}
                tax={parseFloat(contract?.tax) || 0}
              >
                <div className="bs-contract-card__billing-interval--desktop">
                  <BillingInterval
                    flatFee={contract?.flat_fee}
                    interval={contract?.interval}
                    recurrenceBasis={contract?.recurrence_basis}
                  />
                </div>
                <div className="bs-contract-card__billing-interval--mobile">
                  <BillingInterval
                    flatFee={contract?.flat_fee}
                    interval={contract?.interval}
                    recurrenceBasis={contract?.recurrence_basis}
                  />
                </div>
              </Price>
            </div>
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-icon': 'bs-contract-card__price-icon',
            }}
            columnStart={1}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <button
              className="bs-contract-card__price-icon"
              onClick={handleAddToCart}
              type="button"
            >
              <ShoppingCartIcon />
            </button>
          </Item>
        </Grid>
        <Item
          classes={{
            'bs-contract-card__footer': 'bs-contract-card__footer',
          }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <button
            className="bs-contract-card__left-button"
            onClick={handleOpenDetailDialog}
            type="button"
          >
            <div className="bs-contract-card__left-button__content">
              <VisibilityIcon className="bs-contract-card__left-button__icon" />
              {t('genericCard.details.buttonContent')}
            </div>
          </button>

          <button
            className="bs-contract-card__right-button"
            onClick={handleAddToCart}
            type="button"
          >
            {t('contractCard.registerButton')}
          </button>
        </Item>
      </Content>
    </Card>
  );
};

export const MarketplaceContractCardForStorybook = marketplaceCssHoc()(
  MarketplaceContractCard,
);

export default React.memo(MarketplaceContractCard);
