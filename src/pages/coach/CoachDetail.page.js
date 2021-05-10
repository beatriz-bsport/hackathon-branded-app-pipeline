//  @flow

import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'connected-react-router';
import { compose, withState } from 'recompose';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';

import { fetchAllCoachPaymentRules } from '../../libs/coach-payment-rules/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
} from '../../libs/coach-payment-rules/selectors';
import { getCoach } from '../../libs/associated-coach/selectors';
import type { CoachPaymentRule as CoachPaymentRuleType } from '../../libs/coach-payment-rules/types';
import {
  startUpdate,
  setCoachPaymentRule,
  setCoachPrivatePaymentRule,
  deleteCoach,
  fetchAssociatedCoach,
} from '../../libs/associated-coach/actions';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';
import WidgetGeneratorDialog from '../settings/WidgetGenerator/WidgetGeneratorDialog';

type Props = {
  coachId: number,
  coach: CoachDetailed,
  coachPaymentRulesByKind: Object<CoachPaymentRuleType[]>,
  setCoachPaymentRule: (any) => void,
  setCoachPrivatePaymentRule: (any) => void,
  startUpdateCoach: (coach: CoachDetailed) => void,
  goToCoachPerformance: (coach: CoachDetailed) => void,
  goToList: () => void,
  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (id: number) => void,
  loading: boolean,
  setOpenWidgetDialog: () => void,
  openWidgetDialog: Boolean,
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
    if (this.props.loading && !this.props.coach) {
      return <LinearProgress />;
    }
    const { coach, coachPaymentRulesByKind } = this.props;
    return (
      <div style={{ height: '100%' }}>
        {this.props.loading ? <LinearProgress /> : null}
        <CoachDetail
          coach={coach}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
          goToCoachPerformance={this.props.goToCoachPerformance}
          startUpdateCoach={this.props.startUpdateCoach}
        />
        <BottomActionButtons
          onEdit={() => this.props.startUpdateCoach(coach)}
          onDelete={() => this.props.setDeleteModalOpen(true)}
          onShare={() => this.props.setOpenWidgetDialog(true)}
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

        <WidgetGeneratorDialog
          open={this.props.openWidgetDialog}
          onClose={() => this.props.setOpenWidgetDialog(false)}
          componentType="calendar"
          config={{
            calendar: {
              coaches: [this.props.coachId],
            },
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
  withState('openWidgetDialog', 'setOpenWidgetDialog', false),
  connect(
    (state, { coachId }) => ({
      loading: state.coach.loading,
      isCoach: state.auth.is_coach,
      isManager: state.auth.is_manager,
      coachPaymentRulesList: CoachPaymentRulesSelector(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      coach: getCoach(state, coachId),
    }),
    {
      deleteCoach,
      loadPaymentRules: fetchAllCoachPaymentRules,
      fetchAssociatedCoach,
      startUpdateCoach: startUpdate,
      setCoachPaymentRule,
      setCoachPrivatePaymentRule,
      goToCreateCoach: () => routerPush('/coach/add'),
      goToCoachPerformance: (coach) =>
        routerPush(`/coach/${coach.associated_coach_id}/performance`),
      goToList: () => routerPush('/coach'),
    },
  ),
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
)(Coach);
