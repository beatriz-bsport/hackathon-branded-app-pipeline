import React from 'react';

import { Paper, Grid } from '@material-ui/core';
import { Camembert, Histogram } from '../components';

export default function Dashboard() {
  return (
    <Grid container flexGrow={1}>
      <Paper style={{ margin: 20 }}>
        <Camembert data={[]} />
      </Paper>
      <Paper style={{ margin: 20 }}>
        <Histogram data={[]} />
      </Paper>
    </Grid>
  );
}
