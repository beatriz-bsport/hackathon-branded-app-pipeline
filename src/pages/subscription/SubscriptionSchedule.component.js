// @flow
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { formatAsDate } from '../../datetime';
import ConsumerPackRowItem from '../../components/payment-pack/ConsumerPackRowItem.component';

import type { ScheduledInvoice } from './types';

const renderStatus = (status) => {
  switch (status) {
    case 'failed':
      return 'failed';
    case 'succeeded':
      return 'succeeded';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const ScheduledInvoiceItem = (props: { invoice: ScheduledInvoice }) => (
  <React.Fragment>
    <ListItem divider>
      <ListItemText
        primary={formatAsDate(props.invoice.date)}
        secondary={renderStatus(props.invoice.status)}
      />
      <ListItemSecondaryAction>
        <ListItemText color="primary" primary={`${props.invoice.price} €`} />
      </ListItemSecondaryAction>
    </ListItem>
    {(props.invoice.invoice_items &&
      props.invoice.invoice_items.length &&
      props.invoice.invoice_items.map((ii) => (
        <ConsumerPackRowItem cpp={ii.content_object} />
      ))) ||
      null}
  </React.Fragment>
);

type Props = {
  scheduledInvoices: Array<ScheduledInvoice>,
};

export default function SubscriptionSchedule(props: Props) {
  return (
    <List dense disablePadding>
      {props.scheduledInvoices.map((si) => (
        <ScheduledInvoiceItem invoice={si} />
      ))}
    </List>
  );
}
