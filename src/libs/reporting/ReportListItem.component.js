// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import type { ReportConfiguration } from './types';
import { getIconFromCategory } from './utils';

type Props = {
  report: ReportConfiguration,
  t: TFunction,
  classes: { [string]: string },
  onEdit: (report: ReportConfiguration) => void,
  onDetail: (report: ReportConfiguration) => void,
  onDelete: (report: ReportConfiguration) => void,
};

export function ReportListItem({
  report,
  classes,
  t,
  onEdit,
  onDetail,
  onDelete,
}: Props) {
  const { name, description, category } = report;
  const Icon = getIconFromCategory(category);
  const columns = report.columns.map((c) => t(`columns.${c}`)).join(', ');
  const onClick = () => onDetail(report);
  return (
    <ListItem className={classes.listItem} onClick={onClick} button>
      <ListItemAvatar>
        <Icon fontSize="large" />
      </ListItemAvatar>
      <ListItemText secondary={columns}>
        <span className={classes.name}>{name}</span>
        <small>{description}</small>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton onClick={onClick}>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={() => onEdit(report)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(report)}>
          <ClearIcon />
        </IconButton>
      </ListItemSecondaryAction>
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
