// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SPORTS from '@bsport/common/lib/master-data/sports';

type Props = {
  parentCategory: number,
  SCTName: string,
  noname: ?boolean,
  variant: ?string,
};
export default function Sport(props: Props) {
  const { parentCategory, SCTName, noname } = props;
  const variant = props.variant || 'body2';

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
        <img src={sport.icon} height={26} width={26} alt="coach profile" />
      </Grid>
      {noname ? null : (
        <Grid item>
          <Typography variant={variant}>{SCTName || sport.text}</Typography>
        </Grid>
      )}
    </Grid>
  );
}
