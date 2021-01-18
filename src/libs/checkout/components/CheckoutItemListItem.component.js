// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import DeleteIcon from '@material-ui/icons/Delete';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import withStyles from '@material-ui/core/styles/withStyles';

import { getCurrencyDisplay } from '../../theme/selectors';

import type { CheckoutItem } from '../types';

export const CheckoutItemListItem = (props: {
  checkout_item: CheckoutItem,
  onAddOne: () => void,
  onRemoveOne: () => void,
  classes: Object,
  dense: ?boolean,
}) => (
  <React.Fragment>
    <ListItem dense={!!props.dense} divider>
      <ListItemAvatar>
        <Avatar className={props.classes.quantity}>
          {`x${props.checkout_item.quantity}`}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.checkout_item.name}
        secondary={`${
          props.checkout_item.unit_price
        } ${getCurrencyDisplay()} x ${props.checkout_item.quantity}`}
      />
      {props.checkout_item.editable && props.onRemoveOne && props.onAddOne ? (
        <div className={props.classes.actionButtons}>
          <IconButton onClick={props.onRemoveOne}>
            <ExposureNeg1Icon />
          </IconButton>
          <IconButton onClick={props.onAddOne}>
            <ExposurePlus1Icon />
          </IconButton>
        </div>
      ) : null}
      {props.checkout_item.clearable &&
      !props.checkout_item.editable &&
      props.onRemoveOne ? (
        <ListItemSecondaryAction>
          <IconButton onClick={props.onRemoveOne}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
    {(props.checkout_item.sub_items || []).map((sub_item, idx) => (
      <ListItem dense key={idx} divider>
        <ListItemText
          primary={`+ ${sub_item}`}
          primaryTypographyProps={{ color: 'textSecondary' }}
        />
      </ListItem>
    ))}
  </React.Fragment>
);

const styles = (theme) => ({
  quantity: {
    margin: 10,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default withStyles(styles)(CheckoutItemListItem);
