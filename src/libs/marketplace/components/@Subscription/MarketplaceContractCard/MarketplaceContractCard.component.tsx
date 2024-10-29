import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import UpdateIcon from '@material-ui/icons/Update';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import Card, { CardSize } from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type { Contract } from '#src/libs/subscription/types';
import BillingInterval from '../MarketplaceBillingInterval';
import analyticsUtils from '#src/components/analytics/analytics';

import './styles.css';

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
      analyticsUtils.addItemToCart(contract);
      addToCart(contract);
    },
    [addToCart, contract],
  );

  const handleOpenDetailDialog = useCallback(() => {
    analyticsUtils.onShowContract(contract);
    onOpenDetailDialog(contract);
  }, [contract, onOpenDetailDialog]);

  const shouldDisplayFlatFee =
    !!contract?.flat_fee && parseFloat(contract?.flat_fee) > 0;

  return (
    <Card
      classes={{ 'bs-contract-card': 'bs-contract-card' }}
      id={`contract-${contract?.id}`}
      size={CardSize.AUTO}
    >
      <CardContent padding>
        <Grid
          classes={{
            'bs-contract-card__grid': 'bs-contract-card__grid',
          }}
        >
          <GridItem
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
          </GridItem>
          <GridItem
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
          </GridItem>
          <GridItem
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
          </GridItem>
          <GridItem
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-card__price-icon': 'bs-contract-card__price-icon',
            }}
            columnStart={1}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <Button
              classes={{
                root: 'bs-contract-card__price-icon',
              }}
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon />
            </Button>
          </GridItem>
        </Grid>
        <GridItem
          classes={{
            'bs-contract-card__footer': 'bs-contract-card__footer',
          }}
          direction={Direction.ROW}
          justification={Justification.SPACE_BETWEEN}
        >
          <Button
            classes={{
              root: 'bs-contract-card__left-button',
              text: 'bs-contract-card__left-button__content',
            }}
            onClick={handleOpenDetailDialog}
          >
            <VisibilityIcon className="bs-contract-card__left-button__icon" />
            {t('genericCard.details.buttonContent')}
          </Button>

          <Button
            classes={{ root: 'bs-contract-card__right-button' }}
            color={ButtonColor.PRIMARY}
            onClick={handleAddToCart}
          >
            {t('contractCard.registerButton')}
          </Button>
        </GridItem>
      </CardContent>
    </Card>
  );
};

export const MarketplaceContractCardForStorybook = marketplaceCssHoc()(
  MarketplaceContractCard,
);

export default React.memo(MarketplaceContractCard);
