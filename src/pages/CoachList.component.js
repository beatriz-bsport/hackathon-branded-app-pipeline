import React, { Component } from 'react';

import {
  withStyles,
  CircularProgress,
  Button,
  Grid,
  Paper,
} from '@material-ui/core';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CoachCard } from '../components';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {};

export class CoachList extends Component<Props> {
  getSelfCoach = () => {
    const { is_coach, selfCoach } = this.props;
    if (!is_coach) {
      return null;
    }

    return (
      <Grid item xs={12} sm={6} md={4} xm={3}>
        <CoachCard coach={selfCoach} />
      </Grid>
    );
  };

  getAssociatedCoaches = () => {
    const { associatedCoaches, is_manager } = this.props;

    if (!is_manager) {
      return null;
    }

    return associatedCoaches.map((coach) => (
      <Grid item xs={12} md={6}>
        <CoachCard coach={coach} />
      </Grid>
    ));
  };

  render() {
    const { is_manager, classes, t } = this.props;
    if (this.props.loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container direction="column" alignItems="center">
        {is_manager ? (
          <Grid item xs="12">
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
          </Grid>
        ) : null}
        <Grid item>
          <Grid container direction="row" spacing={24}>
            {this.getSelfCoach()}
            {this.getAssociatedCoaches()}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.coach.loading,
    selfCoach: state.coach.selfCoach,
    associatedCoaches: state.coach.companyAssociated,
    is_coach: state.auth.is_coach,
    is_manager: state.auth.is_manager,
  };
}

export default connect(mapStateToProps)(
  withStyles(styles)(translate()(CoachList)),
);
