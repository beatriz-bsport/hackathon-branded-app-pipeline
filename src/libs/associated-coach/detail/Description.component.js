// @flow

import React from 'react';
import {
  Button,
  Typography,
  Divider,
  Grid,
  Paper,
  withStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  startUpdateCoach: (coach: CoachDetailed) => void,
  coach: CoachDetailed,
  t: TFunction,
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
