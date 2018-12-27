// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';

import { withStyles, CircularProgress, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { coach as coachActions } from '../../actions';
import { CoachCard } from '../../components';
import type { Coach } from '../../api/types';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';

const styles = (theme) => ({
  button: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
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
      return <CircularProgress />;
    }

    const {
      isManager,
      classes,
      t,
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
  withStyles(styles),
  translate(),
)(CoachList);
