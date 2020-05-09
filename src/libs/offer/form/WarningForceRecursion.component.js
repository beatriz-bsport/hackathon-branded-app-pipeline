// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '@material-ui/icons/Warning';

type Props = {
  classes: Object,
  text: string,
};

export function WarningForceRecursion(props: Props) {
  return (
    <div className={props.classes.warningContainer}>
      <AlertIcon color="error" className={props.classes.leftIcon} />
      <Typography className={props.classes.typo}>{props.text}</Typography>
    </div>
  );
}
const styles = (theme) => ({
  warningContainer: {
    backgroundColor: '#F2F2F2',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  typo: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
});

export default withStyles(styles)(WarningForceRecursion);
