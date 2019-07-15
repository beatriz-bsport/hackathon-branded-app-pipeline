// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import MetaActivityListItem from './MetaActivityListItem.component';
import MetaActivityCard from './MetaActivityCard.component';

import type { MetaActivity } from '../types';

type Props = {
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (metaActivityId: number) => void,
};

export default function MetaActivityList(props: Props) {
  const { isCardView, metaActivities, goToEdit, goToDetail } = props;
  if (isCardView) {
    return (
      <Grid container direction="row" spacing={24}>
        {metaActivities.map((a) => (
          <Grid item xs={12} sm={6} key={a.id}>
            <MetaActivityCard
              metaActivity={a}
              goToEdit={goToEdit}
              goToDetail={goToDetail}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
  return (
    <Paper>
      <List disablePadding>
        {metaActivities.map((ma) => (
          <MetaActivityListItem
            divider
            key={ma.id}
            metaActivity={ma}
            goToEdit={goToEdit}
            goToDetail={goToDetail}
          />
        ))}
      </List>
    </Paper>
  );
}
