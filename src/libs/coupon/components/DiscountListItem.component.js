// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { pure } from 'recompose';

import type { Discount } from '../types';

type Props = {
  discount: Discount,
  goToInvoice: (uuid: string) => void,
  divider: ?boolean,
};

export const DiscountListItem = (props: Props) => (
  <ListItem divider={!!props.divider}>
    <ListItemText
      primary={props.discount.name}
      secondary={`${props.discount.voucher}€`}
    />
    <ListItemSecondaryAction>
      <IconButton onClick={() => props.goToInvoice(props.discount.invoice)}>
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default pure(DiscountListItem);
