import React from 'react';

import { Grid } from '@material-ui/core';

const DEFAULT_PROFIL_PIC =
  'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';

export default function(props) {
  const { coach } = props;
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={8}
    >
      <Grid item>
        <img
          src={coach.photo || DEFAULT_PROFIL_PIC}
          height={60}
          width={60}
          style={{ borderRadius: 30, border: 'solid #EEEEEE 2px' }}
        />
      </Grid>
      <Grid item>{coach.name || '-'}</Grid>
    </Grid>
  );
}
