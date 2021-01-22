// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withStyles from '@material-ui/core/styles/withStyles';
import { colors } from '@bsport/common/lib/colors';
import { getCurrencyDisplay } from '../../theme/selectors';

import type { Product } from '../types';

export const ProductLine = (props: {
  product: Product,
  onRemove: () => void,
  classes: Object,
  dense: ?boolean,
}) => (
  <ListItem dense={!!props.dense} divider>
    <ListItemAvatar>
      <Avatar className={props.classes.quantity}>
        {`x${props.product.quantity}`}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={props.product.name}
      secondary={`${props.product.subline} - ${
        props.product.unit_price
      } ${getCurrencyDisplay()} x ${props.product.quantity}`}
    />
    {props.onRemove ? (
      <ListItemSecondaryAction>
        <IconButton onClick={props.onRemove}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    ) : null}
  </ListItem>
);

const styles = () => ({
  quantity: {
    margin: 10,
    color: colors.primary,
    backgroundColor: 'transparent',
  },
});

export default withStyles(styles)(ProductLine);
