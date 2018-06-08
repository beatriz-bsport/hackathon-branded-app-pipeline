import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import { CoachThumbnail } from '../components';

export default function ActivityBasicInfo(props) {
  const { name, etablissement, coach } = props.activity;
  return (
    <Grid container justify="space-between" alignItems="center" direction="row">
      <Grid item>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="subheading">{name}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">{etablissement.title}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <CoachThumbnail coach={coach} variant="small" />
      </Grid>
    </Grid>
  );
}
