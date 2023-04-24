// @ts-nocheck
import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation, WithTranslation } from 'react-i18next';

import ProductLine from '#libs/order/components/ProductLine.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import type { OrderWithProducts } from '#libs/order/types';

type Props = {
  order: OrderWithProducts;
  divider?: boolean;
  dense?: boolean;
} & WithTranslation;

export const OrderListItem: React.FC<Props> = (props) => {
  const { order } = props;
  const { t } = useTranslation(['order']);
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <ListItem dense={!!props.dense} divider={!!props.divider}>
        <ListItemText
          primary={`${order.product_lines.reduce(
            (acc, v) => acc + v.quantity,
            0,
          )} ${t('products.nbProducts')}`}
          secondary={`${getCurrencyDisplayWithPrice(order.total_price)}`}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded}>
        <List disablePadding>
          {order.product_lines.map((pl) => (
            <ProductLine dense={props.dense} key={pl.id} product={pl} />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

export default OrderListItem;
