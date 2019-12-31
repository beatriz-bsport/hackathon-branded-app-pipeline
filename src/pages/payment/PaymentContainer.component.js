// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  loading: boolean,
  classes: Object,
  children: any,
};
export const PaymentContainer = (props: Props) => {
  return (
    <div className={props.classes.container}>
      {props.loading ? (
        <CircularProgress className={props.classes.loading} />
      ) : (
        <Paper className={props.classes.paper}>{props.children}</Paper>
      )}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
  },
  paper: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 2,
  },
});

export default compose(withStyles(styles))(PaymentContainer);
