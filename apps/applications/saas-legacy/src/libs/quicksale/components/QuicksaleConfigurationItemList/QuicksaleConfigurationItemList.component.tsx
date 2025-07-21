import React from 'react';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
  isExcludingTax?: boolean;
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
    isExcludingTax,
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
            className={classes.itemContainer}
            spacing={isMobile ? 2 : 3}
            style={{
              maxHeight: autoSizerProps.height,
              width: autoSizerProps.width,
              overflow: 'auto',
            }}
          >
            {loading ? (
              [...Array(16).keys()].map((index) => (
                <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                  <QuicksaleItemCardSkeleton />
                </Grid>
              ))
            ) : (
              <>
                {(itemList ?? []).map((item) => (
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
                      adminView={!isQuicksaleInterfaceView}
                      deleteItem={deleteItem}
                      isExcludingTax={isExcludingTax}
                      item={item}
                      openColorModal={openColorModal}
                      outOfStock={item.outOfStock}
                      restrictedPurchase={item.restricted}
                    />
                  </Grid>
                ))}
                {!isQuicksaleInterfaceView && (
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <div
                      className={classes.addSectionIconButton}
                      onClick={openAddItemDrawer}
                      onKeyDown={stopPropagation}
                      role="button"
                      tabIndex={0}
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
