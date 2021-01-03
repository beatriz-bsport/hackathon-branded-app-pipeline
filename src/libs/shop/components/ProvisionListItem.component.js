// @flow

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { formatAsDatetime } from '../../../utils/datetime';
import type { Provision } from '../types';

type Props = {
  provision: Provision,
};

export default (props: Props) => (
  <ListItem divider>
    <ListItemText
      primary={formatAsDatetime(props.provision.date)}
      secondary={props.provision.product_name}
    />
    <ListItemSecondaryAction>
      <Button disableRipple>
        <Typography
          variant="h5"
          color={props.provision.qty < 0 ? 'primary' : 'secondary'}
          component="p"
        >
          {(props.provision.qty >= 0 ? '+ ' : '') + props.provision.qty}
        </Typography>
      </Button>
    </ListItemSecondaryAction>
  </ListItem>
);
