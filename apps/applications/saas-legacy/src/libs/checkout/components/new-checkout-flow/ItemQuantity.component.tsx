import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';

type ItemQuantityProps = {
  isAddingItemPossible: boolean;
  isItemEditionDisabled: boolean;
  itemQuantity: number;
  onAddOneItem: () => void;
  onRemoveOneItem: () => void;
};

export const ItemQuantity: React.FC<ItemQuantityProps> = ({
  isAddingItemPossible,
  isItemEditionDisabled,
  itemQuantity,
  onAddOneItem,
  onRemoveOneItem,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.itemQuantityContainer}>
      <IconButton
        className={classes.quantityIcon}
        disabled={isItemEditionDisabled || itemQuantity === 1}
        onClick={onRemoveOneItem}
      >
        <Remove className={classes.icon} />
      </IconButton>
      <Typography variant="subtitle1">{itemQuantity}</Typography>
      <IconButton
        className={classes.quantityIcon}
        disabled={isItemEditionDisabled || !isAddingItemPossible}
        onClick={onAddOneItem}
      >
        <Add className={classes.icon} />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  icon: { width: '28px', height: '28px' },
  itemQuantityContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  quantityIcon: {
    color: 'white',
    padding: '0',
    backgroundColor: theme.palette.grey[600],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.grey[600],
      color: 'white',
    },
    '&:disabled': {
      backgroundColor: 'white',
      color: theme.palette.grey[300],
      borderColor: theme.palette.grey[300],
    },
  },
}));

export default React.memo(ItemQuantity);
