import React, { Component } from 'react';

import { Grid, Paper } from '@material-ui/core';
import { connect } from 'react-redux';

import { CoachCard } from '../components';
import { coach as coachActions } from '../actions';

type Props = {};

export class CoachList extends Component<Props> {
  componentDidMount() {
    this.props.fetchAssociatedCoaches();
  }

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
    const { associatedCoaches, is_company } = this.props;

    if (!is_company) {
      return null;
    }

    return associatedCoaches.map((coach) => (
      <Grid item xs={12} sm={6} md={4}>
        <CoachCard coach={coach} />
      </Grid>
    ));
  };

  render() {
    return (
      <Grid container direction="row" spacing={24}>
        {this.getSelfCoach()}
        {this.getAssociatedCoaches()}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    selfCoach: state.coach.selfCoach,
    associatedCoaches: state.coach.companyAssociated,
    is_coach: state.auth.is_coach,
    is_company: state.auth.is_company,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAssociatedCoaches() {
      dispatch(coachActions.fetchAssociated());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoachList);
