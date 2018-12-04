// @flow
import React from 'react';

import { Grid, Typography } from '@material-ui/core';
// prettier-ignore
const DEFAULT_PROFIL_PIC = 'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png';

type Props = {
  user: { photo: string, name: string },
  variant: string,
  noname: ?boolean,
};

// prettier-ignore
export default function (props: Props) {
  const { user, variant } = props;
  let HEIGHT = 60;
  const { noname } = props;
  if (variant === 'small') {
    HEIGHT = 42;
  } else if (variant === 'large') {
    HEIGHT = 140;
  } else if (variant === 'mediumNoname') {
    HEIGHT = 90;
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
          alt="user"
          src={user.photo || DEFAULT_PROFIL_PIC}
          height={HEIGHT}
          width={WIDTH}
          style={{
            borderRadius: parseInt(HEIGHT / 2, 10),
            border: 'solid #EEEEEE 2px',
            objectFit: 'cover'
          }}
        />
      </Grid>
      {noname ? null : (
        <Grid item>
          <Typography noWrap variant="body1">{user.name || '-'}</Typography>
        </Grid>
      )}
    </Grid>
  );
}
