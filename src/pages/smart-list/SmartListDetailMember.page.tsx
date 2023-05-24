// @ts-nocheck
import React from 'react';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { push } from 'connected-react-router';

import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SendIcon from '@material-ui/icons/Send';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
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
  applySmartListAutoTagRules,
  retrieveSmartListAutomatedCampaign,
  fetchSmartListAutomatedCampaign,
  createSmartListAutomatedCampaign,
  updateSmartListAutomatedCampaign,
  deleteSmartListAutomatedCampaign,
} from '#libs/smart-list/actions';
import {
  getSmartListFilters,
  getSmartList,
  getSmartListAutoTag,
  getSmartListAutomatedCampaign,
  getAutomatedCampaign,
} from '#libs/smart-list/selectors';

import {
  fetchSmartListMembers as fetchSmartListMembersAPI,
  getMemberTable,
} from '#libs/smart-list/api';

import type {
  SmartList,
  AutoTagRule,
  AutomatedCampaign,
} from '#libs/smart-list/types';

// PAYMENT PACK
import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  fetchPaymentPackBulk,
} from '#libs/payment-packs/actions';
import { getEnabled as getPaymentPackEnabled } from '#libs/payment-packs/selectors';

// PRIVATE PASS | PRIVATE SERVICE
import {
  fetchPrivatePassList,
  fetchPrivatePassBulk,
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
} from '#libs/private-service/actions';
import { getPrivatePassAvailable } from '#libs/private-service/selectors/private-pass';
import {
  _getPrivateServicesById,
  getAvailablePrivateServices,
} from '#libs/private-service/selectors/private-service';

import type { PrivateService } from '#libs/private-service/types';

// COMMUNICATION
import { sendCommunication as sendCommunicationAction } from '#libs/communication/actions';
import type { SendDirectCommunicationType } from '#libs/communication/types';
import type { CommunicationContext } from '#libs/communication-v2/types';

// MEMBER
import { fetchCommunicationsPaginatedMembers } from '#libs/member/actions';
import { getPaginatedMembers } from '#libs/member/selectors';

// METAACTIVITY
import {
  fetchMetaActivityBulk,
  fetchCompanyActivities as fetchAllActivitiesAction,
} from '#libs/meta-activity/actions';
import { getMetaActivities } from '#libs/meta-activity/selectors';

// TAGS
import { fetchTags } from '#libs/tag/actions';
import tagSelectors from '#libs/tag/selectors';

// EMAIL
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';

// ESTABLISHMENT
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '#libs/establishment/actions';
import { getAllEstablishments } from '#libs/establishment/selectors';

// COACHES
import {
  fetchAssociatedCoachesList as fetchCoaches,
  fetchCoachBulk,
} from '#libs/associated-coach/actions';

import { getCoaches } from '#libs/associated-coach/selectors';

// LEVEL
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { getAllCustomLevels } from '#libs/level/selectors';

// CUSTOM FORMS
import {
  fetchAllCustomForm,
  fetchCustomFormBulk,
} from '#libs/custom-form/actions';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  showInformativeDialog,
  showDeleteDialog,
} from '../../components/genericDialog/CustomDialogs';
import FiltersPanel from '#libs/smart-list/components/FiltersPanel.component';
import AutoTagPanel from '#libs/smart-list/components/AutoTagPanel.component';
import SmartListEditDialog from '#libs/smart-list/components/SmartListFormDialog.component';
import AutomatedCampaignDrawer from '#libs/smart-list/components/automated_campaign/AutomatedCampaignDrawer.component';
import AutomatedCampaignPanel from '#libs/smart-list/components/automated_campaign/AutomatedCampaignPanel.component';
import MemberTable from '#libs/member/MemberTable.component';
import CommunicationDrawerDEPRECATED from '#libs/communication/components/CommunicationDrawer.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import { getAllCustomForm } from '#libs/custom-form/selectors';

// COMMUNICATION CHAT
import CommunicationDrawer from '#libs/communication-v2/components/CommunicationDrawer.component';
import { CONTEXT_SMARTLIST } from '#libs/communication-v2/constants';
import BottomActionsButtonCustom from '#components/button/BottomActionsButtonCustom.component';
import {
  getUnreadAnswersCount as getUnreadAnswersCountAction,
  fetchSmartListPopupSendings,
  sendSmartListPopup,
} from '#libs/communication-v2/actions';

import Config from '../../config';
import { getSmartListPopupSendingList } from '#libs/communication-v2/selectors';

type OwnProps = {
  id: number;
  memberTitle: string;
  openSendEmail: boolean;
  setOpenSendEmail: (open: boolean) => void;
  setCloseMemberTable: (open: boolean) => void;
  setOpenAutoTagRulesDialog: (open: boolean) => void;
  openAutoTagRulesDialog: boolean;
  closeMemberTable: boolean;
  automatedCampaignCreateEventkind: number;
  setAutomatedCampaignCreateEventkind: (kind: number | null) => void;
  openAutomatedCampaignDrawer: boolean;
  setOpenAutomatedCampaignDrawer: (open: boolean) => void;
  selectAutomatedCampaignId: number | null;
  setSelectAutomatedCampaignId: (id: number | null) => void;
  resolvedGenericTags: ResolvedGenericTags;
  openCommunicationChatDrawer: boolean;
  setOpenCommunicationChatDrawer: (open: boolean) => void;
  getUnreadAnswersCountAction: (params: CommunicationContext) => void;
  numberOfUnreadAnswers: number;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type OwnAndConnectedProps = OwnProps &
  ConnectedProps<typeof connector> & { privateServices: Array<PrivateService> };

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  onValueChangeActiveMemberFetch: boolean;
  openEditDialog: boolean;
  resetMembersFetchForCommunication: boolean;
};

export class SmartListDetailMember extends React.Component<Props, State> {
  state = {
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
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
      },
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
      onSuccess: () => {
        if (options && options.onSuccess) options.onSuccess();
      },
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
    this.props.setOpenAutomatedCampaignDrawer(true);
  };

  handleCancelAutomateCampaignForm = () => {
    this.props.setOpenAutomatedCampaignDrawer(false);
    this.props.setSelectAutomatedCampaignId(null);
  };

  handleEditAutomatedCampaign = (id: number) => {
    this.props.setSelectAutomatedCampaignId(id);
    this.props.setOpenAutomatedCampaignDrawer(true);
  };

  getAlreadyConfiguredCommunicationKind = () => {
    return this.props.smartlist_automated_campaigns
      ?.filter(
        (_campaign: AutomatedCampaign) =>
          _campaign?.event_kind === this.props.automatedCampaignCreateEventkind,
      )
      ?.map((aut_co: AutomatedCampaign) => aut_co.communication_kind);
  };

  handleCommunicationDrawerClose = () => {
    this.props.setOpenCommunicationChatDrawer(false);
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
          smartListId={this.props.id}
          exportMemberTable={() => getMemberTable(this.props.id)}
          smartList={this.props.smartlist}
          filters={this.props.smartlist_filters}
          updateFilter={this.updateFilter}
          deleteFilter={this.deleteFilter}
          payment_packs={this.props.payment_packs}
          private_passes={this.props.privatePassList}
          private_services={this.props.privateServices}
          createFilter={this.createFilter}
          coaches={this.props.coaches}
          meta_activities={this.props.meta_activities}
          establishments={this.props.establishments}
          tags={this.props.tags}
          customLevels={this.props.customLevels}
          customForms={this.props.customForms}
          loading={this.props.loading}
          fetchItems={fetchItems}
          fetchBulkItems={fetchBulkItems}
          onRequestEmail={() => this.props.setOpenSendEmail(true)}
          smartListUpdate={this.props.smartListUpdate}
          sendSmartListPopup={this.props.sendSmartListPopup}
          smartListPopupList={this.props.smartListPopupList}
          smartListPopupLoading={this.props.smartListPopupLoading}
          fetchCommunicationsPaginatedMembers={
            this.props.fetchCommunicationsPaginatedMembers
          }
          memberLoading={this.props.members.loading}
          memberList={this.props.members.displayItems}
          featureList={this.props.featureList}
        />
        <AutomatedCampaignPanel
          onAdd={this.onAddAutomatedCampaign}
          onEdit={this.handleEditAutomatedCampaign}
          onDelete={this.props.deleteAutomatedCampaign}
          loading={this.props.smartlist_automated_campaigns_loading}
          smartListAutomatedCampaigns={this.props.smartlist_automated_campaigns}
        />

        <AutoTagPanel
          smartlistAutoTag={this.props.smartlistAutoTagRulesList.filter(
            (tg: AutoTagRule) => tg.smartlist === this.props.id,
          )}
          smartlistAutoTagLoading={this.props.smartlistAutoTagRulesListLoading}
          createAutoTag={this.props.createAutoTag}
          deleteAutoTag={this.props.deleteAutoTag}
          updateAutoTag={this.props.updateAutoTag}
          tags={this.props.tags}
          openUpdateDialog={this.props.openAutoTagRulesDialog}
        />
        <div className={this.props.classes.memberWrapper}>
          <ButtonBase
            className={this.props.classes.buttonTitle}
            onClick={() =>
              this.props.setCloseMemberTable(!this.props.closeMemberTable)
            }
          >
            <Typography
              variant="h6"
              color={this.props.closeMemberTable ? 'textSecondary' : 'default'}
              className={this.props.memberTitle}
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
              <MemberTable
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
                goToMember={this.props.goToMember}
                hideAddButton
                noDataText={this.props.t('member:noData')}
              />
            )}
          </Collapse>
        </div>
        <AutomatedCampaignDrawer
          open={this.props.openAutomatedCampaignDrawer}
          initial={this.props.selected_smartlist_autmated_campaign}
          default_event_kind={this.props.automatedCampaignCreateEventkind}
          alreadyConfiguredCommunicationKind={this.getAlreadyConfiguredCommunicationKind()}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          onCancel={this.handleCancelAutomateCampaignForm}
          onSubmit={this.props.createOrUpdateAutomatedCampaign}
          countTotal={this.props.countTotal}
          countWithPhone={this.props.countWithPhone}
          countWithEmail={this.props.countWithEmail}
          genericTags={this.props.genericTags}
          resolvedGenericTags={this.props.resolvedGenericTags}
        />
        <CommunicationDrawerDEPRECATED
          open={this.props.openSendEmail}
          onClose={() => this.props.setOpenSendEmail(false)}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          onCancel={() => {
            this.props.setOpenSendEmail(false);
            this.setState({ resetMembersFetchForCommunication: true });
          }}
          membersToDisplay={this.props.members.displayItems}
          fetchPreviousPage={(page: number, page_size: number) =>
            this.fetchPaginatedMembers(
              page - 1
                ? page - 1
                : parseInt(this.props.members.countTotal / page_size, 10) + 1,
              page_size,
            )
          }
          fetchNextPage={(page: number, page_size: number) =>
            this.fetchPaginatedMembers(
              page > parseInt(this.props.members.countTotal / page_size, 10)
                ? 1
                : page + 1,
              page_size,
            )
          }
          initMembers={(page: number, page_size: number) =>
            this.fetchPaginatedMembers(page, page_size)
          }
          page={this.props.members.page}
          membersAllLoading={
            this.state.resetMembersFetchForCommunication &&
            this.props.members.loading
          }
          membersByPageLoading={this.props.members.loading}
          send={(data) =>
            this.props.sendCommunication({
              ...data,
              smartlist_id: this.props.id,
            })
          }
          countTotal={this.props.members.countTotal}
          countWithPhone={this.props.members.countWithPhone}
          countWithEmail={this.props.members.countWithEmail}
          genericTags={this.props.genericTags}
          resolvedGenericTags={this.props.resolvedGenericTags}
        />
        {(Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'local' ||
          Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ||
          this.props.companyId === 498) && (
          <>
            {!!this.props.openCommunicationChatDrawer && (
              <CommunicationDrawer
                openDrawer={this.props.openCommunicationChatDrawer}
                onDrawerClose={this.handleCommunicationDrawerClose}
                contextIdentifier={CONTEXT_SMARTLIST}
                contextObjectId={this.props.smartlist?.id ?? this.props.id}
                contextTitle={this.props.smartlist?.name}
                propToListenToReloadRecipients={
                  this.state.resetMembersFetchForCommunication
                }
              />
            )}
            <BottomActionsButtonCustom
              buttonsProperties={[
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    this.props.setOpenCommunicationChatDrawer(true);
                  },
                  color: 'primary',
                  disabled: this.props.loading,
                  icon: <SendIcon />,
                  text: this.props.t('communication:generic.communication'),
                  keepTextUnderSelectedMinWidth: true,
                  badgeValue: this.props.numberOfUnreadAnswers,
                },
              ]}
              minWidth="xs"
            />
          </>
        )}
        <SmartListEditDialog
          open={this.state.openEditDialog}
          smartlist={this.state.openEditDialog ? this.props.smartlist : null}
          updateSmartList={this.updateSmartList}
          onCancel={() => this.setState({ openEditDialog: false })}
          fullScreen
        />
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
    loading: state.smartList.loading || state.smartList.filter.loading,

    // MEMBERS
    members: {
      displayItems: getPaginatedMembers(state),
      page: state.member.communication.page,
      allIds: state.member.communication.allIds,
      countTotal: state.member.communication.countTotal,
      countWithPhone: state.member.communication.countWithPhone,
      countWithEmail: state.member.communication.countWithEmail,
      loading: state.member.communication.loading,
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

    // UNREAD ANSWERS
    numberOfUnreadAnswers: state.communicationV2.unreadAnswers.count,

    // OTHERS
    companyId: state.theme.theme.company,

    // START-UP POP-UP
    smartListPopupList: getSmartListPopupSendingList(state),
    smartListPopupLoading: state.communicationV2.smartListPopupSending.loading,

    // UPSELLS
    featureList: state.company.feature.data.upsell,
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
    applySmartListTagRules: applySmartListAutoTagRules,
    fetchTags,

    // AUTOMATED CAMPAIGN
    retrieveSmartListAutomatedCampaign,
    fetchSmartListAutomatedCampaign,
    createSmartListAutomatedCampaign,
    updateSmartListAutomatedCampaign,
    deleteSmartListAutomatedCampaign,

    // NAVIGATION
    goToList: () => push('/smart-list/'),
    goToCampaignList: (id: number) => push(`/smart-list/${id}/campaign/`),
    goToMember: (id: number) => push(`/member/${id}/`),
    goToEmailCreate: () => push('/email-template/create'),
    // LEVEL
    fetchLevelList: fetchLevelListAction,

    // COMMUNICATION
    fetchCommunicationsPaginatedMembers,
    sendCommunication: sendCommunicationAction,
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
  },
);

const mapWithHandlers = {
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
  createAutoTag:
    (props: OwnAndConnectedProps) =>
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
    (props: OwnAndConnectedProps) =>
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
              props.setOpenAutomatedCampaignDrawer(false);
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
              props.setOpenAutomatedCampaignDrawer(false);
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
      const res = await showDeleteDialog(
        props.t('communication:campaign.automated.deleteDialog.title'),
        props.t('communication:campaign.automated.deleteDialog.content'),
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
  // @ts-ignore
  withStyles(styles),
  connector,
  withProps(
    ({ smartlist_filters, availablePrivateService, privateServicesById }) => {
      let smartListServicesIds: Array<number> = [];

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
