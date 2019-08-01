// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import type { ReportConfiguration } from './types';

import ReportListItem from './ReportListItem.component';

type Props = {
  items: ReportConfiguration[],
  classes: { [string]: string },
  className: string,
  itemProps: {
    onEdit: (report: ReportConfiguration) => void,
    onDetail: (report: ReportConfiguration) => void,
  },
};

export function ReportList({ items, classes, className, itemProps }: Props) {
  return (
    <Paper className={className}>
      <List className={classes.list}>
        {items.map((reportConfiguration) => {
          return (
            <ReportListItem
              key={reportConfiguration.id}
              report={reportConfiguration}
              {...itemProps}
            />
          );
        })}
      </List>
    </Paper>
  );
}

const styles = () => ({
  list: {
    padding: 0,
  },
});

export default withStyles(styles)(ReportList);
