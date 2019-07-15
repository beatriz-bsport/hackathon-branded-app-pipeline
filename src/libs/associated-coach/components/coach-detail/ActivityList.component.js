// @flow

import React from 'react';
import { Paper, List, withStyles, Typography } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import ActivityMinimalSummary from '../../../../components/activity/ActivityMinimalSummary.component';

type Props = {
  activities: Array<Activity>,
  t: TFunction,
  classes: Object,
};

export const ActivityList = (props: Props) => {
  const { t, activities, classes } = props;
  if ((activities || []).length) {
    return (
      <Paper>
        <List style={{ width: '100%' }} disablePadding>
          {activities.map((a) => (
            <ActivityMinimalSummary key={a.id} activity={a} />
          ))}
        </List>
      </Paper>
    );
  }
  return (
    <Paper>
      <Typography className={classes.paperContent} variant="caption">
        {t('coach.noActivity')}
      </Typography>
    </Paper>
  );
};

const styles = (theme) => ({
  paperContent: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces([])(ActivityList));
