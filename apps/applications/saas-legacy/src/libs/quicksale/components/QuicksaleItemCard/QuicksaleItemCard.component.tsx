import React from 'react';
import clsx from 'clsx';

import { Theme, useMediaQuery } from '@material-ui/core';
import DragIndicator from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveShoppingCard from '@material-ui/icons/RemoveShoppingCart';
import Block from '@material-ui/icons/Block';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import useGlobalStyle from '#src/libs/quicksale/globalStyleHook';
import type { QuicksaleCardInfo } from '#src/libs/quicksale/types';
import { QuicksaleItemColor } from '#src/libs/quicksale/constants';
import useStyle from './styles';
import { useTranslation } from 'react-i18next';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  addToBasket?: (item: QuicksaleCardInfo) => void;
  adminView?: boolean;
  deleteItem?: (itemId: string) => void;
  isExcludingTax: boolean;
  item: QuicksaleCardInfo;
  onVariantItemClick?: (itemId: string) => void;
  openColorModal?: (itemId: string, variantIndex?: number) => void;
  outOfStock: boolean;
  restrictedPurchase: boolean;
  variantIndex?: number;
};

const QuicksaleItemCard: React.FC<Props> = ({
  addToBasket,
  adminView,
  deleteItem,
  isExcludingTax,
  item,
  onVariantItemClick,
  openColorModal,
  outOfStock,
  restrictedPurchase,
  variantIndex,
}) => {
  const { t } = useTranslation('quicksale');

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const classes = useStyle({
    color: item.color || QuicksaleItemColor.Gray,
    isClickable: !adminView || !!item.variants?.length,
  });
  const globalClasses = useGlobalStyle(isMobile)({
    color: item.color || QuicksaleItemColor.Gray,
    admin: adminView,
  });

  const openColorModalForCurrentItem = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openColorModal?.(item.id, variantIndex);
    },
    [item.id, openColorModal, variantIndex],
  );

  const deleteCurrentItem = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteItem?.(item.id);
    },
    [item.id, deleteItem],
  );

  const onItemCardClick = React.useCallback(() => {
    if (item.variants?.length) {
      const idParts = item.id.split(' ');
      const targetId = idParts.length > 1 ? idParts[1] : idParts[0];
      if (targetId) {
        onVariantItemClick?.(`${targetId}`);
      }
    } else {
      addToBasket?.(item);
    }
  }, [addToBasket, item, onVariantItemClick]);

  const itemPrice = (() => {
    const lowestVariantPrice = !!item?.lowestVariantPrice
      ? item?.lowestVariantPrice?.toFixed(2)
      : null;
    const allVariantsHaveSamePrice = item?.allVariantsFollowBasePrice !== false;

    const price = item?.price;

    if (allVariantsHaveSamePrice) {
      return getCurrencyDisplayWithPrice(
        price,
        isExcludingTax,
        item.tax ?? '0',
      );
    }
    return t('objectCard.startingPrice', {
      price: getCurrencyDisplayWithPrice(lowestVariantPrice),
    });
  })();

  return (
    <div
      className={clsx(globalClasses.quicksaleCardContainer, classes.container)}
      onClick={onItemCardClick}
      onKeyDown={stopPropagation}
      role="button"
      tabIndex={0}
    >
      <div className={classes.cardHeader}>
        {adminView && (
          <IconButton disableRipple className={classes.dragIconButton}>
            <DragIndicator />
          </IconButton>
        )}

        <div className={classes.cardTitleAndSubtitle}>
          <Typography className={classes.cardTitle} variant="subtitle2">
            {item.title ?? ''}
          </Typography>

          {!!item.numberOfVariants && (
            <Typography className={classes.cardSubtitle} variant="caption">
              {item.numberOfVariants}
            </Typography>
          )}
        </div>
      </div>

      <div className={classes.cardFooter}>
        <div className={classes.priceAndRecurrence}>
          <Typography className={classes.cardPrice} variant="subtitle2">
            {itemPrice}
          </Typography>

          {item.recurrence && (
            <Typography className={classes.cardRecurrence} variant="caption">
              {item.recurrence}
            </Typography>
          )}
        </div>

        <div className={classes.restrictionIcons}>
          {outOfStock && (
            <RemoveShoppingCard className={classes.restrictionIcon} />
          )}
          {restrictedPurchase && <Block className={classes.restrictionIcon} />}
        </div>
      </div>

      <div className={globalClasses.quicksaleCardActions}>
        <IconButton
          disableRipple
          className={globalClasses.quicksaleCardAction}
          onClick={openColorModalForCurrentItem}
        >
          <div className={globalClasses.quicksaleCardColorPickerButton} />
        </IconButton>
        {!!deleteItem && (
          <IconButton
            disableRipple
            className={globalClasses.quicksaleCardAction}
            onClick={deleteCurrentItem}
          >
            <DeleteIcon className={globalClasses.quicksaleCardDeleteIcon} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuicksaleItemCard);
