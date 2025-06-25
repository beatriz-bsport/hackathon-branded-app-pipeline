import React from 'react';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { push as pushRouter } from 'connected-react-router';

import { withTranslation, WithTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { MaterialStyleType, WithHandlerType } from '#src/utils/types';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

// SMARTLIST
import {
  smartListCreate,
  smartListUpdate,
  fetchSmartListFilters,
  updateFilter,
  deleteFilter,
  createFilter,
  fetchAutoTagRules,
  smartLitAutTagCreate,
  updateSmartListAutoTag,
  smartListAutoTagDelete,
  retrieveSmartListAutomatedCampaign,
  fetchSmartListAutomatedCampaign,
  createSmartListAutomatedCampaign,
  updateSmartListAutomatedCampaign,
  deleteSmartListAutomatedCampaign,
  fetchCadencesUsingSmartlist,
  getMemberTableBackground,
  fetchStoredCsvExports,
} from '#src/libs/smart-list/actions';
import {
  getSmartListFilters,
  getSmartList,
  getSmartListAutoTag,
  getSmartListAutomatedCampaign,
  getAutomatedCampaign,
  getCadencesUsingSmartlist,
  getCadenceIdsUsingSmartlistLoading,
  getSmartListCsvExportLink,
  getSmartListCsvExportDate,
} from '#src/libs/smart-list/selectors';
import {
  fetchSmartListMembers as fetchSmartListMembersAPI,
  getMemberTable,
} from '#src/libs/smart-list/api';
import type {
  SmartList,
  AutoTagRule,
  AutomatedCampaign,
} from '#src/libs/smart-list/types';

// PAYMENT PACK
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk,
} from '#src/libs/payment-packs/actions';
import { getEnabled as getPaymentPackEnabled } from '#src/libs/payment-packs/selectors';

// PRIVATE PASS | PRIVATE SERVICE
import {
  fetchPrivatePassList,
  fetchPrivatePassBulk,
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
} from '#src/libs/private-service/actions';
import { getPrivatePassAvailable } from '#src/libs/private-service/selectors/private-pass';
import {
  _getPrivateServicesById,
  getAvailablePrivateServices,
} from '#src/libs/private-service/selectors/private-service';
import type { PrivateService } from '#src/libs/private-service/types';

// COMMUNICATION
import { sendCommunication as sendCommunicationAction } from '#src/libs/communication/actions';
import {
  createCommunicationScheduled as createCommunicationScheduledAction,
  fetchCommunicationScheduledListForSmartlist as fetchCommunicationScheduledListForSmartlistAction,
  retrieveCommunicationScheduled as retrieveCommunicationScheduledAction,
  deleteCommunicationScheduled as deleteCommunicationScheduledAction,
  updateCommunicationScheduled as updateCommunicationScheduledAction,
  sendNowCommunicationScheduled as sendNowCommunicationScheduledAction,
  getUnreadAnswersCount as getUnreadAnswersCountAction,
  fetchSmartListPopupSendings,
  sendSmartListPopup,
} from '#src/libs/communication-v2/actions';
import type {
  MemberMailData,
  SendDirectCommunicationType,
} from '#src/libs/communication/types';
import type {
  CommunicationContext,
  CommunicationScheduled,
  CommunicationScheduledCreate,
} from '#src/libs/communication-v2/types';

// MEMBER
import { fetchCommunicationsPaginatedMembers } from '#src/libs/member/actions';
import { getPaginatedMembers } from '#src/libs/member/selectors';

// METAACTIVITY
import {
  fetchMetaActivityBulk,
  fetchCompanyActivities as fetchAllActivitiesAction,
} from '#src/libs/meta-activity/actions';
import { getMetaActivities } from '#src/libs/meta-activity/selectors';

// TAGS
import { fetchTags } from '#src/libs/tag/actions';
import tagSelectors from '#src/libs/tag/selectors';
import type { ResolvedGenericTags } from '#src/libs/email-editor/types';

// EMAIL
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
} from '#src/libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#src/libs/email-editor/selectors';

// ESTABLISHMENT
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '#src/libs/establishment/actions';
import { getAllEstablishments } from '#src/libs/establishment/selectors';

// COACHES
import {
  fetchAssociatedCoachesList as fetchCoaches,
  fetchCoachBulk,
} from '#src/libs/associated-coach/actions';

import { getCoaches } from '#src/libs/associated-coach/selectors';

// LEVEL
import { fetchLevelList as fetchLevelListAction } from '#src/libs/level/actions';
import { getAllCustomLevels } from '#src/libs/level/selectors';

// CUSTOM FORMS
import {
  fetchAllCustomForm,
  fetchCustomFormBulk,
} from '#src/libs/custom-form/actions';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import {
  showInformativeDialog,
  showActionDialog,
  DialogActionEnum,
} from '#src/components/genericDialog/CustomDialogs';
import FiltersPanel from '#src/libs/smart-list/components/FiltersPanel.component';
// @ts-expect-error
import AutoTagPanel from '#src/libs/smart-list/components/AutoTagPanel.component';
// @ts-expect-error
import SmartListEditDialog from '#src/libs/smart-list/components/SmartListFormDialog.component';
import AutomatedCampaignDrawer from '#src/libs/smart-list/components/automated_campaign/AutomatedCampaignDrawer.component';
import AutomatedCampaignPanel from '#src/libs/smart-list/components/automated_campaign/AutomatedCampaignPanel.component';
import MemberTable from '#src/libs/member/MemberTable.component';
import CommunicationDrawerDEPRECATED from '#src/libs/communication/components/CommunicationDrawer.component';
import { getAllCustomForm } from '#src/libs/custom-form/selectors';

// COMMUNICATION CHAT
import CommunicationDrawer from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_SMARTLIST } from '#src/libs/communication-v2/constants';

import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';
import GenericDeleteDialog from '#src/components/genericDialog/GenericDeleteDialog.component';

import {
  getCommunicationScheduledForSmartlist,
  getCommunicationScheduledBySmartlistLoading,
  getCommunicationScheduledBySmartlistTotal,
  getSmartListPopupSendingList,
} from '#src/libs/communication-v2/selectors';

// CADENCES
import { fetchCadenceList } from '#src/libs/sequential_marketing/actions';
import { UPSELL_IDENTIFIER_CADENCE } from '#src/libs/platform-billing/upsell-identifiers';
import Config from '../../config';
import { snackbarError } from '../../actions/snackbar.actions';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';

import {
  checkIsMessageDeletable,
  checkIsMessageSchedulable,
} from '#src/utils/communicationScheduledHelper';

type OwnProps = {
  id: number;
  memberTitle: string;
  openSendEmail: boolean;
  setOpenSendEmail: (open: boolean) => void;
  setCloseMemberTable: (open: boolean) => void;
  openAutoTagRulesDialog: boolean;
  closeMemberTable: boolean;
  automatedCampaignCreateEventkind: number;
  setAutomatedCampaignCreateEventkind: (kind: number | null) => void;
  selectAutomatedCampaignId: number | null;
  setSelectAutomatedCampaignId: (id: number | null) => void;
  resolvedGenericTags: ResolvedGenericTags;
  openCommunicationChatDrawer: boolean;
  setOpenCommunicationChatDrawer: (open: boolean) => void;
  getUnreadAnswersCountAction: (params: CommunicationContext) => void;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type OwnAndConnectedProps = OwnProps &
  ConnectedProps<typeof connector> & { privateServices: Array<PrivateService> };

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  communicationDataToSend: Partial<MemberMailData> | null;
  communicationScheduledSelected: CommunicationScheduled | null;
  isDeleteCommunicationScheduledDialogOpen: boolean;
  isSendCommunicationDuringNighttimeDialogOpen: boolean;
  isSendNowCommunicationScheduledDialogOpen: boolean;
  isTooLateToUpdateCommunicationScheduledDialogOpen: boolean;
  onValueChangeActiveMemberFetch: boolean;
  openEditDialog: boolean;
  resetMembersFetchForCommunication: boolean;
};

export class SmartListDetailMember extends React.Component<Props, State> {
  state: State = {
    communicationDataToSend: null,
    communicationScheduledSelected: null,
    isDeleteCommunicationScheduledDialogOpen: false,
    isSendCommunicationDuringNighttimeDialogOpen: false,
    isSendNowCommunicationScheduledDialogOpen: false,
    isTooLateToUpdateCommunicationScheduledDialogOpen: false,
    onValueChangeActiveMemberFetch: false,
    openEditDialog: false,
    resetMembersFetchForCommunication: true,
  };

  componentDidMount() {
    const params = {
      context_identifier: CONTEXT_SMARTLIST,
      context_object_id: this.props.id,
    };
    this.props.fetchSmartListFilters(this.props.id);
    this.props.fetchTags();
    this.props.fetchAllAutoTagRulesAction();
    this.props.fetchSmartListAutomatedCampaign({
      smartlist_id: this.props.id,
      exclude_disabled: true,
    });
    this.handleFetchLevel();
    this.props.fetchResolvedGenericTags();
    this.props.getUnreadAnswersCountAction(params);
    this.props.fetchSmartListPopupSendings({ smartlist_id: this.props.id });
    this.props.fetchStoredCsvExports(this.props.id);
    if (this.hasUpsellIdentifier(UPSELL_IDENTIFIER_CADENCE)) {
      this.props.fetchCadencesUsingSmartlist(this.props.id, {
        onSuccess: (cadence_ids) => {
          const uniq_ids = uniq(cadence_ids ?? []);
          if (uniq_ids?.length !== 0) {
            this.props.fetchCadenceList({ id__in: cadence_ids });
          }
        },
      });
    }
    this.props.fetchCommunicationScheduledListForSmartlist({
      smartlistId: this.props.id,
    });
  }

  handleFetchLevel = () => {
    this.props.fetchLevelList({
      company: this.props.companyId,
    });
  };

  createFilter = (
    filter_identifier: number,
    filterData: any,
    options?: OptionCallback,
  ) => {
    const filter = filterData;
    filter.smartlist = this.props.id;
    this.props.createFilter(filter_identifier, filter, this.props.id, {
      onSuccess: () => options?.onSuccess?.(),
      callback: () => {
        this.setState((prevState) => ({
          onValueChangeActiveMemberFetch:
            !prevState.onValueChangeActiveMemberFetch,
        }));
        this.props.setCloseMemberTable(true);
      },
    });
  };

  updateFilter = (
    filterNameId: number,
    filterId: number,
    data: any,
    options?: OptionCallback,
  ) => {
    this.props.updateFilter(this.props.id, filterNameId, filterId, data, {
      onSuccess: () => options?.onSuccess?.(),
      callback: () => {
        this.setState((prevState) => ({
          onValueChangeActiveMemberFetch:
            !prevState.onValueChangeActiveMemberFetch,
        }));
        this.props.setCloseMemberTable(true);
      },
    });
  };

  deleteFilter = (filterNameId: number, filterId: number) => {
    this.props.deleteFilter(filterNameId, filterId, this.props.id, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch:
          !prevState.onValueChangeActiveMemberFetch,
      }));
      this.props.setCloseMemberTable(true);
    });
  };

  updateSmartList = (smartlist: SmartList) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.smartlist.id, smartlist);
  };

  fetchPaginatedMembers = (page: number, page_size: number) => {
    if (this.state.resetMembersFetchForCommunication) {
      this.props.fetchCommunicationsPaginatedMembers(
        {
          ...this.props.member_filters,
          page,
          page_size,
        },
        {
          onSuccess: () =>
            this.setState({
              resetMembersFetchForCommunication: false,
            }),
        },
      );
    } else {
      this.props.fetchCommunicationsPaginatedMembers({
        ...this.props.member_filters,
        page,
        page_size,
      });
    }
  };

  onAddAutomatedCampaign = (kind: number) => {
    this.props.setAutomatedCampaignCreateEventkind(kind);
    this.props.setOpenCommunicationChatDrawer(true);
  };

  handleCancelAutomateCampaignForm = () => {
    this.props.setOpenCommunicationChatDrawer(false);
    this.props.setSelectAutomatedCampaignId(null);
    this.props.setAutomatedCampaignCreateEventkind(null);
  };

  handleEditAutomatedCampaign = (id: number) => {
    const automatedCampaignEventKind = this.props.smartlist_automated_campaigns
      // @ts-expect-error
      ?.filter(
        (campaign: AutomatedCampaign) => campaign.id === id,
      )?.[0]?.event_kind;
    this.props.setSelectAutomatedCampaignId(id);
    this.props.setAutomatedCampaignCreateEventkind(automatedCampaignEventKind);
    this.props.setOpenCommunicationChatDrawer(true);
  };

  getAlreadyConfiguredCommunicationKind = () => {
    return (
      this.props.smartlist_automated_campaigns
        // @ts-expect-error
        ?.filter(
          (_campaign: AutomatedCampaign) =>
            _campaign?.event_kind ===
            this.props.automatedCampaignCreateEventkind,
        )
        ?.map((aut_co: AutomatedCampaign) => aut_co.communication_kind)
    );
  };

  resetCommunicationDrawerContext = () => {
    this.props.setSelectAutomatedCampaignId(null);
    this.props.setAutomatedCampaignCreateEventkind(null);
    this.setState({
      communicationScheduledSelected: null,
    });
  };

  handleCommunicationDrawerClose = () => {
    this.props.setOpenCommunicationChatDrawer(false);
    this.resetCommunicationDrawerContext();
  };

  handleBackgroundCsvExport = () => {
    // @ts-expect-error
    this.props.getMemberTableBackground(this.props.id);
  };

  hasUpsellIdentifier = (identifier: number) => {
    // Always true if the environement is not production
    // If the environment is production : true if the company
    // has subscribed the upsell corresponding to the identifier
    // in parameter, otherwise false
    return (
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      this.props.featureList
        .map((ups) => ups.upsell_identifier)
        .includes(identifier)
    );
  };

  openTooLateToUpdateCommunicationScheduledDialog = () =>
    this.setState({
      isTooLateToUpdateCommunicationScheduledDialogOpen: true,
    });

  closeTooLateToUpdateCommunicationScheduledDialog = () =>
    this.setState({
      isTooLateToUpdateCommunicationScheduledDialogOpen: false,
    });

  openDeleteCommunicationScheduledDialog = () =>
    this.setState({
      isDeleteCommunicationScheduledDialogOpen: true,
    });

  closeDeleteCommunicationScheduledDialog = () =>
    this.setState({
      isDeleteCommunicationScheduledDialogOpen: false,
    });

  openSendNowCommunicationScheduledDialog = () =>
    this.setState({
      isSendNowCommunicationScheduledDialogOpen: true,
    });

  closeSendNowCommunicationScheduledDialog = () =>
    this.setState({
      isSendNowCommunicationScheduledDialogOpen: false,
    });

  closeSendCommunicationDuringNighttimeDialog = () =>
    this.setState({
      isSendCommunicationDuringNighttimeDialogOpen: false,
    });

  openCommunicationScheduledEditionDialog = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (checkIsMessageSchedulable(communicationScheduled)) {
      this.setState(
        {
          communicationScheduledSelected: communicationScheduled,
        },
        () => {
          this.props.setOpenCommunicationChatDrawer(true);
        },
      );
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  openCommunicationScheduledDeletionDialog = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (checkIsMessageDeletable(communicationScheduled)) {
      this.setState({
        communicationScheduledSelected: communicationScheduled,
      });
      this.openDeleteCommunicationScheduledDialog();
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  handleCancelCommunicationScheduled = () => {
    if (this.state.communicationScheduledSelected) {
      if (
        checkIsMessageSchedulable(this.state.communicationScheduledSelected)
      ) {
        this.props.cancelCommunicationScheduled(
          this.state.communicationScheduledSelected.id,
        );
      } else {
        this.openTooLateToUpdateCommunicationScheduledDialog();
      }
    }
    this.closeDeleteCommunicationScheduledDialog();
    this.props.setOpenSendEmail(false);
    this.setState({
      communicationScheduledSelected: null,
    });
  };

  handleIsTooLateToUpdateCommunicationScheduled = () => {
    this.props.setOpenSendEmail(false);
    this.setState({
      communicationScheduledSelected: null,
    });
    this.openTooLateToUpdateCommunicationScheduledDialog();
  };

  openCommunicationScheduledSendNowDialog = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (checkIsMessageSchedulable(communicationScheduled)) {
      this.setState({
        communicationScheduledSelected: communicationScheduled,
      });
      this.openSendNowCommunicationScheduledDialog();
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  handleSendNowCommunicationScheduled = () => {
    if (this.state.communicationScheduledSelected) {
      this.props.sendCommunicationScheduled(
        this.state.communicationScheduledSelected.id,
      );
    }
    this.props.setOpenSendEmail(false);
    this.setState({
      communicationScheduledSelected: null,
    });
    this.closeSendNowCommunicationScheduledDialog();
  };

  isDuringNighttime = () => {
    const {
      earliestHourToSendCommunications,
      latestHourToSendCommunications,
      timezone,
    } = this.props;

    if (
      !!earliestHourToSendCommunications &&
      !!latestHourToSendCommunications
    ) {
      const now = DateTime.now().setZone(timezone);
      return (
        earliestHourToSendCommunications > now.hour ||
        now.hour >= latestHourToSendCommunications
      );
    }
    return false;
  };

  getHideAutoResend = () =>
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
    this.props.companyId !== 498;

  sendCommunication = (data: Partial<MemberMailData>) => {
    if (this.isDuringNighttime()) {
      this.setState({
        communicationDataToSend: data,
        isSendCommunicationDuringNighttimeDialogOpen: true,
      });
    } else {
      this.props.sendCommunication({
        ...data,
        smartlist_id: this.props.id,
      });
    }
  };

  sendCommunicationDuringNighttime = () => {
    this.props.sendCommunication({
      ...this.state.communicationDataToSend,
      smartlist_id: this.props.id,
    });
    this.setState({
      communicationDataToSend: null,
      isSendCommunicationDuringNighttimeDialogOpen: false,
    });
  };

  handleOpenCommunicationDrawer = () => {
    this.props.setOpenCommunicationChatDrawer(true);
  };

  render() {
    if (!this.props.smartlist_filters) {
      return <LinearProgress />;
    }
    const fetchItems = {
      meta_activities: {
        fetchAction: () =>
          this.props.fetchAllActivities(this.props.smartlist.company),
        loading: this.props.metaActivityLoading,
      },
      coaches: {
        fetchAction: this.props.fetchCoaches,
        loading: this.props.coachLoading,
      },
      payment_packs: {
        fetchAction: this.props.fetchPaymentPackList,
        loading: this.props.paymentPackLoading,
      },
      establishments: {
        fetchAction: this.props.fetchEstablishments,
        loading: this.props.establishmentLoading,
      },
      private_passes: {
        fetchAction: this.props.fetchPrivatePassList,
        loading: this.props.privatePassLoading,
      },
      private_services: {
        fetchAction: this.props.fetchAllPrivateServices,
        loading: this.props.privateServiceLoading,
      },
      custom_forms: {
        fetchAction: () =>
          this.props.fetchAllCustomForm(this.props.smartlist.company),
        loading: this.props.customFormLoading,
      },
    };

    const fetchBulkItems = {
      meta_activities: this.props.fetchMetaActivityBulk,
      coaches: this.props.fetchCoachBulk,
      payment_packs: this.props.fetchPaymentPackBulk,
      establishments: this.props.fetchEstablishmentBulk,
      private_passes: this.props.fetchPrivatePassBulk,
      private_services: this.props.fetchPrivateServiceBulk,
      custom_forms: this.props.fetchCustomFormBulk,
    };

    return (
      <div>
        <FiltersPanel
          // @ts-expect-error
          cadences={this.props.cadences}
          cancelCommunicationScheduled={
            this.openCommunicationScheduledDeletionDialog
          }
          coaches={this.props.coaches}
          communicationScheduledList={this.props.communicationScheduledList}
          communicationScheduledLoading={
            this.props.communicationScheduledLoading
          }
          communicationScheduledTotal={this.props.communicationScheduledTotal}
          createFilter={this.createFilter}
          csvExportDate={this.props.csvExportDate}
          csvExportLink={this.props.csvExportLink}
          customForms={this.props.customForms}
          customLevels={this.props.customLevels}
          deleteFilter={this.deleteFilter}
          editCommunicationScheduled={
            this.openCommunicationScheduledEditionDialog
          }
          establishments={this.props.establishments}
          exportMemberTable={() => getMemberTable(this.props.id)}
          exportMemberTableBackground={this.handleBackgroundCsvExport}
          featureList={this.props.featureList}
          fetchBulkItems={fetchBulkItems}
          fetchCommunicationsPaginatedMembers={
            this.props.fetchCommunicationsPaginatedMembers
          }
          fetchItems={fetchItems}
          filters={this.props.smartlist_filters}
          loading={this.props.loading}
          memberList={this.props.members.displayItems}
          memberLoading={this.props.members.loading}
          meta_activities={this.props.meta_activities}
          onRequestEmail={this.handleOpenCommunicationDrawer}
          payment_packs={this.props.payment_packs}
          private_passes={this.props.privatePassList}
          private_services={this.props.privateServices}
          sendSmartListPopup={this.props.sendSmartListPopup}
          smartList={this.props.smartlist}
          smartListId={this.props.id}
          smartListPopupList={this.props.smartListPopupList}
          smartListPopupLoading={this.props.smartListPopupLoading}
          smartListUpdate={this.props.smartListUpdate}
          tags={this.props.tags}
          updateFilter={this.updateFilter}
          viewAllCommunicationScheduled={this.props.goToCampaignList}
        />
        <AutomatedCampaignPanel
          loading={this.props.smartlist_automated_campaigns_loading}
          onAdd={this.onAddAutomatedCampaign}
          onDelete={this.props.deleteAutomatedCampaign}
          onEdit={this.handleEditAutomatedCampaign}
          // @ts-expect-error
          smartListAutomatedCampaigns={this.props.smartlist_automated_campaigns}
        />
        <AutoTagPanel
          createAutoTag={this.props.createAutoTag}
          deleteAutoTag={this.props.deleteAutoTag}
          openUpdateDialog={this.props.openAutoTagRulesDialog}
          smartlistAutoTag={this.props.smartlistAutoTagRulesList.filter(
            (tg: AutoTagRule) => tg.smartlist === this.props.id,
          )}
          smartlistAutoTagLoading={this.props.smartlistAutoTagRulesListLoading}
          tags={this.props.tags}
          updateAutoTag={this.props.updateAutoTag}
        />
        <div className={this.props.classes.memberWrapper}>
          <ButtonBase
            className={this.props.classes.buttonTitle}
            onClick={() =>
              this.props.setCloseMemberTable(!this.props.closeMemberTable)
            }
          >
            <Typography
              className={this.props.memberTitle}
              // @ts-expect-error
              color={this.props.closeMemberTable ? 'textSecondary' : 'default'}
              variant="h6"
            >
              {this.props.t('member:memberList')}
            </Typography>

            {this.props.closeMemberTable ? (
              <ExpandMoreIcon />
            ) : (
              <ExpandLessIcon />
            )}
          </ButtonBase>
          <Divider />
          <Collapse in={!this.props.closeMemberTable}>
            {!this.props.closeMemberTable && (
              <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
                {(hasMemberProfileAccessPermission: boolean) => (
                  <MemberTable
                    hideAddButton
                    fetch={({
                      page,
                      page_size,
                    }: {
                      page: number;
                      page_size: number;
                    }) =>
                      fetchSmartListMembersAPI(this.props.id, {
                        page,
                        page_size,
                      })
                    }
                    goToMember={
                      hasMemberProfileAccessPermission
                        ? this.props.goToMember
                        : null
                    }
                    noDataText={this.props.t('member:noData')}
                    snackbarError={this.props.snackbarError}
                  />
                )}
              </ObjectLevelPermissionProvider>
            )}
          </Collapse>
        </div>
        <AutomatedCampaignDrawer
          alreadyConfiguredCommunicationKind={this.getAlreadyConfiguredCommunicationKind()}
          default_event_kind={this.props.automatedCampaignCreateEventkind}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          hideAutoResend={this.getHideAutoResend()}
          initial={this.props.selected_smartlist_autmated_campaign}
          onCancel={this.handleCancelAutomateCampaignForm}
          onSubmit={this.props.createOrUpdateAutomatedCampaign}
          open={false}
          resolvedGenericTags={this.props.resolvedGenericTags}
        />
        {/* CDP-150 - To remove  */}
        {/* @ts-expect-error */}
        <CommunicationDrawerDEPRECATED
          hideMemberList
          closeDrawerForTooLateUpdate={
            this.handleIsTooLateToUpdateCommunicationScheduled
          }
          communicationScheduledToEdit={
            this.state.communicationScheduledSelected
          }
          companyId={this.props.companyId}
          deleteScheduledMessage={this.openCommunicationScheduledDeletionDialog}
          editScheduledMessage={this.props.editCommunicationScheduled}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          hideAutoResend={this.getHideAutoResend()}
          hoursToSend={{
            min: this.props.earliestHourToSendCommunications,
            max: this.props.latestHourToSendCommunications,
          }}
          membersAllLoading={
            this.state.resetMembersFetchForCommunication &&
            this.props.members.loading
          }
          membersByPageLoading={this.props.members.loading}
          membersToDisplay={this.props.members.displayItems}
          memberToDisplayError={this.props.members.error}
          onCancel={() => {
            this.props.setOpenSendEmail(false);
            this.setState({
              resetMembersFetchForCommunication: true,
              communicationScheduledSelected: null,
            });
          }}
          open={this.props.openSendEmail}
          page={this.props.members.page}
          resolvedGenericTags={this.props.resolvedGenericTags}
          schedule={this.props.scheduleCommunication}
          send={this.sendCommunication}
          sendNow={this.openCommunicationScheduledSendNowDialog}
          timezone={this.props.timezone}
        />
        {!!this.props.openCommunicationChatDrawer && (
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.communication"
          >
            <CommunicationDrawer
              communicationIdentifier={CONTEXT_SMARTLIST}
              communicationObjectId={this.props.smartlist?.id ?? this.props.id}
              communicationTitle={this.props.smartlist?.name}
              onDrawerClose={this.handleCommunicationDrawerClose}
              openDrawer={this.props.openCommunicationChatDrawer}
              smartlistOptions={{
                scheduledCommunicationDraft:
                  this.state.communicationScheduledSelected,
                automatedCommunicationDraft: this.props
                  .selectAutomatedCampaignId
                  ? this.props.selected_smartlist_autmated_campaign
                  : null,
                automatedCampaignKind:
                  this.props.automatedCampaignCreateEventkind,
                usedAutoCampaignCommMethods:
                  this.getAlreadyConfiguredCommunicationKind(),
              }}
            />
          </ObjectLevelPermissionWrapper>
        )}
        {this.state.openEditDialog && (
          <SmartListEditDialog
            fullScreen
            onCancel={() => this.setState({ openEditDialog: false })}
            open={this.state.openEditDialog}
            smartlist={this.state.openEditDialog ? this.props.smartlist : null}
            updateSmartList={this.updateSmartList}
          />
        )}
        {this.state.isDeleteCommunicationScheduledDialogOpen && (
          <GenericDeleteDialog
            cancelLabel={this.props.t(
              'communication:scheduled.deleteDialog.close',
            )}
            content={this.props.t(
              'communication:scheduled.deleteDialog.content',
            )}
            delayBeforeActivation={0}
            onCancel={this.closeDeleteCommunicationScheduledDialog}
            onValidate={this.handleCancelCommunicationScheduled}
            open={this.state.isDeleteCommunicationScheduledDialogOpen}
            title={this.props.t('communication:scheduled.deleteDialog.title')}
            validateLabel={this.props.t(
              'communication:scheduled.deleteDialog.submit',
            )}
          />
        )}
        {this.state.isTooLateToUpdateCommunicationScheduledDialogOpen && (
          <GenericMuiDialog
            cancelText={this.props.t(
              'communication:scheduled.tooLateToUpdateDialog.close',
            )}
            content={this.props.t(
              'communication:scheduled.tooLateToUpdateDialog.content',
            )}
            onCancel={this.closeTooLateToUpdateCommunicationScheduledDialog}
            open={this.state.isTooLateToUpdateCommunicationScheduledDialogOpen}
            title={this.props.t(
              'communication:scheduled.tooLateToUpdateDialog.title',
            )}
          />
        )}
        {this.state.isSendNowCommunicationScheduledDialogOpen && (
          <GenericMuiDialog
            cancelText={this.props.t(
              'communication:scheduled.sendNowDialog.close',
            )}
            confirmText={this.props.t(
              'communication:scheduled.sendNowDialog.confirm',
            )}
            content={this.props.t(
              'communication:scheduled.sendNowDialog.content',
            )}
            onCancel={this.closeSendNowCommunicationScheduledDialog}
            onConfirm={this.handleSendNowCommunicationScheduled}
            open={this.state.isSendNowCommunicationScheduledDialogOpen}
            title={this.props.t('communication:scheduled.sendNowDialog.title')}
          >
            {this.isDuringNighttime() && (
              <Alert severity="warning">
                {this.props.t('communication:scheduled.nighttimeLimit')}
              </Alert>
            )}
          </GenericMuiDialog>
        )}
        {this.state.isSendCommunicationDuringNighttimeDialogOpen && (
          <GenericMuiDialog
            cancelText={this.props.t('communication:sendNowDialog.close')}
            confirmText={this.props.t('communication:sendNowDialog.confirm')}
            content={this.props.t('communication:sendNowDialog.content')}
            onCancel={this.closeSendCommunicationDuringNighttimeDialog}
            onConfirm={this.sendCommunicationDuringNighttime}
            open={this.state.isSendCommunicationDuringNighttimeDialogOpen}
            title={this.props.t('communication:sendNowDialog.title')}
          >
            {this.isDuringNighttime() && (
              <Alert severity="warning">
                {this.props.t('communication:scheduled.nighttimeLimit')}
              </Alert>
            )}
          </GenericMuiDialog>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  description: {
    marginTop: theme.spacing(1),
  },
  listInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
  },
  memberWrapper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  statsTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',

    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  statTitle: {
    margin: theme.spacing(1),
    marginLeft: 0,
    paddingLeft: theme.spacing(2),
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  alignLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

const connector = connect(
  (
    state: RootState,
    {
      id,
      selectAutomatedCampaignId,
    }: { id: number; selectAutomatedCampaignId: number },
  ) => ({
    // SMARTLIST
    smartlist: getSmartList(state, id),
    smartlist_filters: getSmartListFilters(state, id),
    smartlist_automated_campaigns: getSmartListAutomatedCampaign(state, id),
    selected_smartlist_autmated_campaign: getAutomatedCampaign(
      state,
      selectAutomatedCampaignId,
    ),
    smartlist_automated_campaigns_loading:
      state.smartList.automatedCampaign.loading ||
      state.smartList.automatedCampaign.createOrUpdate.loading ||
      state.smartList.automatedCampaign.delete.loading,
    smartlistAutoTagRulesList: getSmartListAutoTag(state),
    smartlistAutoTagRulesListLoading: state.smartList.smartListTagRules.loading,
    loading:
      state.smartList.loading ||
      state.smartList.filter.loading ||
      getCadenceIdsUsingSmartlistLoading(state),

    // COMMUNICATION
    communicationScheduledLoading:
      getCommunicationScheduledBySmartlistLoading(state),
    communicationScheduledTotal: getCommunicationScheduledBySmartlistTotal(
      state,
      id,
    ),
    communicationScheduledList: getCommunicationScheduledForSmartlist(
      state,
      id,
    ),
    timezone: state.theme.theme.timezone_name,
    earliestHourToSendCommunications:
      state.theme.theme.earliest_hour_to_send_communications,
    latestHourToSendCommunications:
      state.theme.theme.latest_hour_to_send_communications,

    // MEMBERS
    members: {
      displayItems: getPaginatedMembers(state),
      page: state.member.communication.page,
      allIds: state.member.communication.allIds,
      countTotal: state.member.communication.countTotal,
      countWithPhone: state.member.communication.countWithPhone,
      countWithEmail: state.member.communication.countWithEmail,
      loading: state.member.communication.loading,
      error: state.member.communication.error,
    },
    member_filters: { smartlist: id },

    // TAGS
    tags: tagSelectors.getMemberTagsWithTagGroup(state),

    // PAYMENT PACK
    payment_packs: getPaymentPackEnabled(state),
    paymentPackLoading: state.paymentPack.loading,

    // PRIVATE PASS
    privatePassList: getPrivatePassAvailable(state),
    privatePassLoading: state.privateService.privatePass.loading,

    // PRIVATE SERVICE
    availablePrivateService: getAvailablePrivateServices(state),
    privateServicesById: _getPrivateServicesById(state),
    privateServiceLoading: state.privateService.privateService.loading,

    // ACTIVITIES
    meta_activities: getMetaActivities(state),
    metaActivityLoading: state.metaActivity.loading,

    // ESTABLISHMENTS
    establishmentLoading: state.establishment.loading,
    establishments: getAllEstablishments(state),
    coachLoading: state.coach.loading,
    coaches: getCoaches(state),

    // EMAIL
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    resolvedGenericTags: getResolvedGenericTags(state),

    // LEVEL
    customLevels: getAllCustomLevels(state),

    // CUSTOM FORMS
    customForms: getAllCustomForm(state),
    customFormLoading: state.customForm.loading,

    // OTHERS
    companyId: state.theme.theme.company,

    // START-UP POP-UP
    smartListPopupList: getSmartListPopupSendingList(state),
    smartListPopupLoading: state.communicationV2.smartListPopupSending.loading,

    // UPSELLS
    featureList: state.company.feature.data.upsell,

    // AUDIENCE
    cadences: getCadencesUsingSmartlist(state, id),

    csvExportLink: getSmartListCsvExportLink(state, id),
    csvExportDate: getSmartListCsvExportDate(state, id),
  }),
  {
    // SMARTLIST
    fetchSmartListFilters,
    updateFilter,
    deleteFilter,
    smartListCreate,
    smartListUpdate,
    createFilter,

    // AUTOTAGRULES
    fetchAllAutoTagRulesAction: fetchAutoTagRules,
    createAutoTagAction: smartLitAutTagCreate,
    updateAutoTagAction: updateSmartListAutoTag,
    deleteAutoTagAction: smartListAutoTagDelete,
    fetchTags,

    // AUTOMATED CAMPAIGN
    retrieveSmartListAutomatedCampaign,
    fetchSmartListAutomatedCampaign,
    createSmartListAutomatedCampaign,
    updateSmartListAutomatedCampaign,
    deleteSmartListAutomatedCampaign,

    // NAVIGATION
    push: pushRouter,

    // LEVEL
    fetchLevelList: fetchLevelListAction,

    // COMMUNICATION
    fetchCommunicationsPaginatedMembers,
    sendCommunication: sendCommunicationAction,
    createCommunicationScheduled: createCommunicationScheduledAction,
    fetchCommunicationScheduledListForSmartlist:
      fetchCommunicationScheduledListForSmartlistAction,
    retrieveCommunicationScheduled: retrieveCommunicationScheduledAction,
    deleteCommunicationScheduled: deleteCommunicationScheduledAction,
    updateCommunicationScheduled: updateCommunicationScheduledAction,
    sendNowCommunicationScheduled: sendNowCommunicationScheduledAction,
    getUnreadAnswersCountAction,

    // EMAIL
    fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,

    // ACTIVITIES
    fetchMetaActivityBulk,
    fetchAllActivities: fetchAllActivitiesAction,

    // PRIVATE SERVICE
    fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
    fetchPrivateServiceBulk,

    // PAYMENT PACK
    fetchPaymentPackList: () =>
      fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
    fetchPaymentPackBulk,

    // PRIVATE PASS
    fetchPrivatePassBulk,
    fetchPrivatePassList,

    // ESTABLISHMENT
    fetchEstablishments,
    fetchEstablishmentBulk,

    // COACHES
    fetchCoachBulk,
    fetchCoaches,

    // CUSTOM FORM
    fetchAllCustomForm,
    fetchCustomFormBulk,

    // START-UP POP-UP
    fetchSmartListPopupSendings,
    sendSmartListPopup,

    // CADENCES
    fetchCadencesUsingSmartlist,
    fetchCadenceList,

    // EXPORT
    getMemberTableBackgroundAction: getMemberTableBackground,
    fetchStoredCsvExports,

    // SNACKBAR
    snackbarError,
  },
);

const mapWithHandlers = {
  goToList: (props: OwnAndConnectedProps) => () => props.push('/smart-list/'),
  goToCampaignList: (props: OwnAndConnectedProps) => () =>
    props.push(`/smart-list/${props.id}/campaign/`),
  goToMember: (props: OwnAndConnectedProps) => (id: number) =>
    props.push(`/member/${id}/`),
  goToEmailCreate: (props: OwnAndConnectedProps) => () =>
    props.push('/email-template/create'),

  sendCommunication:
    (props: OwnAndConnectedProps) => (data: SendDirectCommunicationType) =>
      props.sendCommunication({
        ...{
          ...data,
          member_filters: props.member_filters,
        },
        smartlist_id: props.id,
        ignore_ids: true,
      }),

  scheduleCommunication:
    (props: OwnAndConnectedProps) =>
    (data: Omit<CommunicationScheduledCreate, 'smartlist'>) =>
      props.createCommunicationScheduled(
        {
          ...data,
          smartlist: props.id,
        },
        {
          onSuccess: () =>
            props.fetchCommunicationScheduledListForSmartlist({
              smartlistId: props.id,
            }),
        },
      ),

  editCommunicationScheduled:
    (props: OwnAndConnectedProps) =>
    (
      data: CommunicationScheduled,
      options?: OptionCallback<CommunicationScheduled>,
    ) =>
      props.updateCommunicationScheduled(data.id, data, {
        ...options,
        onSuccess: (communicationScheduled) => {
          props.fetchCommunicationScheduledListForSmartlist({
            smartlistId: props.id,
          });
          options?.onSuccess?.(communicationScheduled);
        },
      }),

  sendCommunicationScheduled: (props: OwnAndConnectedProps) => (id: number) =>
    props.sendNowCommunicationScheduled(id, {
      onSuccess: () =>
        props.fetchCommunicationScheduledListForSmartlist({
          smartlistId: props.id,
        }),
    }),

  cancelCommunicationScheduled: (props: OwnAndConnectedProps) => (id: number) =>
    props.deleteCommunicationScheduled(id, {
      onSuccess: () =>
        props.fetchCommunicationScheduledListForSmartlist({
          smartlistId: props.id,
        }),
    }),

  createAutoTag:
    (
      props: OwnAndConnectedProps & {
        setOpenAutoTagRulesDialog: (open: boolean) => void;
      },
    ) =>
    async (data: { company: number; tag: number; kind: number }) => {
      props.setOpenAutoTagRulesDialog(true);
      const res = await showInformativeDialog(
        props.t('smartList:tag_rules.asyncDialog.title'),
        props.t('smartList:tag_rules.asyncDialog.message'),
      );
      props.createAutoTagAction(
        { ...data, smartlist: props.id },
        {
          onSuccess: () => res && props.setOpenAutoTagRulesDialog(false),
          onError: () => res && props.setOpenAutoTagRulesDialog(false),
        },
      );
    },
  deleteAutoTag: (props: OwnAndConnectedProps) => (id: number) =>
    props.deleteAutoTagAction(id),
  updateAutoTag:
    (
      props: OwnAndConnectedProps & {
        setOpenAutoTagRulesDialog: (open: boolean) => void;
      },
    ) =>
    async (tag_rule_id: number, data: { tag: number; kind: number }) => {
      const res = await showInformativeDialog(
        props.t('smartList:tag_rules.asyncDialog.title'),
        props.t('smartList:tag_rules.asyncDialog.message'),
      );
      props.updateAutoTagAction(tag_rule_id, data, {
        onSuccess: () => res && props.setOpenAutoTagRulesDialog(false),
        onError: () => res && props.setOpenAutoTagRulesDialog(false),
      });
    },
  createOrUpdateAutomatedCampaign:
    (props: OwnAndConnectedProps) => (data: any, options: OptionCallback) => {
      if (data?.id) {
        props.updateSmartListAutomatedCampaign(
          data.id,
          {
            ...data,
            smartlist: props.id,
          },
          {
            onSuccess: () => {
              options?.onSuccess && options.onSuccess();
            },
            onError: () => {
              options?.onError && options.onError();
            },
          },
        );
      } else {
        props.createSmartListAutomatedCampaign(
          {
            ...data,
            smartlist: props.id,
          },
          {
            onSuccess: () => {
              options?.onSuccess && options.onSuccess();
            },
            onError: () => {
              options?.onError && options.onError();
            },
          },
        );
      }
    },

  deleteAutomatedCampaign:
    (props: OwnAndConnectedProps) =>
    async (id: number, options?: OptionCallback) => {
      const res = await showActionDialog(
        props.t('communication:campaign.automated.deleteDialog.title'),
        props.t('communication:campaign.automated.deleteDialog.content'),
        DialogActionEnum.DELETE,
      );
      if (res) {
        props.deleteSmartListAutomatedCampaign(id, {
          onSuccess: () => {
            options?.onSuccess && options.onSuccess();
            props.fetchSmartListAutomatedCampaign({
              smartlist_id: props.id,
              exclude_disabled: true,
            });
          },
          onError: () => {
            options?.onError && options.onError();
          },
        });
      }
    },
  sendSmartListPopup:
    (props: OwnAndConnectedProps) =>
    async (param: {
      id: string;
      values: FormData;
      options?: OptionCallback;
    }) => {
      // @ts-expect-error
      param.values.append('smartlist_id', props.id);
      props.sendSmartListPopup(param.values, {
        ...param.options,
        onBackgroundSuccess: async () => {
          await props.fetchSmartListPopupSendings({
            smartlist_id: props.id,
          });
        },
      });
    },

  getMemberTableBackground: (props: OwnAndConnectedProps) => () => {
    props.getMemberTableBackgroundAction(props.id, {
      onSuccess: () => props.fetchStoredCsvExports(props.id),
    });
  },
};

export default compose(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withTranslation(['smartList', 'member', 'communication']),
  withState('openSendEmail', 'setOpenSendEmail', false),
  withState(
    'openAutomatedCampaignDrawer',
    'setOpenAutomatedCampaignDrawer',
    false,
  ),
  withState(
    'openCommunicationChatDrawer',
    'setOpenCommunicationChatDrawer',
    false,
  ),
  withState('selectAutomatedCampaignId', 'setSelectAutomatedCampaignId', null),
  withState(
    'automatedCampaignCreateEventkind',
    'setAutomatedCampaignCreateEventkind',
    null,
  ),
  withState('closeMemberTable', 'setCloseMemberTable', true),
  withState('openAutoTagRulesDialog', 'setOpenAutoTagRulesDialog', false),
  // @ts-expect-error
  withStyles(styles),
  connector,
  withProps(
    ({ smartlist_filters, availablePrivateService, privateServicesById }) => {
      let smartListServicesIds: Array<number> = [];

      // @ts-expect-error
      smartlist_filters.forEach((filter) => {
        if (filter.private_services) {
          smartListServicesIds = [
            ...smartListServicesIds,
            ...filter.private_services,
          ];
        }
      });

      const smartListServices = uniq(smartListServicesIds)
        .map((id) => privateServicesById[id])
        .filter((ps) => !!ps);

      const all = [...smartListServices, ...availablePrivateService];

      return {
        privateServices: uniqBy(all, (ps) => ps.id),
      };
    },
  ),
  withHandlers(mapWithHandlers),
)(SmartListDetailMember);
