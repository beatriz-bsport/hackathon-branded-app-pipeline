import React, { Component } from 'react';

import {
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import Avatar from '../Avatar.component';

export class ConsumerListItem extends Component<Props> {
  render() {
    const { consumer } = this.props;
    return (
      <ListItem>
        <IconButton>
          <Avatar user={consumer} noname variant="small" />
        </IconButton>
        <ListItemText>
          <Typography>
            {consumer.first_name} {consumer.last_name}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  }
}

export default withNamespaces()(ConsumerListItem);
