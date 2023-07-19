import React from 'react';

import { useMediaQuery, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import AutoSizer from 'react-virtualized-auto-sizer';

import QuicksaleItemCard from '../QuicksaleItemCard/QuicksaleItemCard.component';
import type { QuicksaleCardInfo } from '../../types';

import useStyle from './styles';
import QuicksaleItemCardSkeleton from './QuicksaleItemCardSkeleton';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  openColorModal?: (itemId: string) => void;
  deleteItem?: (itemId: string) => void;
  openAddItemDrawer?: () => void;
  itemList?: Array<QuicksaleCardInfo>;
  loading?: boolean;
  isQuicksaleInterfaceView?: boolean;
  onItemClick?: (item: QuicksaleCardInfo) => void;
};

const QuicksaleConfigurationItemList: React.FC<Props> = (props) => {
  const {
    openColorModal,
    deleteItem,
    openAddItemDrawer,
    itemList,
    loading,
    isQuicksaleInterfaceView,
    onItemClick,
  } = props;

  const classes = useStyle({ isQuicksaleInterfaceView });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  return (
    <div className={classes.autoSizerContainer}>
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <Grid
            container
            spacing={isMobile ? 2 : 3}
            className={classes.itemContainer}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
              overflow: 'auto',
            }}
          >
            {loading ? (
              <>
                {[...Array(16).keys()].map((index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <QuicksaleItemCardSkeleton />
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {(itemList ?? []).map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={item.id}
                    className={classes.item}
                  >
                    <QuicksaleItemCard
                      item={item}
                      deleteItem={deleteItem}
                      openColorModal={openColorModal}
                      adminView={!isQuicksaleInterfaceView}
                      addToBasket={onItemClick}
                      outOfStock={item.outOfStock}
                      restrictedPurchase={item.restricted}
                    />
                  </Grid>
                ))}
                {!isQuicksaleInterfaceView && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <div
                      onClick={openAddItemDrawer}
                      className={classes.addSectionIconButton}
                      role="button"
                      tabIndex={0}
                      onKeyDown={stopPropagation}
                    >
                      <AddCircle className={classes.addSectionIcon} />
                    </div>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationItemList);
