// @flow
import React from 'react';

import { ListItemText, ListItem } from '@material-ui/core';

type Props = {
  establishment: Establishment,
};

// prettier-ignore
export default function (props: Props) {
  return (
    <ListItem>
      <ListItemText
        primary={props.establishment.title}
        secondary={props.establishment.location.address}
      />
    </ListItem>
  );
}
