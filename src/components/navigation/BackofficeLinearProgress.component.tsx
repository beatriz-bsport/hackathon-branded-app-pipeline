import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme: any) => ({
  linear: {
    marginTop: theme.spacing(-2),
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginBottom: theme.spacing(2),
  },
});

export default withStyles(styles)((props: { classes: any }) => {
  return <LinearProgress className={props.classes.linear} />;
});
