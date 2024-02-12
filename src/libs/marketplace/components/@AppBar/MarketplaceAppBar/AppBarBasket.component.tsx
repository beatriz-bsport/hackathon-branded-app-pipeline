import React from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Badge from '@material-ui/core/Badge';
import { alpha } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { BUYABLE_ITEM_COUPON } from '@bsport/common/lib/master-data/buyable-items';
import { Basket } from '#libs/checkout/types';

type BasketProps = {
  currentBasket?: Basket;
  openCurrentBasket?: () => void;
};

const AppBarBasket: React.FC<BasketProps> = ({
  openCurrentBasket,
  currentBasket,
}) => {
  const classes = useStyles();
  const buyableItemsQuantity = React.useMemo(() => {
    return (currentBasket?.checkout_items ?? [])
      .filter((item) => item.buyable_item_identifier !== BUYABLE_ITEM_COUPON)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [currentBasket]);

  if (!currentBasket?.checkout_items) {
    return null;
  }

  return (
    <ButtonBase className={classes.shoppingBadge} onClick={openCurrentBasket}>
      <Badge badgeContent={buyableItemsQuantity} color="primary">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </ButtonBase>
  );
};

const useStyles = makeStyles((theme) => ({
  shoppingBadge: {
    margin: -theme.spacing(1),
    padding: theme.spacing(1),
    marginRight: 0,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.05),
    },
    flex: '0 0 auto',
  },
}));

export default AppBarBasket;
