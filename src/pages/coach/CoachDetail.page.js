//  @flow

import React from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import withTitle from '../../hocs/with-title.hoc';
import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
} from '../../libs/coach-payment-rules/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getCoachPaymentRuleGroups,
} from '../../libs/coach-payment-rules/selectors';
import { getCoach } from '../../libs/associated-coach/selectors';
import type {
  CoachPaymentRule as CoachPaymentRuleType,
  CoachPaymentRuleGroup as CoachPaymentRuleGroupType,
} from '../../libs/coach-payment-rules/types';
import {
  startUpdate,
  setCoachPaymentRule,
  setCoachWorkshopPaymentRule,
  setCoachPrivatePaymentRule,
  setCoachPaymentRuleGroup,
  deleteCoach,
  fetchAssociatedCoach,
  updateCoachPrivateSlotsPaymentRule,
  editAccessToCoachSpace as editAccessToCoachSpaceAction,
} from '../../libs/associated-coach/actions';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';
import { PrivateServiceWithSlots } from '../../libs/private-service/types';

type Props = {
  coachId: number,
  coach: CoachDetailed,
  coachPaymentRulesByKind: Object<CoachPaymentRuleType[]>,
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroupType>,
  setCoachPaymentRule: (coachId: number, coach_payment_rule_id: number) => void,
  setCoachWorkshopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
  setCoachPrivatePaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
  setCoachPaymentRuleGroup: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void,
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
  loadPaymentRuleGroups: () => void,
  id: number,
  fetchAssociatedCoach: (number) => void,
  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (
    id: number,
    options: ?{ onSucces: ?() => void, onError: ?() => void },
  ) => void,
  goToList: () => void,
  updateCoach: (
    data: any,
    options: { onSuccess?: () => void, onError?: () => void },
  ) => void,
  privateServices: Array<PrivateServiceWithSlots>,
  editAccessToCoachSpace: (hasAccessToCoachSpace: boolean) => void,
};

export class Coach extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPaymentRules();
    this.props.loadPaymentRuleGroups();
    this.props.fetchAssociatedCoach(this.props.coachId);
  }

  render() {
    if (!this.props.coach) {
      return null;
    }
    const { coach, coachPaymentRulesByKind } = this.props;
    return (
      <div style={{ height: '100%' }}>
        {this.props.loading ? <LinearProgress /> : null}
        <CoachDetail
          editAccessToCoachSpace={this.props.editAccessToCoachSpace}
          coach={coach}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          setCoachWorkshopPaymentRule={this.props.setCoachWorkshopPaymentRule}
          setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
          goToCoachPerformance={this.props.goToCoachPerformance}
          startUpdateCoach={this.props.startUpdateCoach}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
          updateCoach={this.props.updateCoach}
          privateServices={this.props.privateServices}
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
      coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
      coach: getCoach(state, coachId),
      privateSlots: state.privateService.privateSlot.byId,
      privateServices: getAvailablePrivateServices(state),
    }),
    {
      deleteCoach,
      upsertCoachAction: updateCoachPrivateSlotsPaymentRule,
      loadPaymentRules: fetchAllCoachPaymentRules,
      loadPaymentRuleGroups: fetchAllCoachPaymentRuleGroups,
      fetchAssociatedCoach,
      startUpdateCoach: startUpdate,
      setCoachPaymentRule,
      setCoachPrivatePaymentRule,
      setCoachWorkshopPaymentRule,
      setCoachPaymentRuleGroup,
      goToCreateCoach: () => routerPush('/coach/add'),
      goToCoachPerformance: (coach) =>
        routerPush(`/coach/${coach.associated_coach_id}/performance`),
      goToList: () => routerPush('/coach'),
      editAccessToCoachSpace: editAccessToCoachSpaceAction,
    },
  ),
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
  withHandlers({
    editAccessToCoachSpace:
      ({ coachId, editAccessToCoachSpace }) =>
      (has_access_to_coach_space) => {
        editAccessToCoachSpace({ id: coachId, has_access_to_coach_space });
      },
    updateCoach:
      ({ coachId, upsertCoachAction }) =>
      (coachData) => {
        upsertCoachAction(coachId, coachData);
      },
  }),
)(Coach);
