import React from 'react';

import { ListItemText, ListItem } from '@material-ui/core';

export default function(props) {
  return (
    <ListItem>
      <ListItemText
        primary={props.establishment.title}
        secondary={props.establishment.location.address}
      />
    </ListItem>
  );
}
