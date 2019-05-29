// @flow

import React from 'react';
import { Paper, List, Grid } from '@material-ui/core';
import MetaActivityListItem from './list/MetaActivityListItem.component';
import MetaActivityCard from './list/MetaActivityCard.component';

type Props = {
  stats: ?Array<Stat>,
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
  goToEdit: (metaActivityId: number) => void,
  goToDetail: (metaActivityId: number) => void,
};

export default function MetaActivityList(props: Props) {
  const { isCardView, metaActivities, stats, goToEdit, goToDetail } = props;
  if (isCardView) {
    return (
      <Grid container direction="row" spacing={24}>
        {metaActivities.map((a) => {
          const aStats = (stats || []).filter((s) => s.id === a.id);
          const s = aStats || [{}];
          return (
            <Grid item xs={12} sm={6} key={a.id}>
              <MetaActivityCard
                metaActivity={a}
                stats={s[0]}
                goToEdit={goToEdit}
                goToDetail={goToDetail}
              />
            </Grid>
          );
        })}
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
