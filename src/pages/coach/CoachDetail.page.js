//  @flow

import React, { Component } from 'react';

import { Grid, Button, withStyles, LinearProgress } from '@material-ui/core';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import { compose, withProps } from 'recompose';

import { coach as coachActions } from '../../actions';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import CoachDetail from '../../libs/associated-coach/detail/CoachDetail.component';
import type { CoachDetailed } from '../../api/types';
import type { PaymentRule } from '../../libs/payment-rules';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  t: TFunction,
  classes: Object,
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  goBack: () => void,
  setCoachPaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  loading: boolean,
};

export class Coach extends Component<Props> {
  render() {
    const { t, classes, loading } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    const { paymentRules, coach, setCoachPaymentRule } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <CoachDetail
              coach={coach}
              paymentRules={paymentRules}
              setCoachPaymentRule={setCoachPaymentRule}
              goToCoachPerformance={this.props.goToCoachPerformance}
              startUpdateCoach={this.props.startUpdateCoach}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={this.props.goBack}
              size="large"
              color="secondary"
              variant="outlined"
              className={classes.backButton}
            >
              {t('navigation.goBack')}
            </Button>
          </Grid>
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
    paymentRules: paymentRulesSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    startUpdateCoach: (...args) => dispatch(coachActions.startUpdate(...args)),
    setCoachPaymentRule: (...args) =>
      dispatch(coachActions.setCoachPaymentRule(...args)),
    goToCreateCoach: () => dispatch(routerPush('/coach/add')),
    goToCoachPerformance: (coach) =>
      dispatch(routerPush(`/coach/${coach.associated_coach_id}/performance`)),
    goBack: () => dispatch(routerPush('/coach')),
  };
}

const styles = (theme) => ({
  backButton: {
    marginBottom: theme.spacing.unit,
  },
});

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withNamespaces(),
  withProps(({ associatedCoaches, match }) => ({
    coach: associatedCoaches.find(
      (coach) => coach.id === parseInt(match.params.coachId, 10),
    ),
  })),
  withDrawer(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(Coach);
