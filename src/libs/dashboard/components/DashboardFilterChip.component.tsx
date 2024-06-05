import React from 'react';

import Chip from '@material-ui/core/Chip';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@material-ui/icons/FilterList';
import { getNbOfFiltersFromGraph } from '#src/libs/dashboard/utils';
import type { DataSourceDashboardGraph } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    paddingLeft: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
  },
}));

export type Props = {
  graph: DataSourceDashboardGraph;
  onClick?: () => void;
  disabled?: boolean;
};

export const DasboardFilterChip: React.FC<Props> = ({
  graph,
  onClick,
  disabled,
}) => {
  const { t } = useTranslation('dashboard');
  const classes = useStyles();

  const nbFilters = getNbOfFiltersFromGraph(graph);

  return (
    <>
      {nbFilters > 0 ? (
        <Chip
          className={classes.chip}
          clickable={!!onClick}
          disabled={!!disabled}
          icon={<FilterListIcon />}
          label={t('filterChipLabel', { count: nbFilters })}
          onClick={onClick}
          size="small"
          variant="outlined"
        />
      ) : null}
    </>
  );
};

export default React.memo(DasboardFilterChip);
