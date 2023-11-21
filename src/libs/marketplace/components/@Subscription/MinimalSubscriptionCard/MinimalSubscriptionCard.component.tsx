import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import classNames from 'classnames';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';
import Card, { CardSize } from '#components/css-only/Card';
import Content from '#csscomponents/Card/CardContent';
import Grid from '#components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#csscomponents/Grid/GridItem';
import Price from '#components/css-only/Price';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import BillingInterval from '../MarketplaceBillingInterval';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type { Subscription } from '#libs/subscription/types';

import MinimalCardSkeleton from '../../MinimalCardSkeleton';
import Collapse from '#components/css-only/Fabrique/Collapse';
import Button from '#components/css-only/Fabrique/Button';

import './styles.css';

export type Props = {
  subscription: Subscription;
  isExcludingTax?: boolean;
  isLoading: boolean;
};

const MinimalSubscriptionCard: React.FC<Props> = ({
  subscription,
  isExcludingTax,
  isLoading,
}) => {
  const { t } = useTranslation(['marketplace', 'booking']);

  const [showAllDescription, setShowAllDescription] = useState(false);

  const onClickSeeMore = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowAllDescription(
      (previousShowAllDescription) => !previousShowAllDescription,
    );
  }, []);

  const descriptionText = useIsTextExpandable(showAllDescription);

  const shouldDisplayFlatFee =
    !!subscription?.flat_fee && parseFloat(subscription.flat_fee) > 0;

  if (!subscription && !isLoading) return null;

  if (isLoading) return <MinimalCardSkeleton />;

  return (
    <Card
      classes={{
        'bs-minimal-subscription-card': 'bs-minimal-subscription-card',
      }}
      size={CardSize.AUTO}
    >
      <Content
        padding
        classes={{
          'bs-minimal-subscription-card-content':
            'bs-minimal-subscription-card-content',
        }}
      >
        <Grid
          classes={{
            'bs-minimal-subscription-card-grid':
              'bs-minimal-subscription-card-grid',
          }}
        >
          <GridItem
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-minimal-subscription-card__title-item':
                'bs-minimal-subscription-card__title-item',
            }}
            columnEnd={1}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
          >
            <div className="bs-minimal-subscription-card__name">
              {subscription.name}
            </div>
          </GridItem>
          <GridItem
            alignment={Alignment.FLEX_START}
            classes={{
              'bs-minimal-subscription-card__price-item':
                'bs-minimal-subscription-card__price-item',
            }}
            columnEnd={1}
            columnStart={1}
            rowEnd={3}
            rowStart={3}
          >
            <Price
              amount={subscription.recurrent_price}
              classes={{
                'bs-minimal-subscription-card__price':
                  'bs-minimal-subscription-card__price',
              }}
              formatPriceWithCurrency={getCurrencyDisplayWithPrice}
              isExcludingTax={isExcludingTax}
            >
              <BillingInterval
                flatFee={subscription?.flat_fee}
                interval={subscription?.interval}
                recurrenceBasis={subscription?.recurrence_basis}
              />
            </Price>
          </GridItem>
          {shouldDisplayFlatFee && (
            <GridItem
              alignment={Alignment.FLEX_START}
              classes={{
                'bs-minimal-subscription-card__fees-item':
                  'bs-minimal-subscription-card__fees-item',
                ...(shouldDisplayFlatFee
                  ? {}
                  : {
                      'bs-minimal-subscription-card__fees-item--hidden':
                        'bs-minimal-subscription-card__fees-item--hidden',
                    }),
              }}
              columnEnd={1}
              columnStart={1}
              direction={Direction.ROW}
              justification={Justification.FLEX_START}
              rowEnd={2}
              rowStart={2}
            >
              <div className="bs-minimal-subscription-card__fees">
                {t('contractCard.fees', {
                  fees: getCurrencyDisplayWithPrice(subscription.flat_fee),
                })}
              </div>
            </GridItem>
          )}
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-minimal-subscription-card__description-item':
                'bs-minimal-subscription-card__description-item',
            }}
            columnEnd={3}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowEnd={4}
            rowStart={4}
          >
            <Collapse collapsedHeight={40} isExpanded={showAllDescription}>
              <div
                ref={descriptionText.ref}
                className={classNames(
                  'bs-minimal-subscription-card__description',
                  {
                    'bs-minimal-subscription-card__description--short':
                      !showAllDescription,
                  },
                )}
              >
                {subscription?.description ?? ''}
              </div>
            </Collapse>
          </GridItem>

          <GridItem
            alignment={Alignment.FLEX_END}
            classes={{
              'bs-minimal-subscription-card__see-more-item':
                'bs-minimal-subscription-card__see-more-item',
              ...(descriptionText.isExpandable
                ? {}
                : {
                    'bs-minimal-subscription-card__see-more-item--hidden':
                      'bs-minimal-subscription-card__see-more-item--hidden',
                  }),
            }}
            columnStart={1}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={5}
          >
            <Button
              classes={{
                root: 'bs-minimal-subscription-card__see-more-item__button',
                text: 'bs-minimal-subscription-card__see-more-item__text',
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
          </GridItem>

          <GridItem
            alignment={Alignment.FLEX_END}
            columnStart={2}
            direction={Direction.ROW}
            justification={Justification.FLEX_END}
            rowStart={5}
          >
            {!!subscription.nb_interval && (
              <div className="bs-minimal-subscription-card__planned-invoices">
                <div className="bs-minimal-subscription-card__planned-invoices__text">
                  {t('contractCard.invoice', {
                    count: subscription.nb_interval,
                  })}
                </div>
              </div>
            )}
          </GridItem>
        </Grid>
      </Content>
    </Card>
  );
};

export const MinimalSubscriptionCardForStorybook = marketplaceCssHoc()(
  MinimalSubscriptionCard,
);

export default React.memo(MinimalSubscriptionCard);
