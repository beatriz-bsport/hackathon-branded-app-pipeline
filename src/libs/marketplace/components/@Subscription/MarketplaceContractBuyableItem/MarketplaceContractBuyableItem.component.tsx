import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import UpdateIcon from '@material-ui/icons/Update';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ToolTip from '#src/components/Tooltip.component';
import Card, { CardSize } from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import Collapse from '#src/components/css-only/Fabrique/Collapse';
import RecommendedChip from '#src/components/css-only/RecommendedChip';
import BillingInterval from '#src/libs/marketplace/components/@Subscription/MarketplaceBillingInterval';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Button from '#src/components/css-only/Fabrique/Button';

import type {
  ContractWithPaymentPack,
  Contract,
} from '#src/libs/subscription/types';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';

import './styles.css';

export type Props = {
  isExcludingTax: boolean;
  contract: Contract | ContractWithPaymentPack;
  isSelected?: boolean;
  bookingConfirmButtonComponent?: React.ReactElement;
};

const MarketplaceContractBuyableItem: React.FC<Props> = ({
  contract,
  isExcludingTax,
  isSelected,
  bookingConfirmButtonComponent,
}) => {
  const [showAllDescription, setShowAllDescription] = useState(false);
  const { t } = useTranslation(['marketplace', 'booking']);

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
        'bs-contract-buyable-item__card': 'bs-contract-buyable-item__card',
      }}
      id={`bs-contract-buyable-item__card-${contract?.id}`}
      isSelected={isSelected}
      size={CardSize.AUTO}
    >
      {/* FOR DESIGN REASON I HAVE TO CHANGE THE WAY WE HANDLE GRID AND ITEMS IN CSS */}
      <CardContent
        padding
        classes={{
          'bs-contract-buyable-item__card__content':
            'bs-contract-buyable-item__card__content',
        }}
      >
        <Grid
          classes={{
            'bs-contract-buyable-item__card_content_grid':
              'bs-contract-buyable-item__card_content_grid',
          }}
        >
          {/* START -- FIRST ROW / NAME ROW */}

          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-title':
                'bs-contract-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-contract-buyable-item__title">
              {contract?.auto_renewal && (
                <ToolTip title={t('marketplace:genericCard.title.autoRenewal')}>
                  <UpdateIcon
                    className="bs-contract-buyable-item_title__icon"
                    fontSize="small"
                  />
                </ToolTip>
              )}
              {contract?.name ?? ''}
            </div>
            <div
              className={classNames({
                'bs-contract-buyable-item__recommended_icon_container--hidden':
                  !isRecommended,
              })}
            >
              <div className="bs-contract-buyable-item__recommended_icon">
                <RecommendedChip />
              </div>
            </div>
          </GridItem>

          {/* START -- SECOND ROW / FEE ROW */}

          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-fees':
                'bs-contract-buyable-item__grid_item-fees',
            }}
          >
            <div className="bs-contract-buyable-item__flat-fee">
              {t('contractCard.fees', {
                fees: getCurrencyDisplayWithPrice(contract.flat_fee),
              })}
            </div>
          </GridItem>

          {/* START -- THIRD ROW / BILLING ROW */}

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
                  <BillingInterval
                    flatFee={contract?.flat_fee}
                    interval={contract?.interval}
                    recurrenceBasis={contract?.recurrence_basis}
                  />
                </div>
              </Price>
            </div>
          </GridItem>

          {/* START -- FOURTH ROW / DESCRIPTION ROW */}

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
            <Collapse collapsedHeight={40} isExpanded={showAllDescription}>
              <div
                ref={descriptionText.ref}
                className={classNames('bs-contract-buyable-item__description', {
                  'bs-contract-buyable-item__description--short':
                    !showAllDescription,
                })}
              >
                {contract?.description ?? ''}
              </div>
            </Collapse>
          </GridItem>

          {/* START -- FIFTHROW / SEE MORE & NUMBER OF BILLING ROW */}

          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-footer':
                'bs-contract-buyable-item__grid_item-footer',
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
                  root: 'bs-contract-buyable-item__seemore_button',
                  text: 'bs-contract-buyable-item__seemore_button__text',
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
            {!!contract?.nb_interval && (
              <div className="bs-contract-buyable-item__number_of_invoices">
                {t('contractCard.invoice', {
                  count: contract.nb_interval,
                })}
              </div>
            )}
          </GridItem>
          <GridItem
            classes={{
              'bs-contract-buyable-item__grid_item-booking-button':
                'bs-contract-buyable-item__grid_item-booking-button',
              'bs-contract-buyable-item__booking-confirm-button':
                'bs-contract-buyable-item__booking-confirm-button',
            }}
          >
            {!!bookingConfirmButtonComponent &&
              isSelected &&
              bookingConfirmButtonComponent}
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
