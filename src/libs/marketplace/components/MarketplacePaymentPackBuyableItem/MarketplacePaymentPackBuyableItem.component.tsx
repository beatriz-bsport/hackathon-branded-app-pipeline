import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Style from '@material-ui/icons/Style';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ToolTip from '#components/Tooltip.component';
import Card from '#components/css-only/Card';
import CardContent from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import GridItem from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';
import Collapse from '#components/css-only/Fabrique/Collapse';
import Button from '#components/css-only/Button';
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '#libs/theme/selectors';
import { useValidityInfoForPaymentPackCard } from '#libs/marketplace/utils/payment-pack';
import useIsTextExpandable from '../../../../hooks/useIsTextExpandable';
import RecommendedChip from '#components/css-only/RecommendedChip';

import type { PaymentPack } from '#libs/payment-packs/types';
import { CardSize } from '#components/css-only/Card/types';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  isExcludingTax?: boolean;
  isSelected?: boolean;
  hideCredits: boolean;
};

const MarketplacePaymentPackBuyableItem: React.FC<Props> = ({
  paymentPack,
  isExcludingTax,
  isSelected,
  hideCredits,
}) => {
  const { t } = useTranslation(['marketplace', 'booking']);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', {
        count: (paymentPack?.credits ?? 0) / getCreditFactor(),
      });

  const descriptionText = useIsTextExpandable(showAllDescription);

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const isRecommended = paymentPack.highlighted_as_recommended;

  return (
    <Card
      classes={{
        'bs-payment-pack-buyable-item': 'bs-payment-pack-buyable-item',
      }}
      isSelected={isSelected}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-payment-pack-buyable-item__content':
            'bs-payment-pack-buyableitem__content',
        }}
      >
        <Grid
          classes={{
            'bs-payment-pack-buyable-item__content_grid':
              'bs-payment-pack-buyableitem__content_grid',
          }}
        >
          {/* START -- FIRST ROW */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-title':
                'bs-payment-pack-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-payment-pack-buyable-item__title">
              <div
                className={classNames(
                  'bs-payment-pack-buyable-item__recommended-item',
                  {
                    'bs-payment-pack-buyable-item__recommended-item--hidden':
                      !isRecommended,
                  },
                )}
              >
                <div className="bs-paymentpack-buyable-item__recommended_icon">
                  <RecommendedChip />
                </div>
              </div>
              {!!paymentPack?.linked_private_pass && (
                <ToolTip
                  title={t(
                    'marketplace:genericCard.title.universalPassMessage',
                  )}
                >
                  <Style className="bs-payment-pack-buyable-item__title__icon" />
                </ToolTip>
              )}
              {paymentPack?.name ?? ''}
            </div>
          </GridItem>
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-pricing':
                'bs-payment-pack-buyable-item__grid_item-pricing',
            }}
          >
            <div className="bs-payment-pack-buyable-item__price_container">
              <Price
                amount={paymentPack.price}
                classes={{
                  'bs-payment-pack-buyable-item__price':
                    'bs-payment-pack-buyable-item__price',
                }}
                formatPriceWithCurrency={getCurrencyDisplayWithPrice}
                isExcludingTax={isExcludingTax}
                tax={paymentPack.tax}
              />
              <div
                className={classNames(
                  'bs-payment-pack-buyable-item__credits_caption',
                  {
                    'bs-payment-pack-buyable-item__credits_caption--hidden':
                      hideCredits,
                  },
                )}
              >
                {formatedCredits}
              </div>
            </div>
          </GridItem>
          {/* START -- SECOND ROW : SPANNING TWO COLUMNS */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-description':
                'bs-payment-pack-buyable-item__grid_item-description',
              ...(paymentPack?.description
                ? {}
                : {
                    'bs-payment-pack-buyable-item__grid_item-description--hidden':
                      'bs-payment-pack-buyable-item__grid_item-description--hidden',
                  }),
            }}
          >
            <Collapse collapsedHeight={40} isExpanded={showAllDescription}>
              <div
                ref={descriptionText.ref}
                className={classNames(
                  'bs-payment-pack-buyable-item__description',
                  {
                    'bs-payment-pack-buyable-item__description--short':
                      !showAllDescription,
                  },
                )}
              >
                {paymentPack?.description ?? ''}
              </div>
            </Collapse>
          </GridItem>
          {/* START -- THIRD ROW */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-collapse-arrow':
                'bs-payment-pack-buyable-item__grid_item-collapse-arrow',
            }}
          >
            <div
              className={classNames({
                'bs-payment-pack-buyable-item__seemore--hidden':
                  !descriptionText.isExpandable,
              })}
            >
              <Button
                classes={{
                  root: 'bs-payment-pack-buyable-item__seemore',
                  text: 'bs-payment-pack-buyable-item__seemore__text',
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
              'bs-payment-pack-buyable-item__grid_item-validity':
                'bs-payment-pack-buyable-item__grid_item-validity',
            }}
          >
            <div className="bs-payment-pack-buyable-item__validity">
              {useValidityInfoForPaymentPackCard(paymentPack)}
            </div>
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const MarketplacePaymentPackBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackBuyableItem);

export default React.memo(MarketplacePaymentPackBuyableItem);
