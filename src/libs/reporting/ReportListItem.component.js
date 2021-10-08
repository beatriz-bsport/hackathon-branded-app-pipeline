// @flow

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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
  const onClick = () => onDetail(report.id);
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
        <IconButton onClick={() => onEdit(report)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(report)}>
          <DeleteIcon />
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
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(
  withTranslation(['reporting'])(ReportListItem),
);
