// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ConsumerActivities from './ConsumerActivities.component';
import ConsumerPacks from './ConsumerPacks.component';

type Props = {
  activities: *[],
  packs: *[],
};

export class ConsumerSummary extends React.Component<Props> {
  render() {
    const { packs, activities } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Packs</Typography>
          <ConsumerPacks packs={packs} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Upcoming activities</Typography>
          <ConsumerActivities activities={activities} />
        </Grid>
      </Grid>
    );
  }
}

export default ConsumerSummary;
