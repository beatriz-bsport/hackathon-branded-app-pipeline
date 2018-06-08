import React from 'react';

import { Grid } from '@material-ui/core';

const DEFAULT_PROFIL_PIC =
  'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';

export default function(props) {
  const { coach, variant } = props;
  let HEIGHT = 60;
  let noname = false;
  if (variant === 'small') {
    HEIGHT = 42;
    noname = true;
  }

  const WIDTH = HEIGHT;

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
          height={HEIGHT}
          width={WIDTH}
          style={{
            borderRadius: parseInt(HEIGHT / 2, 10),
            border: 'solid #EEEEEE 2px',
          }}
        />
      </Grid>
      {noname ? null : <Grid item>{coach.name || '-'}</Grid>}
    </Grid>
  );
}
