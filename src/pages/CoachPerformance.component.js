// @flow
import React, { Component } from 'react';

import { Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { CoachPerformanceForm, CoachPerformanceSummary } from '../components';
import { coach as coachActions } from '../actions';
import type { PerformanceCalculationRule } from '../components/form/types';
import type { Coach } from '../api/types';

type Props = {
  coaches: Array<Coach>,
  loading: boolean,
  performance: Array<Object>,
  fetchPerformance: (
    associatedCoachId: number,
    date_start: number,
    date_end: number,
  ) => void,
  t: (x: string) => string,
  classes: Object,
  match: Object,
};

type State = {
  rule: ?PerformanceCalculationRule,
};

export class CoachPerformance extends Component<Props, State> {
  coach: ?Coach = null;

  associatedCoachId: ?number = null;

  state = {
    rule: null,
  };

  componentDidMount() {
    this.associatedCoachId = parseInt(
      this.props.match.params.associatedCoachId,
      10,
    );
    // eslint-disable-next-line
    this.coach = this.props.coaches.filter(
      (ac) => ac.associated_coach_id === this.associatedCoachId,
    )[0];
  }

  onSubmit = (formData: Object) => {
    const { date_start, date_end } = formData;
    this.props.fetchPerformance(
      this.associatedCoachId,
      date_start.unix(),
      date_end.unix(),
    );
    const {
      pricePerOffer,
      pricePerAdditionalBooking,
      bookingThreshold,
      includeBonusOnOversizing,
    } = formData;
    this.setState({
      rule: {
        pricePerOffer,
        pricePerAdditionalBooking,
        bookingThreshold,
        includeBonusOnOversizing,
      },
    });
  };

  render() {
    const { classes, t, loading, performance } = this.props;
    const { rule } = this.state;
    return (
      <Grid container spacing={16} className={classes.container}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperForm}>
            <Grid container direction="column" spacing={40}>
              <Grid item>
                <Typography variant="title">
                  {t('coach.performance.title')}
                </Typography>
              </Grid>
              <Grid item>
                <CoachPerformanceForm
                  onSubmit={this.onSubmit}
                  loading={loading}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperSummary}>
            <CoachPerformanceSummary
              performance={performance}
              loading={loading}
              rule={rule}
              coach={this.coach}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    performance: state.coach.performance,
    loading: state.coach.performanceLoading,
    coaches: state.coach.companyAssociated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPerformance(associatedCoachId, dateStart, dateEnd) {
      dispatch(
        coachActions.fetchAssociatedCoachPerformance(
          associatedCoachId,
          dateStart,
          dateEnd,
        ),
      );
    },
  };
}
const styles = (theme) => ({
  paperForm: {
    padding: theme.spacing.unit * 3,
  },
  paperSummary: {
    marginBottom: theme.spacing.unit * 2,
  },
  container: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(CoachPerformance),
  ),
);
