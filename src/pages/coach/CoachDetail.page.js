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
  assignDisciplineGroup,
  updateAssociatedCoachReplacementPreferences,
} from '../../libs/associated-coach/actions';
import { fetchDisciplineGroupList as fetchDisciplineGroupListAction } from '../../libs/replacement-request/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '../../libs/meta-activity/actions';
import { fetchSCT as fetchSCTAction } from '../../libs/category/actions';
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';
import type { CoachReplacementPreferencesData } from '../../libs/associated-coach/types';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';
import {
  getEnabledWorkshops,
  getEnabledMetaActivities,
} from '#libs/meta-activity/selectors';
import { getSCTs } from '#libs/category/selectors';
import { getAllDisciplineGroups } from '#libs/replacement-request/selectors';
import { PrivateServiceWithSlots } from '../../libs/private-service/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import {
  DisciplineGroup,
  AssignCoachDisciplineGroupParams,
} from '#libs/replacement-request/types';

import type { OptionCallback } from '../../state/types';

type Props = {
  companyId: number,
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
  loading: boolean,
  setOpenWidgetDialog: (open: boolean) => void,
  openWidgetDialog: Boolean,
  loadPaymentRules: () => void,
  loadPaymentRuleGroups: () => void,
  id: number,
  fetchAssociatedCoach: (number) => void,
  fetchDisciplineGroupList: () => void,
  fetchActivitiesCompany: (
    id: number,
    params?: any,
    options?: OptionCallback,
  ) => void,
  assignDisciplineGroup: (
    params: AssignCoachDisciplineGroupParams,
    options?: OptionCallback,
  ) => void,
  fetchSCT: () => void,
  setDeleteModalOpen: (boolean) => void,
  deleteOpen: boolean,
  deleteCoach: (id: number, options: ?OptionCallback) => void,
  updateCoachPrivateSlotsPaymentRule: (
    data: {
      id: number,
      associated_coach_id: number,
      private_slots_coach_payment_rules: Array<{
        private_slot: number,
        coach_payment_rule: number,
      }>,
    },
    options?: OptionCallback,
  ) => void,
  privateServices: Array<PrivateServiceWithSlots>,
  disciplineGroupList: DisciplineGroup[],
  activityList: MetaActivity[],
  workshopList: MetaActivity[],
  SCTList: SCT[],
  editAccessToCoachSpace: (hasAccessToCoachSpace: boolean) => void,
  updateAssociatedCoachReplacementPreferences: (
    id: number,
    data: CoachReplacementPreferencesData,
  ) => void,
};

export class Coach extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPaymentRules();
    this.props.loadPaymentRuleGroups();
    this.props.fetchAssociatedCoach(this.props.coachId);
    this.props.fetchActivitiesCompany(this.props.companyId);
    this.props.fetchDisciplineGroupList();
    this.props.fetchSCT();
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
          updateCoachPrivateSlotsPaymentRule={
            this.props.updateCoachPrivateSlotsPaymentRule
          }
          privateServices={this.props.privateServices}
          activityList={this.props.activityList}
          workshopList={this.props.workshopList}
          categoryList={this.props.SCTList}
          disciplineGroupList={this.props.disciplineGroupList}
          assignDisciplineGroup={this.props.assignDisciplineGroup}
          updateAssociatedCoachReplacementPreferences={
            this.props.updateAssociatedCoachReplacementPreferences
          }
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
      companyId: state.theme.theme.company,
      loading: state.coach.loading,
      isCoach: state.auth.is_coach,
      isManager: state.auth.is_manager,
      coachPaymentRulesList: CoachPaymentRulesSelector(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      coachPaymentRuleGroups: getCoachPaymentRuleGroups(state),
      coach: getCoach(state, coachId),
      privateSlots: state.privateService.privateSlot.byId,
      privateServices: getAvailablePrivateServices(state),
      SCTList: getSCTs(state),
      activityList: getEnabledMetaActivities(state),
      workshopList: getEnabledWorkshops(state),
      disciplineGroupList: getAllDisciplineGroups(state),
    }),
    {
      deleteCoach,
      upsertCoachPrivateSlotsPaymentRuleAction:
        updateCoachPrivateSlotsPaymentRule,
      loadPaymentRules: fetchAllCoachPaymentRules,
      loadPaymentRuleGroups: fetchAllCoachPaymentRuleGroups,
      fetchAssociatedCoach,
      fetchActivitiesCompany: fetchActivitiesCompanyAction,
      fetchSCT: fetchSCTAction,
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
      fetchDisciplineGroupList: fetchDisciplineGroupListAction,
      assignDisciplineGroup,
      updateAssociatedCoachReplacementPreferences,
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
    updateCoachPrivateSlotsPaymentRule:
      ({ coachId, upsertCoachPrivateSlotsPaymentRuleAction }) =>
      (coachData) => {
        upsertCoachPrivateSlotsPaymentRuleAction(coachId, coachData);
      },
  }),
)(Coach);
