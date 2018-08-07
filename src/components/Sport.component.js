import React from 'react';

import { Typography, Grid } from '@material-ui/core';
import SPORTS from 'bsport-commons/lib/master-data/sports';
import { translate } from 'react-i18next';

export function Sport(props) {
  const { parentCategory, SCTName, t, noname } = props;
  const variant = props.variant || 'body1';

  const sport = SPORTS.filter((s) => s.id === parentCategory)[0];

  return (
    <Grid
      container
      direction="row"
      spacing={8}
      justify="flex-start"
      alignItems="center"
    >
      <Grid item>
        <img src={sport.icon} height={30} width={30} />
      </Grid>
      {noname ? null : (
        <Grid item>
          <Typography variant={variant}>{SCTName || sport.text}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default translate()(Sport);
