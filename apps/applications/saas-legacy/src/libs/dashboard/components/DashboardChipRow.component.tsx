import React from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from 'react-i18next';
import DashboardDateChip from './DashboardDateChip.component';
import DashboardFilterChip from './DashboardFilterChip.component';
import Tooltip from '../../../components/Tooltip.component';

import type { DataSourceDashboardGraph } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  chip: {
    marginRight: theme.spacing(1),
  },
}));

export type Props = {
  graph: DataSourceDashboardGraph;
  onClick?: () => void;
  disabled?: boolean;
};

export const DashboardChipRow: React.FC<Props> = ({
  graph,
  onClick,
  disabled,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('dashboard');

  return (
    <div className={classes.container}>
      <span className={classes.chip}>
        <DashboardDateChip
          disabled={!!disabled}
          graph={graph}
          onClick={onClick}
        />
      </span>
      <span className={classes.chip}>
        <DashboardFilterChip
          disabled={!!disabled}
          graph={graph}
          onClick={onClick}
        />
      </span>
      <Tooltip title={t('addFilter')}>
        <IconButton disabled={!!disabled} onClick={onClick} size="small">
          <AddIcon color="primary" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default React.memo(DashboardChipRow);
