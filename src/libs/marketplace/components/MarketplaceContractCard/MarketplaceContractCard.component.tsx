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
            justification={Justification.FLEX_START}
            rowStart={1}
            columnEnd={2}
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
            rowStart={1}
            columnStart={1}
            justification={Justification.FLEX_END}
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-item': 'bs-contract-card__price-item',
            }}
          >
            <div className="bs-contract-card__price-container">
              <Price
                isExcludingTax={isExcludingTax}
                amount={contract?.recurrent_price}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                classes={{
                  'bs-contract-card__price': 'bs-contract-card__price',
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
            <button
              type="button"
              className="bs-contract-card__price-icon"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon />
            </button>
          </Item>
        </Grid>
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
      </Content>
    </Card>
  );
};

export const MarketplaceContractCardForStorybook = marketplaceCssHoc()(
  MarketplaceContractCard,
);

export default React.memo(MarketplaceContractCard);
