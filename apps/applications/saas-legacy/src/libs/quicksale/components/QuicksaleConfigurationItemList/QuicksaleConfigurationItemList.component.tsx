import React, { useCallback, useState } from 'react';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import AddCircle from '@material-ui/icons/AddCircle';
import AutoSizer from 'react-virtualized-auto-sizer';

import QuicksaleItemCard from '../QuicksaleItemCard/QuicksaleItemCard.component';
import type { QuicksaleCardInfo } from '../../types';

import useStyle from './styles';
import QuicksaleItemCardSkeleton from './QuicksaleItemCardSkeleton';
import DragAndDrop from '../DragAndDrop';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  openColorModal?: (itemId: string) => void;
  deleteItem?: (itemId: string) => void;
  openAddItemDrawer?: () => void;
  itemList?: Array<QuicksaleCardInfo>;
  loading?: boolean;
  isQuicksaleInterfaceView?: boolean;
  onItemClick?: (item: QuicksaleCardInfo) => void;
  onVariantItemClick: (itemId: string) => void;
  isExcludingTax?: boolean;
  onItemReorder?: (
    draggedItemIndex: number,
    dropzoneIndex: number,
  ) => () => void;
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
    onVariantItemClick,
    isExcludingTax,
    onItemReorder,
  } = props;

  const classes = useStyle({ isQuicksaleInterfaceView });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const onDragStart = (id: string) => () => {
    setTimeout(() => {
      setDraggedItemIndex(Number(id));
    }, 0);
  };

  const onDragEnd = () => () => {
    setDraggedItemIndex(null);
  };

  const handleDrop = useCallback(
    (draggedId: string, dropTargetId: string) => () => {
      if (!onItemReorder || !itemList) return;

      const fromIndex = parseInt(draggedId, 10);
      let insertionIndex: number;

      if (dropTargetId.startsWith('before-')) {
        insertionIndex = parseInt(dropTargetId.replace('before-', ''), 10);
      } else if (dropTargetId.startsWith('after-')) {
        insertionIndex = parseInt(dropTargetId.replace('after-', ''), 10) + 1;
      } else if (dropTargetId === 'end') {
        insertionIndex = itemList.length;
      } else {
        // Fallback
        insertionIndex = parseInt(dropTargetId, 10);
      }

      // Calculate the final position considering the item removal
      let finalIndex = insertionIndex;
      if (fromIndex < insertionIndex) {
        finalIndex = insertionIndex - 1;
      }

      // Ensure we don't go out of bounds
      finalIndex = Math.max(0, Math.min(finalIndex, itemList.length - 1));

      onItemReorder(fromIndex, finalIndex)();
      setDraggedItemIndex(null);
    },
    [onItemReorder, itemList],
  );

  const spacing = isMobile ? 2 : 3;

  return (
    <div className={classes.autoSizerContainer}>
      <AutoSizer>
        {(autoSizerProps: { height: number; width: number }) => (
          <>
            {loading ? (
              <Grid
                container
                className={classes.itemContainer}
                spacing={spacing}
                style={{
                  maxHeight: autoSizerProps.height,
                  width: autoSizerProps.width,
                }}
              >
                {[...Array(16).keys()].map((index) => (
                  <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                    <QuicksaleItemCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <DragAndDrop
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                onDrop={handleDrop}
              >
                <Grid
                  container
                  className={classes.itemContainer}
                  spacing={spacing}
                  style={{
                    maxHeight: autoSizerProps.height,
                    width: autoSizerProps.width,
                  }}
                >
                  {(itemList ?? []).map((item, index) => (
                    <Grid
                      key={item.id}
                      item
                      className={classes.item}
                      lg={3}
                      md={4}
                      sm={6}
                      style={{ position: 'relative' }}
                    >
                      {/* Left drop zone (before) */}
                      {draggedItemIndex !== null &&
                        draggedItemIndex !== index && (
                          <DragAndDrop.DropZone
                            id={`before-${index}`}
                            style={{
                              position: 'absolute',
                              left: '-2px',
                              top: spacing * 2,
                              width: '50%',
                              height: `calc(100% - ${spacing * 4}px)`,
                              zIndex: 10,
                              backgroundColor: 'transparent',
                            }}
                          >
                            {({ activeDropTarget }) => (
                              <>
                                {activeDropTarget === `before-${index}` && (
                                  <div className={classes.leftDropIndicator}>
                                    <div className={classes.verticalDropLine} />
                                  </div>
                                )}
                              </>
                            )}
                          </DragAndDrop.DropZone>
                        )}

                      {/* Right drop zone (after) */}
                      {draggedItemIndex !== null &&
                        draggedItemIndex !== index && (
                          <DragAndDrop.DropZone
                            id={`after-${index}`}
                            style={{
                              position: 'absolute',
                              right: '-2px',
                              top: spacing * 2,
                              width: '50%',
                              height: `calc(100% - ${spacing * 4}px)`,
                              zIndex: 10,
                              backgroundColor: 'transparent',
                            }}
                          >
                            {({ activeDropTarget }) => (
                              <>
                                {activeDropTarget === `after-${index}` && (
                                  <div className={classes.rightDropIndicator}>
                                    <div className={classes.verticalDropLine} />
                                  </div>
                                )}
                              </>
                            )}
                          </DragAndDrop.DropZone>
                        )}
                      {/* The actual draggable section card */}
                      <DragAndDrop.Item id={index.toString()}>
                        {({ isDragged }) =>
                          !isDragged && (
                            <QuicksaleItemCard
                              addToBasket={onItemClick}
                              adminView={!isQuicksaleInterfaceView}
                              deleteItem={deleteItem}
                              isExcludingTax={isExcludingTax}
                              item={item}
                              onVariantItemClick={onVariantItemClick}
                              openColorModal={openColorModal}
                              outOfStock={item.outOfStock}
                              restrictedPurchase={item.restricted}
                            />
                          )
                        }
                      </DragAndDrop.Item>
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
                </Grid>
              </DragAndDrop>
            )}
          </>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationItemList);
