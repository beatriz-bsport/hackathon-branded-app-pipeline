import React from 'react';
import Card from '#src/components/css-only/Card';
import CardContent from '#src/components/css-only/Card/CardContent';
import Grid from '#src/components/css-only/Grid';
import GridItem, {
  Alignment,
  Direction,
  Justification,
} from '#src/components/css-only/Grid/GridItem';
import { CardSize } from '#src/components/css-only/Card/types';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Skeleton from '#src/components/css-only/Skeleton';

import './styles-skeleton.css';

const BookerModuleOfferSummarySkeleton: React.FC = () => {
  return (
    <Card
      classes={{ 'bs-booker-module-skeleton-card': true }}
      size={CardSize.M}
    >
      <CardContent padding>
        <Grid>
          <GridItem
            alignment={Alignment.CENTER}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={1}
          >
            <Skeleton
              className="bs-booker-module-skeleton__header-text"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={2}
          >
            <Skeleton
              className="bs-booker-module-skeleton__header-text"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-skeleton__item-with-icon':
                'bs-booker-module-skeleton__item-with-icon',
              'bs-booker-module-skeleton__item-with-icon--first':
                'bs-booker-module-skeleton__item-with-icon--first',
            }}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={3}
          >
            <Skeleton
              className="bs-booker-module-skeleton__circle"
              variant="circle"
            />
            <Skeleton
              className="bs-booker-module-skeleton__text"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-skeleton__item-with-icon':
                'bs-booker-module-skeleton__item-with-icon',
            }}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={4}
          >
            <Skeleton
              className="bs-booker-module-skeleton__circle"
              variant="circle"
            />
            <Skeleton
              className="bs-booker-module-skeleton__text"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-skeleton__item-with-icon':
                'bs-booker-module-skeleton__item-with-icon',
            }}
            direction={Direction.ROW}
            justification={Justification.FLEX_START}
            rowStart={5}
          >
            <Skeleton
              className="bs-booker-module-skeleton__circle"
              variant="circle"
            />
            <Skeleton
              className="bs-booker-module-skeleton__text"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            classes={{
              'bs-booker-module-skeleton__item-with-icon--first':
                'bs-booker-module-skeleton__item-with-icon--first',
            }}
            direction={Direction.ROW}
            justification={Justification.SPACE_BETWEEN}
            rowStart={6}
          >
            <Skeleton
              className="bs-booker-module-skeleton__text"
              variant="text"
            />
            <Skeleton
              className="bs-booker-module-skeleton__price"
              variant="text"
            />
          </GridItem>
          <GridItem
            alignment={Alignment.CENTER}
            direction={Direction.ROW}
            justification={Justification.CENTER}
            rowStart={7}
          >
            <Skeleton className="bs-booker-module-skeleton__button" />
          </GridItem>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const BookerModuleOfferSummarySkeletonForStorybook = marketplaceCssHoc()(
  BookerModuleOfferSummarySkeleton,
);
export default React.memo(BookerModuleOfferSummarySkeleton);
