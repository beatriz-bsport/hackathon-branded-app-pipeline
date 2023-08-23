// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DEFAULT_PROFILE_PICTURE_URL from '../assets/constants';

type Props = {
  user: { photo: string; name: string };
  variant: string;
  noname: boolean | null;
};

// prettier-ignore
export const Avatar = (props: Props) => {
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
      alignItems="center"
      direction="column"
      justify="center"
      spacing={1}
    >
      <Grid item>
        <img
          alt="user"
          height={HEIGHT}
          src={user ? user.photo || DEFAULT_PROFILE_PICTURE_URL : DEFAULT_PROFILE_PICTURE_URL}
          style={{
            borderRadius: parseInt(`${HEIGHT / 2}`, 10),
            border: 'solid #EEEEEE 2px',
            objectFit: 'cover',
          }}
          width={WIDTH}
        />
      </Grid>
      {noname ? null : (
        <Grid item>
          <Typography noWrap variant="body1">{user ? user.name : '-'}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default Avatar;
