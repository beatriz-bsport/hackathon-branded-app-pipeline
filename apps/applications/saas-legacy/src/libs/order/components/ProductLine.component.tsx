import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withStyles from '@material-ui/core/styles/withStyles';
import { colors } from '@bsport/common/lib/colors.js';
import { createStyles, WithStyles } from '@material-ui/styles';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type { Product } from '#src/libs/order/types';

type Props = {
  product: Product;
  onRemove?: () => void;
  dense?: boolean;
} & WithStyles<typeof styles>;

export const ProductLine = (props: Props) => (
  <ListItem divider dense={!!props.dense}>
    <ListItemAvatar>
      <Avatar className={props.classes.quantity}>
        {`x${props.product.quantity}`}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={props.product.name}
      secondary={`${props.product.subline} - ${getCurrencyDisplayWithPrice(
        props.product.unit_price,
      )}`}
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

const styles = () =>
  createStyles({
    quantity: {
      margin: 10,
      color: colors.primary,
      backgroundColor: 'transparent',
    },
  });

export default withStyles(styles)(ProductLine);
