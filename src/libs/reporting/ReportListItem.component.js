// @flow

import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import type { ReportConfiguration } from './types';
import { getIconFromCategory } from './utils';

type Props = {
  report: ReportConfiguration,
  classes: { [string]: string },
};

export function ReportListItem({ report, classes }: Props) {
  const { name, description, category } = report;
  const Icon = getIconFromCategory(category);
  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <Icon fontSize="large" />
      </ListItemAvatar>
      <ListItemText primary={name} secondary={description} />
    </ListItem>
  );
}

const styles = () => ({
  listItem: {
    border: '1px solid #E1E1E1',
  },
});

export default withStyles(styles)(ReportListItem);
