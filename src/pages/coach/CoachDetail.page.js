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
import { canDeleteCoach as canDeleteCoachAPI } from '../../libs/associated-coach/api';
import CoachDetail from '../../libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '../../libs/associated-coach/components/CoachDeleteModal.component';
import type { CoachDetailed } from '../../api/types';
import type { CoachReplacementPreferencesData } from '../../libs/associated-coach/types';
import { getAvailablePrivateServices } from '../../libs/private-service/selectors/private-service';
import WidgetGeneratorDialog from '../../libs/widget/components/WidgetGeneratorDialog.component';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import {
  getEnabledWorkshops,
  getEnabledMetaActivities,
} from '#libs/meta-activity/selectors';
import { getEditableSCTs } from '#libs/category/selectors';
import { getAllDisciplineGroups } from '#libs/replacement-request/selectors';
import { PrivateServiceWithSlots } from '../../libs/private-service/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import {
  DisciplineGroup,
  AssignCoachDisciplineGroupParams,
} from '#libs/replacement-request/types';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import themeSelectors from '#libs/theme/selectors';

import type { OptionCallback } from '../../state/types';
import type { Theme as CompanyTheme } from '#libs/theme/types';

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
  establishmentList: Establishment[],
  establishmentGroupList: EstablishmentGroup[],
  theme: CompanyTheme,
  fetchEstablishments: (data?: { page_size?: number }) => void,
  fetchAllEstablishmentGroup: (companyId: number) => void,
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
    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentGroup(this.props.companyId);
  }

  handleDelete = () => {
    this.props.setDeleteModalOpen(true);
  };

  handleShare = () => {
    this.props.setOpenWidgetDialog(true);
  };

  handleCloseCoachDeleteModal = () => {
    this.props.setDeleteModalOpen(false);
  };

  handleCloseWidgetGeneratorDialog = () => {
    this.props.setOpenWidgetDialog(false);
  };

  handleEdit = () => {
    this.props.startUpdateCoach(this.props.coach);
  };

  handleDeleteCoach = () => {
    this.props.deleteCoach(this.props.coach.id, {
      onSuccess: this.props.goToList,
    });
  };

  render() {
    if (!this.props.coach) {
      return null;
    }
    const { coach, coachPaymentRulesByKind } = this.props;
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <CoachDetail
          activityList={this.props.activityList}
          assignDisciplineGroup={this.props.assignDisciplineGroup}
          categoryList={this.props.SCTList}
          coach={coach}
          coachPaymentRuleGroups={this.props.coachPaymentRuleGroups}
          coachPaymentRulesByKind={coachPaymentRulesByKind}
          companyTheme={this.props.theme}
          disciplineGroupList={this.props.disciplineGroupList}
          editAccessToCoachSpace={this.props.editAccessToCoachSpace}
          establishmentGroupList={this.props.establishmentGroupList}
          establishmentList={this.props.establishmentList}
          goToCoachPerformance={this.props.goToCoachPerformance}
          privateServices={this.props.privateServices}
          setCoachPaymentRule={this.props.setCoachPaymentRule}
          setCoachPaymentRuleGroup={this.props.setCoachPaymentRuleGroup}
          setCoachPrivatePaymentRule={this.props.setCoachPrivatePaymentRule}
          setCoachWorkshopPaymentRule={this.props.setCoachWorkshopPaymentRule}
          startUpdateCoach={this.props.startUpdateCoach}
          updateAssociatedCoachReplacementPreferences={
            this.props.updateAssociatedCoachReplacementPreferences
          }
          updateCoachPrivateSlotsPaymentRule={
            this.props.updateCoachPrivateSlotsPaymentRule
          }
          workshopList={this.props.workshopList}
        />

        <ObjectLevelPermissionProvider
          requiredPermission={[
            'management.coach.allowed_actions.edit',
            'management.coach.allowed_actions.delete',
          ]}
        >
          {([hasEditPermission, hasDeletePermission]) => (
            <BottomActionButtons
              onDelete={hasDeletePermission ? this.handleDelete : null}
              onEdit={hasEditPermission ? this.handleEdit : null}
              onShare={this.handleShare}
            />
          )}
        </ObjectLevelPermissionProvider>

        <CoachDeleteModal
          checkCanDeleteCoach={canDeleteCoachAPI}
          coachToDeleteId={this.props.deleteOpen ? this.props.coach.id : null}
          deleteCoach={this.handleDeleteCoach}
          onClose={this.handleCloseCoachDeleteModal}
        />
        <WidgetGeneratorDialog
          componentType="calendar"
          config={{
            calendar: {
              coaches: [this.props.coachId],
            },
          }}
          onClose={this.handleCloseWidgetGeneratorDialog}
          open={this.props.openWidgetDialog}
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
      theme: themeSelectors.getTheme(state),
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
      SCTList: getEditableSCTs(state),
      activityList: getEnabledMetaActivities(state),
      workshopList: getEnabledWorkshops(state),
      disciplineGroupList: getAllDisciplineGroups(state),
      establishmentList: getAvailableEstablishmentList(state),
      establishmentGroupList: getAssociatedEstablishmentGroup(state),
    }),
    {
      deleteCoach,
      upsertCoachPrivateSlotsPaymentRuleAction:
        updateCoachPrivateSlotsPaymentRule,
      loadPaymentRules: fetchAllCoachPaymentRules,
      loadPaymentRuleGroups: fetchAllCoachPaymentRuleGroups,
      fetchAssociatedCoach,
      fetchActivitiesCompany: fetchActivitiesCompanyAction,
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
      fetchEstablishments: fetchEstablishmentsAction,
      fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
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
