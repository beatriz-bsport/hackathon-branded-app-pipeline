import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Style from '@material-ui/icons/Style';
import { useMediaQuery, useTheme } from '@material-ui/core';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ToolTip from '#components/Tooltip.component';
import Card from '#components/css-only/Card';
import Content from '#components/css-only/Card/CardContent';
import Grid from '#components/css-only/Grid';
import Item, {
  Alignment,
  Justification,
} from '#components/css-only/Grid/GridItem';
import Price from '#components/css-only/Price';
import Button from '#components/css-only/Button';
import {
  getCurrencyDisplayWithPrice,
  getCreditFactor,
} from '#libs/theme/selectors';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const formatedCredits = paymentPack.unlimited
    ? t('genericCard.credits.unlimited')
    : t('genericCard.credits.availableCredit', {
        count: paymentPack.credits / getCreditFactor(),
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
      <Content
        padding
        classes={{
          'bs-payment-pack-buyable-content': 'bs-payment-pack-buyable-content',
        }}
      >
        <Grid>
          <Item
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-payment-pack-buyable-item__title-item':
                !isRecommended && 'bs-payment-pack-buyable-item__title-item',
              'bs-payment-pack-buyable-item__title-item--recommended':
                isRecommended &&
                'bs-payment-pack-buyable-item__title-item--recommended',
            }}
            columnEnd={1}
            columnStart={1}
            justification={
              isMobile ? Justification.SPACE_BETWEEN : Justification.FLEX_START
            }
          >
            <div className="bs-payment-pack-buyable-item__title">
              {!!paymentPack.linked_private_pass && (
                <ToolTip
                  title={t(
                    'marketplace:genericCard.title.universalPassMessage',
                  )}
                >
                  <Style className="bs-payment-pack-buyable-item__title__icon" />
                </ToolTip>
              )}
              {paymentPack.name}
            </div>
          </Item>
          {isRecommended && (
            <Item
              classes={{
                'bs-payment-pack-buyable-item__recommended-item':
                  'bs-payment-pack-buyable-item__recommended-item',
              }}
              columnStart={2}
              justification={Justification.FLEX_START}
            >
              <div className="bs-paymentpack-car__title__chipcontainer">
                <RecommendedChip />
              </div>
            </Item>
          )}
          {!isMobile && (
            <Item
              classes={{
                'bs-payment-pack-buyable-item__description-item':
                  'bs-payment-pack-buyable-item__description-item',
              }}
              columnEnd={3}
              columnStart={1}
              rowStart={2}
            >
              {paymentPack.description && (
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
                  {paymentPack.description}
                </div>
              )}
            </Item>
          )}
          {isMobile && !hideCredits && (
            <Item
              classes={{
                'bs-payment-pack-buyable-item__credits-item':
                  'bs-payment-pack-buyable-item__credits-item',
              }}
              rowStart={2}
            >
              <div className="bs-payment-pack-buyable-item__subtitle">
                {formatedCredits}
              </div>
            </Item>
          )}
          {descriptionText.isExpandable && !isMobile && (
            <Item
              classes={{
                'bs-payment-pack-buyable-item__seemore-item':
                  'bs-payment-pack-buyable-item__seemore-item',
              }}
              columnStart={1}
              rowStart={3}
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
            </Item>
          )}
          <Item
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-payment-pack-buyable-item__price-item':
                'bs-payment-pack-buyable-item__price-item',
            }}
            columnStart={3}
            justification={Justification.SPACE_BETWEEN}
          >
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
          </Item>
          <Item
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-payment-pack-buyable-item__validity-item':
                'bs-payment-pack-buyable-item__validity-item',
            }}
            columnStart={3}
            justification={Justification.FLEX_END}
            rowStart={descriptionText.isExpandable ? 3 : 2}
          >
            <div className="bs-payment-pack-buyable-item__validity">
              {useValidityInfoForPaymentPackCard(paymentPack)}
            </div>
          </Item>
        </Grid>
      </Content>
    </Card>
  );
};

export const MarketplacePaymentPackBuyableItemForStorybook =
  marketplaceCssHoc()(MarketplacePaymentPackBuyableItem);

export default React.memo(MarketplacePaymentPackBuyableItem);
