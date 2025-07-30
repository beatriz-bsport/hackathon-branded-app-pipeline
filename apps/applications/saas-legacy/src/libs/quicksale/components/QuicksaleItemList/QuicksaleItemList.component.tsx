import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import useStyle from '#src/libs/quicksale/components/QuicksaleConfigurationItemList/styles';
import QuicksaleItemCard from '#src/libs/quicksale/components/QuicksaleItemCard/QuicksaleItemCard.component';
import QuicksaleItemCardSkeleton from '#src/libs/quicksale/components/QuicksaleConfigurationItemList/QuicksaleItemCardSkeleton';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';

type Props = {
  isExcludingTax?: boolean;
  itemList?: Array<QuicksaleCardInfo>;
  loading?: boolean;
  onItemClick: (item: QuicksaleCardInfo) => void;
  onVariantItemClick: (itemId: string) => void;
};

const QuicksaleItemList: React.FC<Props> = ({
  isExcludingTax,
  itemList,
  loading,
  onItemClick,
  onVariantItemClick,
}) => {
  const classes = useStyle({ isQuicksaleInterfaceView: true });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  return (
    <div className={classes.autoSizerContainer}>
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            className={classes.itemContainer}
            spacing={isMobile ? 2 : 3}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
              overflow: 'auto',
            }}
          >
            {loading
              ? [...Array(16).keys()].map((index) => (
                  <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                    <QuicksaleItemCardSkeleton />
                  </Grid>
                ))
              : (itemList ?? []).map((item) => (
                  <Grid
                    key={item.id}
                    item
                    className={classes.item}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <QuicksaleItemCard
                      addToBasket={onItemClick}
                      isExcludingTax={isExcludingTax}
                      item={item}
                      onVariantItemClick={onVariantItemClick}
                      outOfStock={item.outOfStock}
                      restrictedPurchase={item.restricted}
                    />
                  </Grid>
                ))}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleItemList);
