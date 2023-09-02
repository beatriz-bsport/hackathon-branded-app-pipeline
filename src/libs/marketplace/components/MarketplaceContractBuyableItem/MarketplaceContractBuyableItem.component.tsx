import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card, { CardSize } from '#csscomponents/Card';
import CardContent from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import GridItem from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
import Collapse from '#components/css-only/Fabrique/Collapse';
import RecommendedChip from '#components/css-only/RecommendedChip';
import BillingInterval from '#libs/marketplace/components/MarketplaceBillingInterval';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Button from '#components/css-only/Button';

import './styles.css';

import type {
  ContractWithPaymentPack,
  Contract,
} from '#libs/subscription/types';

export type Props = {
  isExcludingTax: boolean;
  contract: Contract | ContractWithPaymentPack;
  isSelected?: boolean;
};

const MarketplaceContractBuyableItem: React.FC<Props> = ({
  contract,
  isExcludingTax,
  isSelected,
}) => {
  const [showAllDescription, setShowAllDescription] = useState(false);
  const { t } = useTranslation(['marketplace', 'booking']);

  const shouldDisplayFlatFee =
    !!contract?.flat_fee && parseFloat(contract?.flat_fee.toString()) > 0;

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const descriptionText = useIsTextExpandable(showAllDescription);

  const isRecommended = contract.highlighted_as_recommended;

  return (
    <Card
      classes={{
        'bs-contract-buyable-item': 'bs-contract-buyable-item',
      }}
      isSelected={isSelected}
      size={CardSize.AUTO}
    >
      {/* FOR DESIGN REASON I HAVE TO CHANGE THE WAY WE HANDLE GRID AND ITEMS IN CSS */}
      <CardContent
        padding
        classes={{
          'bs-contract-buyable-item__content':
            'bs-contract-buyable-item__content',
        }}
      >
        <Grid
          classes={{
            'bs-contract-buyable-item__grid': 'bs-contract-buyable-item__grid',
          }}
        >
          {/* START -- FIRST ROW */}
          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-title':
                'bs-contract-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-contract-buyable-item__title__container">
              <div
                className={classNames(
                  'bs-contract-buyable-item__recommended-chip__container',
                  {
                    'bs-contract-buyable-item__recommended-chip__container--hidden':
                      isRecommended,
                  },
                )}
              >
                <div className="bs-contract-buyable-item__recommended_icon">
                  <RecommendedChip />
                </div>
              </div>
              <div className="bs-contract-buyable-item__title">
                {contract?.name}
              </div>
            </div>
          </GridItem>

          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-pricing':
                'bs-contract-buyable-item__grid_item-pricing',
            }}
          >
            <div className="bs-contract-buyable-item__pricing_container">
              <Price
                amount={contract?.recurrent_price}
                classes={{
                  'bs-contract-buyable-item__price':
                    'bs-contract-buyable-item__price',
                }}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                isExcludingTax={isExcludingTax}
                tax={parseFloat(contract?.tax) || 0}
              >
                <div>
                  <BillingInterval contract={contract} />
                </div>
              </Price>

              <div
                className={classNames('bs-contract-buyable-item__flat-fee', {
                  'bs-contract-buyable-item__flat-fee--hidden':
                    !shouldDisplayFlatFee,
                })}
              >
                {t('contractCard.fees', {
                  fees: getCurrencyDisplayWithPrice(contract.flat_fee),
                })}
              </div>
            </div>
          </GridItem>

          {/* START -- SECOND ROW : SPANNING TWO COLUMNS [CONTANING ONLY THE DESCRIPTION] */}

          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-description':
                'bs-contract-buyable-item__grid_item-description',
              ...(contract?.description
                ? {}
                : {
                    'bs-contract-buyable-item__grid_item-description--hidden':
                      'bs-contract-buyable-item__grid_item-description--hidden',
                  }),
            }}
          >
            <Collapse collapsedHeight={60} isExpanded={showAllDescription}>
              <div
                ref={descriptionText.ref}
                className={classNames('bs-contract-buyable-item__description', {
                  'bs-contract-buyable-item__description--short':
                    !showAllDescription,
                })}
              >
                {contract?.description}
              </div>
            </Collapse>
          </GridItem>

          {/* START -- THIRD ROW */}
          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-collapse-arrow':
                'bs-contract-buyable-item__grid_item-collapse-arrow',
            }}
          >
            <div
              className={classNames({
                'bs-contract-buyable-item__seemore_button--hidden':
                  !descriptionText.isExpandable,
              })}
            >
              <Button
                classes={{
                  root: 'bs-contract-buyable-item__seemore',
                  text: 'bs-contract-buyable-item__seemore__text',
                }}
                onClick={onClickSeeMore}
              >
                {showAllDescription ? (
                  <>
                    <KeyboardArrowUp />
                    {t('booking:newBookingModule.cards.seeLess')}
                  </>
                ) : (
                  <>
                    <KeyboardArrowDown />
                    {t('booking:newBookingModule.cards.seeMore')}
                  </>
                )}
              </Button>
            </div>
          </GridItem>
          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-number_invoices':
                'bs-contract-buyable-item__grid_item-number_invoices',
            }}
          >
            {!!contract?.nb_interval && (
              <div className="bs-contract-buyable-item__planned-invoices">
                <div className="bs-contract-buyable-item__planned-invoices__content">
                  {t('contractCard.invoice', {
                    count: contract.nb_interval,
                  })}
                </div>
              </div>
            )}
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplaceContractBuyableItemForStorybook = marketplaceCssHoc()(
  MarketplaceContractBuyableItem,
);

export default React.memo(MarketplaceContractBuyableItem);
