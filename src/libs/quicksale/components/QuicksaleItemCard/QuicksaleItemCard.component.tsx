import React from 'react';
import { Theme, useMediaQuery } from '@material-ui/core';
import DragIndicator from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveShoppingCard from '@material-ui/icons/RemoveShoppingCart';
import Block from '@material-ui/icons/Block';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { QuicksaleCardInfo } from '../../types';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import useGlobalStyle from '../../globalStyleHook';
import useStyle from './styles';

const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

type Props = {
  item: QuicksaleCardInfo;
  openColorModal?: (itemId: string) => void;
  deleteItem?: (itemId: string) => void;
  addToBasket?: (itemId: string) => void;
  outOfStock?: boolean;
  restrictedPurchase?: boolean;
  adminView?: boolean;
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
  } = props;

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
    () => addToBasket?.(item.id),
    [item.id, addToBasket],
  );

  return (
    <div
      className={classNames(
        globalClasses.quicksaleCardContainer,
        classes.container,
      )}
      onClick={addItemToBasket}
      role="button"
      tabIndex={0}
      onKeyDown={stopPropagation}
    >
      <div className={classes.cardHeader}>
        {adminView && (
          <IconButton className={classes.dragIconButton} disableRipple>
            <DragIndicator />
          </IconButton>
        )}

        <div className={classes.cardTitleAndSubtitle}>
          <Typography variant="subtitle2" className={classes.cardTitle}>
            {item.title}
          </Typography>

          <Typography variant="caption" className={classes.cardSubtitle}>
            {item.subtitle}
          </Typography>
        </div>
      </div>

      <div className={classes.cardFooter}>
        <div className={classes.priceAndRecurrence}>
          <Typography variant="subtitle2" className={classes.cardPrice}>
            {`${item.price.toFixed(2)} ${getCurrencyDisplay()}`}
          </Typography>

          {item.recurrence && (
            <Typography variant="caption" className={classes.cardRecurrence}>
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
          className={globalClasses.quicksaleCardAction}
          disableRipple
          onClick={openColorModalForCurrentItem}
        >
          <div className={globalClasses.quicksaleCardColorPickerButton} />
        </IconButton>
        <IconButton
          className={globalClasses.quicksaleCardAction}
          disableRipple
          onClick={deleteCurrentItem}
        >
          <DeleteIcon className={globalClasses.quicksaleCardDeleteIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleItemCard);
