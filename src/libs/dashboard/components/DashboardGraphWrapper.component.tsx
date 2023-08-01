import React, { useCallback } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import Tooltip from '../../../components/Tooltip.component';
import DashboardChipRow from './DashboardChipRow.component';

import type { DataSourceDashboardGraph } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  paperContainer: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  graphTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionIconsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
  },
  deleteIconButton: {
    marginLeft: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  skeleton: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export type Props = {
  graph: DataSourceDashboardGraph;
  children: React.ReactNode;
  onEdit: (graph: DataSourceDashboardGraph) => void;
  onDelete: (graph: DataSourceDashboardGraph) => void;
  loadingData: boolean;
  loadingSettings?: boolean;
  graphHeight?: number;
};

export const DashboardGraphWrapper: React.FC<Props> = ({
  graph,
  onEdit,
  onDelete,
  children,
  loadingData,
  loadingSettings,
  graphHeight,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  const handleDelete = useCallback(() => onDelete(graph), [graph, onDelete]);

  const handleEdit = useCallback(() => onEdit(graph), [graph, onEdit]);

  return (
    <>
      <Paper className={classes.paperContainer} elevation={2}>
        <div className={classes.header}>
          <div className={classes.graphTitleRow}>
            <Typography className={classes.title} variant="h6">
              {graph.title.length > 0 ? graph.title : t(graph.defaultTitle)}
            </Typography>
            <div className={classes.actionIconsContainer}>
              <Tooltip title={t('graphActions.edit')}>
                <IconButton
                  disabled={!!loadingSettings}
                  onClick={handleEdit}
                  size="small"
                >
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('graphActions.delete')}>
                <IconButton
                  className={classes.deleteIconButton}
                  disabled={!!loadingSettings}
                  onClick={handleDelete}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <DashboardChipRow
            disabled={!!loadingSettings}
            graph={graph}
            onClick={handleEdit}
          />
        </div>

        {loadingData ? (
          <div className={classes.skeleton}>
            <Skeleton height={graphHeight || 400} variant="text" width="90%" />
          </div>
        ) : (
          <>{children}</>
        )}
      </Paper>
    </>
  );
};

export default React.memo(DashboardGraphWrapper, isEqual);
