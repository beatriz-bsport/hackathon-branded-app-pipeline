import React from 'react';

import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import type { ReportConfiguration } from '#src/libs/reporting/common/types';

import ReportListItem from './ReportListItem.component';

type Props = {
  items: ReportConfiguration[];
  className: string;
  itemProps: {
    onEdit: (report: ReportConfiguration) => void;
    onDetail: (report: ReportConfiguration) => void;
  };
};

const ReportList: React.FC<Props> = ({ items, className, itemProps }) => {
  const classes = useStyle();

  return (
    <Paper className={className}>
      <List className={classes.list}>
        {items.map((reportConfiguration) => {
          return (
            // @ts-expect-error
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
};

const useStyle = makeStyles(() => ({
  list: {
    padding: 0,
  },
}));

export default ReportList;
