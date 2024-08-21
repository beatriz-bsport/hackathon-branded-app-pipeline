import React from 'react';

import {
  createTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import { ButtonBase, Theme } from '@material-ui/core';
import type {
  CheckoutItem,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import DeleteFromBasketDialogContent from '#src/libs/checkout/components/new-checkout-flow/ManageBasket/DeleteFromBasketDialogContent.component';
import ModalToDrawerSwitcher from '#src/components/Modal/ModalToDrawerSwitcher.component';
import { useTranslation } from 'react-i18next';

import './styles.css';

const drawerCustomTheme = createTheme({
  overrides: {
    MuiDrawer: {
      paperAnchorBottom: { borderRadius: '12px 12px 0px 0px' },
    },
  },
});

type DeleteItemButtonProps = {
  itemId: string;
  onDelete: (itemId: string) => void;
  buttonStyle: string;
};

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({
  itemId,
  buttonStyle,
  onDelete,
}) => {
  const handleDelete = React.useCallback(() => {
    if (itemId && onDelete) {
      onDelete(itemId);
    }
  }, [onDelete, itemId]);

  return (
    <ButtonBase className={buttonStyle} onClick={handleDelete}>
      <DeleteIcon />
    </ButtonBase>
  );
};

type CheckoutItemListProps = {
  activitySummaryCheckoutItems: CheckoutItem[];
  connectedToOtherComponents: boolean;
  handleRemoveCheckoutItem?: (
    checkoutItemToRemoveData: OnRemoveCheckoutItemData,
  ) => void;
};

export const CheckoutItemList: React.FC<CheckoutItemListProps> = ({
  activitySummaryCheckoutItems,
  connectedToOtherComponents,
  handleRemoveCheckoutItem,
}) => {
  const { t } = useTranslation('navigation');
  const [itemToRemove, setItemToRemove] = React.useState<CheckoutItem | null>(
    null,
  );
  const classes = useStyles({ connectedToOtherComponents });

  const handleItemDeletion = React.useCallback(
    (itemId: string) => {
      const itemToRemoveTmp = activitySummaryCheckoutItems.find(
        (checkoutItem) => checkoutItem.id === itemId,
      );

      if (!itemToRemoveTmp) {
        return;
      }

      setItemToRemove(itemToRemoveTmp);
    },
    [setItemToRemove, activitySummaryCheckoutItems],
  );

  const handleCloseModal = React.useCallback(() => {
    setItemToRemove(null);
  }, [setItemToRemove]);

  const onRemoveItemFromBasket = React.useCallback(() => {
    if (!itemToRemove) {
      return;
    }
    const checkoutItemToRemoveData: OnRemoveCheckoutItemData = {
      checkout_item: itemToRemove.id,
      quantity: itemToRemove.quantity,
    };
    handleRemoveCheckoutItem(checkoutItemToRemoveData);
    handleCloseModal();
  }, [itemToRemove, handleRemoveCheckoutItem, handleCloseModal]);

  const isOpen = React.useMemo(() => {
    return itemToRemove?.name !== null;
  }, [itemToRemove]);

  if (activitySummaryCheckoutItems.length === 0) return null;

  return (
    <div className={classes.checkoutItemsContainer}>
      <Typography className={classes.basketTitle} variant="h6">
        {t('navigation:tab.member.basket')}
      </Typography>
      {itemToRemove !== null && (
        <div className="bs-payment-page-checkout-item__remove__item__modal">
          <MuiThemeProvider theme={drawerCustomTheme}>
            <ModalToDrawerSwitcher
              isOpen={isOpen}
              maxWidth="md"
              onClose={handleCloseModal}
            >
              <DeleteFromBasketDialogContent
                onClose={handleCloseModal}
                onConfirm={onRemoveItemFromBasket}
                passName={itemToRemove.name}
              />
            </ModalToDrawerSwitcher>
          </MuiThemeProvider>
        </div>
      )}
      {activitySummaryCheckoutItems &&
        activitySummaryCheckoutItems.map((checkoutItem, index) => (
          <div key={checkoutItem.id} className={classes.itemContainer}>
            <div className={classes.itemTitleContainer}>
              <Typography
                className={classes.checkoutItemName}
                variant="subtitle2"
              >
                {checkoutItem.name}
              </Typography>
              {handleItemDeletion && (
                <DeleteItemButton
                  buttonStyle={classes.deleteButtonBase}
                  itemId={checkoutItem.id}
                  onDelete={handleItemDeletion}
                />
              )}
            </div>
            <Typography
              className={classes.checkoutItemPriceClass}
              variant="subtitle2"
            >
              {getCurrencyDisplayWithPrice(checkoutItem.unit_price)}
            </Typography>
            {index !== activitySummaryCheckoutItems.length - 1 && (
              <Divider className={classes.divider} variant="middle" />
            )}
          </div>
        ))}
    </div>
  );
};

const useStyles = makeStyles<Theme, { connectedToOtherComponents: boolean }>(
  (theme: Theme) => ({
    checkoutItemsContainer: {
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: theme.palette.grey[100],
      borderRadius: (props) =>
        props.connectedToOtherComponents ? '12px 12px 0 0' : '12px',
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      gap: theme.spacing(3),
      '.bs-fabrique-modal-dialog__header': {
        display: 'none',
      },
    },
    itemContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    basketTitle: {
      fontSize: '20px',
    },
    deleteButtonBase: {
      color: theme.palette.grey[700],
    },
    itemTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    checkoutItemName: { fontWeight: 500 },
    checkoutItemPriceClass: {
      fontWeight: 500,
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.spacing(1),
      padding: '2px 8px 2px 8px',
      placeSelf: 'self-end',
    },
    divider: {
      borderColor: theme.palette.grey[100],
      borderWidth: '1px',
      margin: theme.spacing(1),
    },
    expirationWarning: {
      padding: theme.spacing(2),
    },
    removeItemModal: {},
  }),
);

export default React.memo(CheckoutItemList);
