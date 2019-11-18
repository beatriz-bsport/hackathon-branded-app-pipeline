// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import SPORTS from '@bsport/common/lib/master-data/sports';
import classnames from 'classnames';

type Props = {
  parentCategory: number,
  SCTName: string,
  noname: ?boolean,
  variant: ?string,
  classes: Object,
  isFocused?: boolean,
  isSelected?: boolean,
  paddingLeft?: boolean,
};

export function Sport(props: Props) {
  const {
    parentCategory,
    classes,
    isSelected,
    isFocused,
    SCTName,
    noname,
    paddingLeft,
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
      className={classnames(
        isSelected ? classes.selected : null,
        isFocused ? classes.focused : null,
        paddingLeft ? classes.paddingLeft : null,
      )}
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

const styles = (theme) => ({
  focused: { backgroundColor: '#efefef' },
  selected: { backgroundColor: '#e0e0e0' },
  paddingLeft: { paddingLeft: theme.spacing.unit },
});

export default withStyles(styles)(Sport);
