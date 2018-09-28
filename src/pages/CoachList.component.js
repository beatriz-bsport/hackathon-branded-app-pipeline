// @flow
import React, { Component } from 'react';

import { withStyles, CircularProgress, Button, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CoachCard } from '../components';
import type { Coach } from '../api/types';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  loading: boolean,
  isManager: boolean,
  classes: Object,
  t: (x: string) => string,
  isCoach: boolean,
  selfCoach: Coach,
  associatedCoaches: Array<Coach>,
};

function SelfCoachCard(props: { isCoach: boolean, selfCoach: Coach }) {
  const { isCoach, selfCoach } = props;
  if (!isCoach) {
    return null;
  }

  return (
    <Grid item xs={12} md={4} xl={4}>
      <CoachCard coach={selfCoach} />
    </Grid>
  );
}

function AssociatedCoaches(props: {
  associatedCoaches: Array<Coach>,
  isManager: boolean,
}) {
  const { associatedCoaches, isManager } = props;

  if (!isManager) {
    return null;
  }

  return associatedCoaches.map((coach) => (
    <Grid item xs={12} md={6}>
      <CoachCard coach={coach} />
    </Grid>
  ));
}

export class CoachList extends Component<Props> {
  render() {
    if (this.props.loading) {
      return <CircularProgress />;
    }

    const {
      isManager,
      classes,
      t,
      isCoach,
      selfCoach,
      associatedCoaches,
    } = this.props;
    return (
      <div>
        {isManager ? (
          <Link to="/coach/add" style={{ textDecoration: 'none' }}>
            <Button
              variant="extendedFab"
              aria-label="Add"
              className={classes.button}
              color="primary"
            >
              <AddIcon className={classes.extendedIcon} />
              {t('coach.addCoach')}
            </Button>
          </Link>
        ) : null}
        <SelfCoachCard isCoach={isCoach} selfCoach={selfCoach} />
        <Grid container spacing={8}>
          <AssociatedCoaches
            associatedCoaches={associatedCoaches}
            isManager={isManager}
          />
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.coach.loading,
    selfCoach: state.coach.selfCoach,
    associatedCoaches: state.coach.companyAssociated,
    isCoach: state.auth.is_coach,
    isManager: state.auth.is_manager,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(translate()(CoachList)),
);
