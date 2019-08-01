// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '@material-ui/icons/Warning';

type Props = {
  classes: Object,
  text: string,
};

export function WarningForceRecursion(props: Props) {
  return (
    <Grid
      container
      direction="row"
      spacing={16}
      alignItems="center"
      className={props.classes.warningContainer}
      wrap="nowrap"
    >
      <Grid item>
        <AlertIcon color="error" className={props.classes.leftIcon} />{' '}
      </Grid>
      <Grid item>
        <Typography>{props.text}</Typography>
      </Grid>
    </Grid>
  );
}
const styles = (theme) => ({
  warningContainer: {
    backgroundColor: '#F2F2F2',
    padding: theme.spacing.unit,
  },
});

export default withStyles(styles)(WarningForceRecursion);
