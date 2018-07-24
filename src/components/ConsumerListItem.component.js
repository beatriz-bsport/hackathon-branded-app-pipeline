import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  withStyles,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { Avatar } from '../components';

const styles = (theme) => ({
  container: {},
});

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

export default withStyles(styles)(translate()(ConsumerListItem));
