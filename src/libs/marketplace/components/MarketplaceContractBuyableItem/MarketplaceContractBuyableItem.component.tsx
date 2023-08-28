import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card, { CardSize } from '#csscomponents/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#csscomponents/Grid';
import Item, { Alignment, Justification } from '#csscomponents/Grid/GridItem';
import Price from '#csscomponents/Price';
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
      <Content
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
          <Item
            classes={{
              'bs-contract-buyable-item__title-item':
                !isRecommended && 'bs-contract-buyable-item__title-item',
              'bs-contract-buyable-item__title-item--recommended':
                isRecommended &&
                'bs-contract-buyable-item__title-item--recommended',
            }}
            columnStart={1}
          >
            <div className="bs-contract-buyable-item__title">
              {contract?.name}
            </div>
          </Item>
          {isRecommended && (
            <Item
              classes={{
                'bs-contract-buyable-item__recommended__container':
                  'bs-contract-buyable-item__recommended__container',
              }}
            >
              <div className="bs-contract-buyable-item__recommended-chip__container">
                <RecommendedChip />
              </div>
            </Item>
          )}
          <Item
            classes={{
              'bs-contract-buyable-item__description__container':
                'bs-contract-buyable-item__description__container',
            }}
            columnEnd={3}
            columnStart={1}
            rowStart={3}
          >
            <div
              ref={descriptionText.ref}
              className={classNames('bs-contract-buyable-item__description', {
                'bs-contract-buyable-item__description--short':
                  !showAllDescription,
              })}
            >
              {contract?.description}
            </div>
          </Item>
          {descriptionText.isExpandable && (
            <Item
              classes={{
                'bs-contract-buyable-item__seemore__container':
                  'bs-contract-buyable-item__seemore__container',
              }}
              columnStart={1}
              rowStart={4}
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
            </Item>
          )}
          <Item
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-buyable-item__prices':
                'bs-contract-buyable-item__prices',
            }}
            columnStart={3}
          >
            <div className="bs-contract-buyable-item__price-container">
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
                <div className="bs-contract-buyable-item__billing-interval">
                  <BillingInterval contract={contract} />
                </div>
              </Price>
            </div>
          </Item>
          {shouldDisplayFlatFee && (
            <Item
              alignment={Alignment.FLEX_END}
              classes={{
                'bs-contract-buyable-item__flat-fee':
                  'bs-contract-buyable-item__flat-fee',
              }}
              columnStart={3}
              rowStart={2}
            >
              <div className="bs-contract-buyable-item__flat-fee">
                {t('contractCard.fees', {
                  fees: getCurrencyDisplayWithPrice(contract.flat_fee),
                })}
              </div>
            </Item>
          )}
          <Item
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-contract-buyable-item__invoices':
                'bs-contract-buyable-item__invoices',
            }}
            columnStart={3}
            justification={Justification.FLEX_END}
            rowStart={descriptionText.isExpandable ? 4 : 3}
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
          </Item>
        </Grid>
      </Content>
    </Card>
  );
};

export const MarketplaceContractBuyableItemForStorybook = marketplaceCssHoc()(
  MarketplaceContractBuyableItem,
);

export default React.memo(MarketplaceContractBuyableItem);
