// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

type Props = {
  classes: Object,
  loading: boolean,
  color: ?string,
  content: string,
  label: string,
};
export const StatCard = (props: Props) => {
  return (
    <Paper className={props.classes.container}>
      {props.loading ? (
        <CircularProgress />
      ) : (
        <Typography color={props.color} variant="h2" component="p">
          {props.content}
        </Typography>
      )}
      <Typography className={props.classes.label}>{props.label}</Typography>
    </Paper>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    maxHeight: '35vw',
    width: 200,
    maxWidth: '40vw',
  },
  label: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(withStyles(styles))(StatCard);
