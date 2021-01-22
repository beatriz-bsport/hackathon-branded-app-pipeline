// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { compose, withState } from 'recompose';
import ProductLine from './ProductLine.component';
import { getCurrencyDisplay } from '../../theme/selectors';

import type { OrderWithProducts } from '../types';

type Props = {
  order: OrderWithProducts,
  t: TFunction,
  expanded: boolean,
  setExpanded: (boolean) => void,
  divider: ?boolean,
  dense: ?boolean,
};

export const OrderListItem = (props: Props) => {
  const { t, order, expanded } = props;
  return (
    <div>
      <ListItem dense={!!props.dense} divider={!!props.divider}>
        <ListItemText
          primary={`${order.product_lines.reduce(
            (acc, v) => acc + v.quantity,
            0,
          )} ${t('products.nbProducts')}`}
          secondary={`${order.total_price} ${getCurrencyDisplay()}`}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => props.setExpanded(!expanded)}>
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

export default compose(
  withTranslation(['order']),
  withState('expanded', 'setExpanded', false),
)(OrderListItem);
