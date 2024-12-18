import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Style from '@material-ui/icons/Style';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ToolTip from '#src/components/Tooltip.component';
import Card from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem from '#src/components/css-only/Grid/GridItem';
import Price from '#src/components/css-only/Price';
import Collapse from '#src/components/css-only/Fabrique/Collapse';
import Button from '#src/components/css-only/Fabrique/Button';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import { useValidityInfoForPaymentPackCard } from '#src/libs/marketplace/utils/payment-pack';
import RecommendedChip from '#src/components/css-only/RecommendedChip';

import type { PaymentPack } from '#src/libs/payment-packs/types';
import { CardSize } from '#src/components/css-only/Card/types';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';

import './styles.css';

export type Props = {
  paymentPack: PaymentPack;
  isExcludingTax?: boolean;
  isSelected?: boolean;
  hideCredits: boolean;
  bookingConfirmButtonComponent?: React.ReactElement;
};

const MarketplacePaymentPackBuyableItem: React.FC<Props> = ({
  paymentPack,
  isExcludingTax,
  isSelected,
  hideCredits,
  bookingConfirmButtonComponent,
}) => {
  const { t } = useTranslation(['marketplace', 'booking']);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', {
        count: getCreditsDividedValue(paymentPack?.credits ?? 0),
        credits: getCreditsDividedDisplay(paymentPack?.credits ?? 0),
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
        'bs-payment-pack-buyable-item__card':
          'bs-payment-pack-buyable-item__card',
      }}
      id={`bs-payment-pack-buyable-item__card-${paymentPack?.id}`}
      isSelected={isSelected}
      size={CardSize.AUTO}
    >
      <CardContent
        padding
        classes={{
          'bs-payment-pack-buyable-item__card_content':
            'bs-payment-pack-buyable-item__card_content',
        }}
      >
        <Grid
          classes={{
            'bs-payment-pack-buyable-item__card_content_grid':
              'bs-payment-pack-buyable-item__card_content_grid',
          }}
        >
          {/* START -- FIRST ROW / NAME ROW */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-title':
                'bs-payment-pack-buyable-item__grid_item-title',
            }}
          >
            <div className="bs-payment-pack-buyable-item__title">
              {!!paymentPack?.linked_private_pass && (
                <ToolTip
                  title={t(
                    'marketplace:genericCard.title.universalPassMessage',
                  )}
                >
                  <Style
                    className="bs-payment-pack-buyable-item__title__icon"
                    fontSize="small"
                  />
                </ToolTip>
              )}
              {paymentPack?.name ?? ''}
            </div>
            <div
              className={classNames({
                'bs-payment-pack-buyable-item__recommended_icon_container':
                  isRecommended,
                'bs-payment-pack-buyable-item__recommended_icon_container--hidden':
                  !isRecommended,
              })}
            >
              <div className="bs-payment-pack-buyable-item__recommended_icon">
                <RecommendedChip />
              </div>
            </div>
          </GridItem>
          {/* START -- SECOND ROW / CREDIT ROW */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-credits':
                'bs-payment-pack-buyable-item__grid_item-credits',
              ...(hideCredits
                ? {
                    'bs-payment-pack-buyable-item__grid_item-credits--hidden':
                      'bs-payment-pack-buyable-item__grid_item-credits--hidden',
                  }
                : {}),
            }}
          >
            <div className="bs-payment-pack-buyable-item__credits_caption">
              {formatedCredits}
            </div>
          </GridItem>
          {/* START -- THIRD ROW / PRICE ROW */}
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
            </div>
          </GridItem>
          {/* START -- FOURTH ROW / DESCRIPTION ROW */}
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
          {/* START -- FIFTHROW / SEE MORE & VALIDITY ROW */}
          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-footer':
                'bs-payment-pack-buyable-item__grid_item-footer',
            }}
          >
            <div
              className={classNames({
                'bs-payment-pack-buyable-item__seemore_button--hidden':
                  !descriptionText.isExpandable,
              })}
            >
              <Button
                classes={{
                  root: 'bs-payment-pack-buyable-item__seemore_button',
                  text: 'bs-payment-pack-buyable-item__seemore_button__text',
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
            <div className="bs-payment-pack-buyable-item__validity">
              {useValidityInfoForPaymentPackCard(paymentPack)}
            </div>
          </GridItem>

          <GridItem
            classes={{
              'bs-payment-pack-buyable-item__grid_item-booking-button':
                'bs-payment-pack-buyable-item__grid_item-booking-button',
              'bs-payment-pack-buyable-item__booking-confirm-button':
                'bs-payment-pack-buyable-item__booking-confirm-button',
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

export const MarketplacePaymentPackBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackBuyableItem);

export default React.memo(MarketplacePaymentPackBuyableItem);
