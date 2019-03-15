// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Grid } from '@material-ui/core';

import i18next from 'i18next';
import { coach as coachActions } from '../../actions';
import CoachCard from '../../libs/associated-coach/list/CoachCard.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import type { Coach } from '../../api/types';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  loading: boolean,
  isManager: boolean,
  isCoach: boolean,
  selfCoach: Coach,
  paymentRules: Array<PaymentRule>,
  setCoachPaymentRule: (*) => void,
  associatedCoaches: Array<Coach>,
  startUpdateCoach: (coach: Coach) => void,
};

const ConnectedCoachCard = compose(
  connect(
    null,
    (dispatch, { coach }) => ({
      goToCoachPerformance: () =>
        dispatch(push(`/coach/${coach.associated_coach_id}/performance`)),
    }),
  ),
)(CoachCard);

function SelfCoachCard(props: { isCoach: boolean, selfCoach: Coach }) {
  const { isCoach, selfCoach } = props;
  if (!isCoach) {
    return null;
  }

  return (
    <Grid item xs={12} md={4} xl={4}>
      <ConnectedCoachCard coach={selfCoach} />
    </Grid>
  );
}

function AssociatedCoaches(props: {
  associatedCoaches: Array<Coach>,
  isManager: boolean,
}) {
  const {
    associatedCoaches,
    isManager,
    paymentRules,
    setCoachPaymentRule,
  } = props;

  if (!isManager) {
    return null;
  }

  return associatedCoaches.map((coach) => (
    <Grid item xs={12} md={6} key={coach.id}>
      <ConnectedCoachCard
        coach={coach}
        onClickUpdate={() => props.onClickUpdate(coach)}
        paymentRules={paymentRules}
        setCoachPaymentRule={setCoachPaymentRule}
      />
    </Grid>
  ));
}

export class CoachList extends Component<Props> {
  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }

    const {
      isManager,
      isCoach,
      selfCoach,
      associatedCoaches,
      paymentRules,
      setCoachPaymentRule,
    } = this.props;

    return (
      <div>
        <SelfCoachCard isCoach={isCoach} selfCoach={selfCoach} />
        <Grid container spacing={8}>
          <AssociatedCoaches
            associatedCoaches={associatedCoaches}
            isManager={isManager}
            onClickUpdate={this.props.startUpdateCoach}
            paymentRules={paymentRules}
            setCoachPaymentRule={setCoachPaymentRule}
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
    paymentRules: paymentRulesSelector(state),
  };
}

export default compose(
  connect(
    mapStateToProps,
    (dispatch) => ({
      startUpdateCoach: (...args) =>
        dispatch(coachActions.startUpdate(...args)),
      setCoachPaymentRule: (...args) =>
        dispatch(coachActions.setCoachPaymentRule(...args)),
      goToCreateCoach: () => dispatch(push('/coach/add')),
    }),
  ),
  withNamespaces(),
  withBottomButtons({
    addButton: { path: '/coach/add', text: i18next.t('coach.addCoach') },
  }),
)(withDrawer('coachList')(CoachList));
