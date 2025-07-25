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
import useGlobalStyle from '../../globalStyleHook';
import type { QuicksaleCardInfo } from '../../types';
import useStyle from './styles';
import { useTranslation } from 'react-i18next';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  item: QuicksaleCardInfo;
  openColorModal?: (itemId: string) => void;
  deleteItem?: (itemId: string) => void;
  addToBasket?: (item: QuicksaleCardInfo) => void;
  outOfStock?: boolean;
  restrictedPurchase?: boolean;
  adminView?: boolean;
  isExcludingTax?: boolean;
};

const QuicksaleItemCard: React.FC<Props> = (props) => {
  const {
    openColorModal,
    deleteItem,
    addToBasket,
    item,
    outOfStock,
    restrictedPurchase,
    adminView,
    isExcludingTax,
  } = props;

  const { t } = useTranslation('quicksale');

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );

  const classes = useStyle({
    color: item.color,
    admin: adminView,
  });
  const globalClasses = useGlobalStyle(isMobile)({
    color: item.color,
    admin: adminView,
  });

  const openColorModalForCurrentItem = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openColorModal?.(item.id);
    },
    [item.id, openColorModal],
  );

  const deleteCurrentItem = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteItem?.(item.id);
    },
    [item.id, deleteItem],
  );

  const addItemToBasket = React.useCallback(
    () => addToBasket?.(item),
    [item, addToBasket],
  );

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
      onClick={addItemToBasket}
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
        <IconButton
          disableRipple
          className={globalClasses.quicksaleCardAction}
          onClick={deleteCurrentItem}
        >
          <DeleteIcon className={globalClasses.quicksaleCardDeleteIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleItemCard);
