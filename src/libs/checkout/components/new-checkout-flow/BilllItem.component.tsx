import React from 'react';

import Typography from '@material-ui/core/Typography';
import { Theme, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import type { CheckoutItemExtraData } from '#src/libs/checkout/types';
import {
  getIsCheckoutItemApplied,
  getIsCheckoutItemReferralItem,
} from '#src/libs/checkout/utils';
import ReferralCouponHelpText from '../ReferralCouponHelpText.component';

type BillItemProps = {
  billItemName: string;
  billItemPrice: string;
  isBillItemPricePositive: boolean;
  isDeleteButtonDisabled: boolean;
  itemExtraData?: CheckoutItemExtraData;
  onRemoveBillItem?: () => void;
};

export const BillItem: React.FC<BillItemProps> = ({
  billItemName,
  billItemPrice,
  isBillItemPricePositive,
  isDeleteButtonDisabled,
  itemExtraData,
  onRemoveBillItem,
}) => {
  const isApplied = getIsCheckoutItemApplied(itemExtraData);

  const isReferralCouponItem = getIsCheckoutItemReferralItem(itemExtraData);

  const classes = useStyles({ isApplied, isBillItemPricePositive });

  return (
    <div className={classes.billItemContainer}>
      <div className={classes.billItemRow}>
        <Typography className={classes.lightGrey} variant="body2">
          {billItemName}
        </Typography>
        <div className={classes.endPriceContainer}>
          <Typography className={classes.checkoutItemPrice} variant="subtitle2">
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
      {isReferralCouponItem && !isApplied && (
        <div className={classes.errorContainer}>
          <ReferralCouponHelpText
            hasReachedMaxUses={itemExtraData?.has_reached_max_uses}
            missingAmountBeforeApplication={
              itemExtraData?.missing_amount_before_application
            }
          />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  { isBillItemPricePositive?: boolean; isApplied?: boolean }
>((theme) => ({
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    alignSelf: 'stretch',
  },
  billItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  billItemRow: {
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
  checkoutItemPrice: {
    textDecoration: ({ isApplied }) => (isApplied ? null : 'line-through'),
    color: ({ isBillItemPricePositive }) =>
      isBillItemPricePositive ? null : theme.palette.primary.main,
  },
}));

export default React.memo(BillItem);
