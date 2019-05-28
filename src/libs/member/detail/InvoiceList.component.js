// @flow
import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { formatAsDatetime } from '../../../datetime';

type Props = {
  onClick: (uuid: string) => void,
  invoices: Array<Invoice>,
};
export default function(props: Props) {
  return (
    <List disablePadding>
      {props.invoices.map((inv) => {
        let color = inv.price_due > inv.price_payed ? 'error' : 'primary';
        if (inv.reverted) {
          color = 'secondary';
        }
        return (
          <ListItem
            button
            key={inv.uuid}
            dense
            divider
            onClick={() => props.onClick(inv.uuid)}
          >
            <ListItemText
              primary={`${formatAsDatetime(inv.date)}`}
              secondary={inv.uuid.slice(0, 8).toUpperCase()}
            />
            <ListItemSecondaryAction>
              <Typography
                variant="subtitle1"
                color={color}
                style={{
                  paddingRight: 12,
                  ...(inv.reverted ? { textDecoration: 'line-through' } : {}),
                }}
              >
                {`${inv.price_due} €`}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
