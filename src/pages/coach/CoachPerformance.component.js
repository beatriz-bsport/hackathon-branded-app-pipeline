// @flow

import React, { Component } from 'react';

import { compose, withProps } from 'recompose';

import { Paper, Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import mapParamsToProps from '../../hocs/router-params-to-props.hoc';
import { associatedCoachSelector } from '../../state/coaches/selectors';

import {
  CoachPerformanceForm,
  CoachPerformanceSummary,
} from '../../components';
import { coach as coachActions } from '../../actions';
import type { PerformanceCalculationRule } from '../../components/form/types';
import type { Coach } from '../../api/types';

type Props = {
  coach: Coach,
  associatedCoachId: number,
  loading: boolean,
  performance: Array<Object>,
  fetchPerformance: (
    associatedCoachId: number,
    date_start: number,
    date_end: number,
  ) => void,
  t: (x: string) => string,
  classes: Object,
};

type State = {
  rule: ?PerformanceCalculationRule,
};

export class CoachPerformance extends Component<Props, State> {
  state = {
    rule: null,
  };

  onSubmit = (formData: Object) => {
    const { date_start, date_end } = formData;
    this.props.fetchPerformance(
      this.props.associatedCoachId,
      date_start.unix(),
      date_end.unix(),
    );
    const { pricePerOffer, bonusRules } = formData;
    this.setState({
      rule: {
        pricePerOffer,
        bonusRules,
      },
    });
  };

  render() {
    const { classes, t, loading, performance, coach } = this.props;
    const { rule } = this.state;
    return (
      <Grid container spacing={16} className={classes.container}>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperForm}>
            <Typography variant="title">
              {t('coach.performance.title')}
            </Typography>
            <CoachPerformanceForm onSubmit={this.onSubmit} loading={loading} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper className={classes.paperSummary}>
            <CoachPerformanceSummary
              performance={performance}
              loading={loading}
              rule={rule}
              coach={coach}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    performance: state.coach.performance,
    loading: state.coach.performanceLoading,
    coach: associatedCoachSelector(state, props.associatedCoachId),
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

export default compose(
  withStyles(styles),
  translate(),
  mapParamsToProps(['associatedCoachId']),
  withProps((props) => ({
    associatedCoachId: +props.associatedCoachId,
  })),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CoachPerformance);
