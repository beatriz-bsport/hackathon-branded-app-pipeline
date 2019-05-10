// @flow
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import {
  PENDING,
  SUCCEEDED,
  FAILED,
  CANCELED,
} from '@bsport/common/lib/master-data/planned-invoice-status';

import { formatAsDate } from '../../datetime';

import type { PlannedInvoice } from './types';

const renderStatus = (status) => {
  switch (status) {
    case PENDING.id:
      return 'pending';
    case SUCCEEDED.id:
      return 'succeeded';
    case CANCELED.id:
      return 'cancelled';
    case FAILED.id:
    default:
      return 'failed';
  }
};

const PlannedInvoiceItem = (props: { invoice: PlannedInvoice }) => (
  <ListItem divider>
    <ListItemText
      primary={formatAsDate(props.invoice.date)}
      secondary={props.invoice.uuid || ''}
    />
    <ListItemText
      primary={`${props.invoice.price - props.invoice.voucher} €`}
      primaryTypographyProps={{ align: 'right' }}
      secondaryTypographyProps={{ align: 'right' }}
      secondary={renderStatus(props.invoice.status)}
    />
    <ListItemSecondaryAction />
  </ListItem>
);

type Props = {
  scheduledInvoices: Array<PlannedInvoice>,
};

export default function SubscriptionSchedule(props: Props) {
  return (
    <List dense disablePadding>
      {props.scheduledInvoices.map((si) => (
        <PlannedInvoiceItem invoice={si} />
      ))}
    </List>
  );
}
