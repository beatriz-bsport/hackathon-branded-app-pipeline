import React from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Badge from '@material-ui/core/Badge';
import { alpha } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

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

  if (!currentBasket) {
    return null;
  }
  return (
    <ButtonBase onClick={openCurrentBasket} className={classes.shoppingBadge}>
      <Badge
        color="primary"
        badgeContent={currentBasket.checkout_items.reduce(
          (s, a) => s + a.quantity,
          0,
        )}
      >
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
