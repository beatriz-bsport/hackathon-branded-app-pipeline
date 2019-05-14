// @flow
import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { formatAsDatetime } from '../../../datetime';

const renderStatusIcon = (canceled_at: ?string, has_ended: boolean) => {
  if (has_ended) {
    return <CheckIcon color="secondary" />;
  }
  if (canceled_at) {
    return <CancelIcon color="secondary" />;
  }
  return <HourglassEmptyIcon color="secondary" />;
};

type Props = {
  onClick: (uuid: string) => void,
  subscriptions: Array<Invoice>,
};
export default function(props: Props) {
  return (
    <List disablePadding>
      {props.subscriptions.map((sub) => (
        <ListItem
          button
          key={sub.id}
          dense
          divider
          onClick={() => props.onClick(sub.id)}
        >
          <ListItemText
            primary={sub.name}
            secondary={`${formatAsDatetime(sub.date)}`}
          />
          <ListItemText
            primary={`${sub.recurrent_price} €`}
            primaryTypographyProps={{ align: 'right' }}
          />
          <ListItemSecondaryAction>
            <IconButton>
              {renderStatusIcon(sub.canceled_at, sub.has_ended)}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
