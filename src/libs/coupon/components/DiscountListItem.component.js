// @flow
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { pure } from 'recompose';

import type { Discount } from '../types';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

type Props = {
  discount: Discount,
  goToInvoice: (uuid: string) => void,
  goToBillingPlan: (id: number) => void,
  divider: ?boolean,
};

export const DiscountListItem = (props: Props) => (
  <ListItem divider={!!props.divider}>
    <ListItemText
      primary={props.discount.name}
      secondary={`${getCurrencyDisplayWithPrice(props.discount.voucher)}`}
    />
    <ListItemSecondaryAction>
      <IconButton
        onClick={() => {
          if (props.discount.invoice) {
            return props.goToInvoice(props.discount.invoice);
          }
          if (props.discount.billing_plan) {
            return props.goToBillingPlan(props.discount.billing_plan);
          }
          return null;
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export default pure(DiscountListItem);
