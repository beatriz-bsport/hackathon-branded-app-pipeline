import React from 'react';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckIcon from '@material-ui/icons/Check';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import { Basket } from '../types';

type Props = {
  basket: Basket;
  onClick: (basketId: string) => void;
  selected?: boolean;
};

const BasketListItem = (props: Props) => {
  const { t } = useTranslation(['checkout']);
  const { basket, onClick } = props;
  return (
    <ListItem
      selected={props.selected}
      button={!!onClick}
      onClick={() => onClick(basket.id)}
    >
      <ListItemIcon>
        {basket.is_finalized ? (
          <CheckIcon color="primary" />
        ) : (
          <RefreshIcon color="secondary" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={getCurrencyDisplayWithPrice(
          props.basket.total_price_cts / 100,
        )}
        secondary={t('myBasket.totalQuantity', {
          qty: basket.checkout_items.reduce((acc, ci) => {
            return acc + ci.quantity;
          }, 0),
        })}
      />
      <ListItemSecondaryAction onClick={() => onClick(basket.id)}>
        <ArrowForwardIcon />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default BasketListItem;
