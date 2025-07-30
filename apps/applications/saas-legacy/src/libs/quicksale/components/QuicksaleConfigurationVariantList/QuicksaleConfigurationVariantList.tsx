import React, { useCallback, useMemo, useState } from 'react';

import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import AutoSizer from 'react-virtualized-auto-sizer';

import QuicksaleItemCard from '../QuicksaleItemCard/QuicksaleItemCard.component';

import QuicksaleItemCardSkeleton from '../QuicksaleConfigurationItemList/QuicksaleItemCardSkeleton';
import DragAndDrop from '../DragAndDrop';
import useStyle from '../QuicksaleConfigurationItemList/styles';
import { useFetchShopItemVariants } from '../../hooks/useFetchShopItemVariants';
import { QuicksaleCardInfo } from '../../types';
import { getCardInfoFromBuyableItem } from '../../utils';
import { QuicksaleBasketItem } from '@bsport/common/lib/master-data/buyable-items';
import { useTranslation } from 'react-i18next';

type Props = {
  openColorModal?: (itemId: string) => void;
  openVariantColorModal?: (itemId: string, variantIndex: number) => void;
  variantList: Array<{ variant_id: number; color: string }>;
  currentSectionId: string;
  onItemClick?: (item: QuicksaleCardInfo) => void;
  currentVariantItemId: number;
  isQuicksaleInterfaceView?: boolean;
  isExcludingTax?: boolean;
  onVariantReorder?: (
    itemId: string,
    draggedVariantIndex: number,
    dropzoneIndex: number,
  ) => () => void;
};

const QuicksaleConfigurationVariantList: React.FC<Props> = (props) => {
  const {
    openColorModal,
    openVariantColorModal,
    currentSectionId,
    currentVariantItemId,
    variantList,
    isQuicksaleInterfaceView,
    isExcludingTax,
    onItemClick,
    onVariantReorder,
  } = props;

  const { t } = useTranslation('quicksale');

  const { loading, variants, error } =
    useFetchShopItemVariants(currentVariantItemId);

  const classes = useStyle({ isQuicksaleInterfaceView });

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('xs'),
  );

  const variantCardsInfo = useMemo(() => {
    if (!variantList?.length || !variants?.length) return [];
    return variantList.reduce<QuicksaleCardInfo[]>((acc, variant) => {
      const buyableItem = variants.find(
        (item) => item.id === variant.variant_id,
      );
      if (!buyableItem) return acc;

      const cardInfo = getCardInfoFromBuyableItem(
        {
          buyableItem,
          buyableItemIdentifier: QuicksaleBasketItem.ShopItemIdentifier,
        },
        t,
        variant.color,
        currentSectionId,
        false,
        false,
        undefined,
        `${buyableItem.color ?? ''}${
          buyableItem.size ? ' ' + buyableItem.size : ''
        }`,
      );

      return [...acc, cardInfo];
    }, []);
  }, [variants, variantList, currentSectionId, t]);

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
      if (!onVariantReorder || !variantList) return;

      const fromIndex = parseInt(draggedId, 10);
      let insertionIndex: number;

      if (dropTargetId.startsWith('before-')) {
        insertionIndex = parseInt(dropTargetId.replace('before-', ''), 10);
      } else if (dropTargetId.startsWith('after-')) {
        insertionIndex = parseInt(dropTargetId.replace('after-', ''), 10) + 1;
      } else if (dropTargetId === 'end') {
        insertionIndex = variantList.length;
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
      finalIndex = Math.max(0, Math.min(finalIndex, variantList.length - 1));

      onVariantReorder(
        currentVariantItemId.toString(),
        fromIndex,
        finalIndex,
      )();
      setDraggedItemIndex(null);
    },
    [onVariantReorder, variantList, currentVariantItemId],
  );

  const spacing = isMobile ? 2 : 3;

  const handleVariantColorModal = useCallback(
    (itemId: string, variantIndex?: number) => {
      if (variantIndex !== undefined) {
        // For variants, use the variant color modal with the current variant item ID
        openVariantColorModal?.(currentVariantItemId.toString(), variantIndex);
      } else {
        // For regular items, use the regular color modal
        openColorModal?.(itemId);
      }
    },
    [openColorModal, openVariantColorModal, currentVariantItemId],
  );

  if (error) {
    return null;
  }

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
                  {(variantCardsInfo ?? []).map((item, index) => (
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
                              isExcludingTax={isExcludingTax ?? false}
                              item={item}
                              openColorModal={handleVariantColorModal}
                              outOfStock={item.outOfStock ?? false}
                              restrictedPurchase={item.restricted ?? false}
                              variantIndex={index}
                            />
                          )
                        }
                      </DragAndDrop.Item>
                    </Grid>
                  ))}
                </Grid>
              </DragAndDrop>
            )}
          </>
        )}
      </AutoSizer>
    </div>
  );
};

export default React.memo(QuicksaleConfigurationVariantList);
