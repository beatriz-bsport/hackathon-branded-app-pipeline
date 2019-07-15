// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  startUpdateCoach: (coach: CoachDetailed) => void,
  coach: CoachDetailed,
  t: TFunction,
  classes: { [string]: string },
};

export const Description = (props: Props) => {
  const { t, classes, startUpdateCoach, coach } = props;
  return (
    <Paper>
      <div className={classes.paperContent}>
        <Typography component="p">
          {coach.description || t('coach.emptyDescription')}
        </Typography>
      </div>
      <Divider />
      <Grid container item justify="flex-end" className={classes.paperContent}>
        <Button
          onClick={() => startUpdateCoach(coach)}
          color="primary"
          variant="contained"
        >
          <EditIcon className={classes.leftIcon} />
          {t('common.edit')}
        </Button>
      </Grid>
    </Paper>
  );
};

const styles = (theme) => ({
  paperContent: {
    padding: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(withNamespaces([])(Description));
