import React from 'react';

import { ConnectedProps, connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'connected-react-router';
import { compose, withState, withHandlers } from 'recompose';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import withTitle from '#src/hocs/with-title.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import {
  CoachPaymentRulesSelector,
  CoachPaymentRuleByKindSelector,
  getCoachPaymentRuleGroups,
} from '#src/libs/coach-payment-rules/selectors';
import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
} from '#src/libs/coach-payment-rules/actions';
import { getCoach } from '#src/libs/associated-coach/selectors';

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
} from '#src/libs/associated-coach/actions';
import { fetchDisciplineGroupList as fetchDisciplineGroupListAction } from '#src/libs/replacement-request/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#src/libs/meta-activity/actions';
import { fetchAllPrivateServices as fetchAllPrivateServicesAction } from '#src/libs/private-service/actions';
import CoachDetail from '#src/libs/associated-coach/components/CoachDetail.component';
import CoachDeleteModal from '#src/libs/associated-coach/components/CoachDeleteModal.component';
import type {
  Coach as CoachType,
  UpdateCoachPrivateSlotsPaymentRuleData,
} from '#src/libs/associated-coach/types';
import { getAvailablePrivateServices } from '#src/libs/private-service/selectors/private-service';
import WidgetGeneratorDialog from '#src/libs/widget/components/WidgetGeneratorDialog.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import {
  getEnabledWorkshops,
  getEnabledMetaActivities,
} from '#src/libs/meta-activity/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import { getAllDisciplineGroups } from '#src/libs/replacement-request/selectors';
import type { MetaActivity } from '#src/libs/meta-activity/types';

import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
} from '#src/libs/establishment/selectors';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#src/libs/establishment/actions';
import type { EstablishmentGroup } from '#src/libs/establishment/types';
import themeSelectors from '#src/libs/theme/selectors';

import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';

type Props = {
  coachId: number;
  setCoachPaymentRule: (coachId: number, coach_payment_rule_id: number) => void;
  setCoachWorkshopPaymentRule: (
    coachId: number,
    coach_payment_rule_id: number,
  ) => void;
  setDeleteModalOpen: (openModal: boolean) => void;
  deleteOpen: boolean;
  setOpenWidgetDialog: (open: boolean) => void;
  openWidgetDialog: boolean;
  updateCoachPrivateSlotsPaymentRule: (
    id: number,
    data: UpdateCoachPrivateSlotsPaymentRuleData,
    options?: OptionCallback,
  ) => void;
  activityList: MetaActivity[];
  workshopList: MetaActivity[];
  establishmentGroupList: EstablishmentGroup[];
  editAccessToCoachSpace: (hasAccessToCoachSpace: boolean) => void;
} & ConnectedProps<typeof connector>;

export class Coach extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPaymentRules();
    this.props.loadPaymentRuleGroups();
    this.props.fetchAssociatedCoach(this.props.coachId);
    this.props.fetchActivitiesCompany(this.props.companyId);
    this.props.fetchDisciplineGroupList();
    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentGroup(this.props.companyId);
    this.props.fetchAllPrivateServices();
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
          {([hasEditPermission, hasDeletePermission]: [boolean, boolean]) => (
            <BottomActionButtons
              onDelete={hasDeletePermission ? this.handleDelete : null}
              onEdit={hasEditPermission ? this.handleEdit : null}
              onShare={this.handleShare}
            />
          )}
        </ObjectLevelPermissionProvider>

        <CoachDeleteModal
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

const connector = connect(
  (state: RootState, { coachId }: { coachId: number }) => ({
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
    goToCoachPerformance: (coach: CoachType) =>
      routerPush(`/coach/${coach.associated_coach_id}/performance`),
    goToList: () => routerPush('/coach'),
    editAccessToCoachSpace: editAccessToCoachSpaceAction,
    fetchDisciplineGroupList: fetchDisciplineGroupListAction,
    assignDisciplineGroup,
    updateAssociatedCoachReplacementPreferences,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchAllPrivateServices: () =>
      fetchAllPrivateServicesAction({ mine: true }),
  },
);

export default compose<Props, {}>(
  withRouter,
  routerParamsToProps({ coachId: 'coachId:number' }),
  withState('deleteOpen', 'setDeleteModalOpen', false),
  withState('openWidgetDialog', 'setOpenWidgetDialog', false),
  connector,
  withTitle(({ coach }) => {
    return coach ? `${coach.name}` : '';
  }),
  withHandlers({
    editAccessToCoachSpace:
      ({ coachId, editAccessToCoachSpace }) =>
      (has_access_to_coach_space: boolean) => {
        editAccessToCoachSpace({ id: coachId, has_access_to_coach_space });
      },
    updateCoachPrivateSlotsPaymentRule:
      ({ coachId, upsertCoachPrivateSlotsPaymentRuleAction }) =>
      (coachData: UpdateCoachPrivateSlotsPaymentRuleData) => {
        upsertCoachPrivateSlotsPaymentRuleAction(coachId, coachData);
      },
  }),
)(Coach);
