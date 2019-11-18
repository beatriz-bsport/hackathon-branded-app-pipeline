// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import SPORTS from '@bsport/common/lib/master-data/sports';

type Props = {
  parentCategory: number,
  SCTName: string,
  noname: ?boolean,
  variant: ?string,
  classes: Object,
  isFocused?: boolean,
  isSelected?: boolean,
};

export function Sport(props: Props) {
  const {
    parentCategory,
    classes,
    isSelected,
    isFocused,
    SCTName,
    noname,
  } = props;
  const variant = props.variant || 'body2';

  const sport = SPORTS.filter((s) => s.id === parentCategory)[0];

  return (
    <Grid
      container
      direction="row"
      spacing={8}
      justify="flex-start"
      alignItems="center"
      className={
        isSelected ? classes.selected : isFocused ? classes.focused : null
      }
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

const styles = () => ({
  focused: { backgroundColor: '#efefef' },
  selected: { backgroundColor: '#e0e0e0' },
});

export default withStyles(styles)(Sport);
