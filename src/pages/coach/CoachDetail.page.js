//  @flow

import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import { compose, withState } from 'recompose';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';

import { fetchPaymentRules } from '../../libs/payment-rules/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { paymentRulesSelector } from '../../libs/payment-rules/selectors';
import { getCoach } from '../../libs/associated-coach/selectors';
import type { PaymentRule } from '../../libs/payment-rules';

import {
  startUpdate,
  setCoachPaymentRule,
  deleteCoach,
  fetchAssociatedCoach,
} from '../../libs/associated-coach/actions';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';

type Props = {
  coach: CoachDetailed,
  paymentRules: PaymentRule[],
  setCoachPaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  goToList: () => void,
  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (id: number) => void,
  loading: boolean,

  loadPaymentRules: () => void,
  id: number,
  fetchAssociatedCoach: (number) => void,
  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (
    id: number,
    options: ?{ onSucces: ?() => void, onError: ?() => void },
  ) => void,
  goToList: () => void,
};

export class Coach extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPaymentRules();
    this.props.fetchAssociatedCoach(this.props.coachId);
  }

  render() {
    if (this.props.loading || !this.props.coach) {
      return <LinearProgress />;
    }
    const { paymentRules, coach } = this.props;
    return (
      <div style={{ height: '100%' }}>
        {this.props.loading ? <LinearProgress /> : null}
        <CoachDetail
          coach={coach}
          paymentRules={paymentRules}
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          goToCoachPerformance={this.props.goToCoachPerformance}
          startUpdateCoach={this.props.startUpdateCoach}
        />
        <BottomActionButtons
          onEdit={() => this.props.startUpdateCoach(coach)}
          onDelete={() => this.props.setDeleteModalOpen(true)}
        />
        <CoachDeleteModal
          coachToDeleteId={this.props.deleteOpen ? this.props.coach.id : null}
          onClose={() => this.props.setDeleteModalOpen(false)}
          checkCanDeleteCoach={canDeleteCoachAPI}
          deleteCoach={() => {
            this.props.deleteCoach(coach.id, {
              onSuccess: this.props.goToList,
            });
          }}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  routerParamsToProps({ coachId: 'coachId:number' }),
  withState('deleteOpen', 'setDeleteModalOpen', false),
  connect(
    (state, { coachId }) => ({
      loading: state.coach.loading,
      isCoach: state.auth.is_coach,
      isManager: state.auth.is_manager,
      paymentRules: paymentRulesSelector(state),
      coach: getCoach(state, coachId),
    }),
    {
      deleteCoach,
      loadPaymentRules: fetchPaymentRules,
      fetchAssociatedCoach,
      startUpdateCoach: startUpdate,
      setCoachPaymentRule,
      goToCreateCoach: () => routerPush('/coach/add'),
      goToCoachPerformance: (coach) =>
        routerPush(`/coach/${coach.associated_coach_id}/performance`),
      goToList: () => routerPush('/coach'),
    },
  ),
  // withProps(({ associatedCoaches, match }) => ({
  //   coach: associatedCoaches.find(
  //     (coach) => coach.id === parseInt(match.params.coachId, 10),
  //   ),
  // })),
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(Coach);
