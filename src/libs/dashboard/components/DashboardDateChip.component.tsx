// @ts-nocheck
import React from 'react';

import DateRangeIcon from '@material-ui/icons/DateRange';
import Chip from '@material-ui/core/Chip';
import { makeStyles, Theme } from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import { getDateRangeFromGraphFilter } from '#libs/dashboard/utils';
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

export const DashboardDateChip: React.FC<Props> = ({
  graph,
  onClick,
  disabled,
}) => {
  const { t } = useTranslation('reporting');
  const classes = useStyles();

  const { timePeriod, start, end } = getDateRangeFromGraphFilter(graph);

  let chipLabel = '';
  if (timePeriod && timePeriod !== 'custom') {
    chipLabel = t(`header.helper.${timePeriod}`);
  } else if (timePeriod === 'custom') {
    chipLabel = `${start.format('L')} -> ${end.format('L')}`;
  }

  return (
    <Chip
      className={classes.chip}
      icon={<DateRangeIcon />}
      label={chipLabel}
      onClick={onClick}
      variant="outlined"
      size="small"
      clickable={!!onClick}
      color="primary"
      disabled={!!disabled}
    />
  );
};

export default React.memo(DashboardDateChip);
