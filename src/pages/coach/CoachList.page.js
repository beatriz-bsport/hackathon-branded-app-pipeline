// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import {
  CircularProgress,
  Paper,
  List,
  withStyles,
  Grid,
} from '@material-ui/core';

import i18next from 'i18next';
import { coach as coachActions } from '../../actions';
import type { Coach } from '../../api/types';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

import ConnectedCoachCard from '../../libs/associated-coach/list/CoachCard.component';
import CoachListItem from '../../libs/associated-coach/list/CoachListItem.component';

type Props = {
  loading: boolean,
  paymentRules: Array<PaymentRule>,
  setCoachPaymentRule: (*) => void,
  associatedCoaches: Array<Coach>,

  goToCoachPerformance: (coach: Coach) => void,
  goToCoachEditForm: (coach: Coach) => void,
  goToCoachDetail: (coachId: number) => void,

  isCardView: boolean,
};

export class CoachList extends Component<Props> {
  render() {
    if (this.props.loading) {
      return <CircularProgress />;
    }
    const {
      associatedCoaches,
      paymentRules,
      setCoachPaymentRule,
      goToCoachEditForm,
      goToCoachPerformance,
      goToCoachDetail,
    } = this.props;

    if (this.props.isCardView) {
      return (
        <Grid container direction="row" spacing={16}>
          {associatedCoaches.map((coach) => (
            <Grid item xs={12} md={6} key={coach.id}>
              <ConnectedCoachCard
                coach={coach}
                onClickUpdate={() => goToCoachEditForm(coach)}
                paymentRules={paymentRules}
                setCoachPaymentRule={setCoachPaymentRule}
                goToCoachPerformance={() => goToCoachPerformance(coach)}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
    return (
      <Paper>
        <List component="nav" dense disablePadding>
          {this.props.associatedCoaches.map((coach) => (
            <CoachListItem
              divider
              coach={coach}
              onCoachSelected={() => goToCoachDetail(coach.id)}
            />
          ))}
        </List>
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.coach.loading,
    associatedCoaches: state.coach.companyAssociated,
    paymentRules: paymentRulesSelector(state),
  };
}

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default compose(
  connect(
    mapStateToProps,
    (dispatch) => ({
      goToCoachPerformance: (coach) =>
        dispatch(push(`/coach/${coach.associated_coach_id}/performance`)),
      goToCoachEditForm: (...args) =>
        dispatch(coachActions.startUpdate(...args)),
      setCoachPaymentRule: (...args) =>
        dispatch(coachActions.setCoachPaymentRule(...args)),
      goToCreateCoach: () => dispatch(push('/coach/add')),
      goToCoachDetail: (coachId) => dispatch(push(`/coach/${coachId}`)),
    }),
  ),
  withNamespaces(),
  withStyles(styles),
  withBottomButtons({
    addButton: { path: '/coach/add', text: i18next.t('coach.addCoach') },
    switchButton: true,
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.coachList')),
)(CoachList);
