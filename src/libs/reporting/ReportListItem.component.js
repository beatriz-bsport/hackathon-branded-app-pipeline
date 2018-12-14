// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import type { ReportConfiguration } from './types';
import { getIconFromCategory } from './utils';

type Props = {
  report: ReportConfiguration,
  t: TFunction,
  classes: { [string]: string },
};

export function ReportListItem({ report, classes, t }: Props) {
  const { name, description, category } = report;
  const Icon = getIconFromCategory(category);
  const columns = report.columns.map((c) => t(`columns.${c}`)).join(', ');
  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <Icon fontSize="large" />
      </ListItemAvatar>
      <ListItemText secondary={columns}>
        <span className={classes.name}>{name}</span>
        <small>{description}</small>
      </ListItemText>
    </ListItem>
  );
}

const styles = (theme) => ({
  listItem: {
    border: '1px solid #E1E1E1',
  },
  name: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(
  withNamespaces(['reporting'])(ReportListItem),
);
