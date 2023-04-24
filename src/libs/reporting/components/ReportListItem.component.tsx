// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { ReportConfiguration } from '../types';
import { getIconFromCategory } from '../utils';
import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

type Props = {
  report: ReportConfiguration;
  onEdit: (report: ReportConfiguration) => void;
  onDetail: (id: number) => void;
  onDelete: (report: ReportConfiguration) => void;
};

const ReportListItem: React.FC<Props> = ({
  report,
  onEdit,
  onDetail,
  onDelete,
}) => {
  const { name, description, category } = report;
  const classes = useStyles();
  const { t } = useTranslation('reporting');

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
      <ListItemResponsiveAction
        actions={[
          {
            icon: EditIcon,
            label: t('actions.edit'),
            color: 'primary',
            onClick: () => {
              onEdit(report);
            },
          },
          {
            icon: DeleteIcon,
            label: t('actions.delete'),
            onClick: () => {
              onDelete(report);
            },
          },
        ]}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    border: '1px solid #E1E1E1',
  },
  name: {
    marginRight: theme.spacing(1),
  },
}));

export default ReportListItem;
