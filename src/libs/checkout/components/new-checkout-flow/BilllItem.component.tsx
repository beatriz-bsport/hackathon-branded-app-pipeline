import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

type BillItemProps = {
  billItemName: string;
  billItemPrice: string;
  isBillItemPricePositive: boolean;
  isDeleteButtonDisabled: boolean;
  onRemoveBillItem?: () => void;
};

export const BillItem: React.FC<BillItemProps> = ({
  billItemName,
  billItemPrice,
  isBillItemPricePositive,
  isDeleteButtonDisabled,
  onRemoveBillItem,
}) => {
  const classes = useStyles();

  const billItemPriceClass = isBillItemPricePositive
    ? ''
    : classes.priceNegative;

  return (
    <div className={classes.billItemContainer}>
      <Typography className={classes.lightGrey} variant="body2">
        {billItemName}
      </Typography>
      <div className={classes.endPriceContainer}>
        <Typography className={billItemPriceClass} variant="subtitle2">
          {billItemPrice}
        </Typography>
        {!!onRemoveBillItem && (
          <IconButton
            className={classes.removeIconButton}
            disabled={isDeleteButtonDisabled}
            onClick={onRemoveBillItem}
          >
            <DeleteIcon className={classes.lightGrey} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  billItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  endPriceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  lightGrey: { color: theme.palette.grey[600] },
  priceNegative: { color: theme.palette.primary.main },
  removeIconButton: { padding: '0' },
}));

export default React.memo(BillItem);
