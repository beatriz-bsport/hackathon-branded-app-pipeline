// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { push } from 'connected-react-router';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

import MemberTable from '../../libs/member/MemberTable.component';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  fetchAllPaymentPacks,
  fetchPaymentPackBulk,
} from '../../libs/payment-packs/actions';

import {
  getSmartListFilters,
  getSmartList,
  getSmartListAutoTag,
  // getSmartListAutoTagFiltered,
} from '../../libs/smart-list/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
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
  applyAsyncSmartListAutoTagRules as applyAsyncSmartListAutoTagRulesAction,
} from '../../libs/smart-list/actions';
import {
  fetchSmartListMembers as fetchSmartListMembersAPI,
  getMemberTable,
} from '../../libs/smart-list/api';
import {
  fetchPrivatePassList,
  fetchPrivatePassBulk,
  fetchAllPrivateServices,
  fetchPrivateServiceBulk,
} from '../../libs/private-service/actions';
import { sendCommunication as sendCommunicationAction } from '../../libs/communication/actions';
import { fetchCommunicationsPaginatedMembers } from '../../libs/member/actions';
import { getPaginatedMembers } from '../../libs/member/selectors';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { getMetaActivities } from '../../libs/meta-activity/selectors';
import {
  fetchMetaActivityBulk,
  fetchCompanyActivities as fetchAllActivitiesAction,
} from '../../libs/meta-activity/actions';
import { fetchTags } from '../../libs/tag/actions';
import tagSelectors from '../../libs/tag/selectors';

import FiltersPanel from '../../libs/smart-list/components/FiltersPanel.component';
import AutoTagPanel from '../../libs/smart-list/components/AutoTagPanel.component';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';
import CommunicationDialog from '../../libs/communication/components/CommunicationDialog.component';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
} from '../../libs/email-editor/actions';

import { Establishment } from '../../libs/establishment/types';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '../../libs/establishment/actions';

import {
  fetchAssociatedCoachesList as fetchCoaches,
  fetchCoachBulk,
} from '../../libs/associated-coach/actions';
import { Coach } from '../../libs/associated-coach/types';

import { getCoaches } from '../../libs/associated-coach/selectors';
import {
  _getPrivateServicesById,
  getAvailablePrivateServices,
} from '../../libs/private-service/selectors/private-service';
import type { PrivateService } from '../../libs/private-service/types';
import { showInformativeDialog } from '../../components/GenericDialog/CustomDialogs';
import type { TagGroup } from '../../libs/tag/types';

type Props = {
  id: number,
  t: TFunction,
  smartlist: any,
  fetchSmartListFilters: (id: number) => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchAllPrivateServices: () => void,
  fetchAllActivities: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  fetchEmailTemplatesSummaries: () => void,
  fetchEstablishments: () => void,
  classes: Object,
  memberTitle: string,
  fetchTags: () => void,
  createFilter: (
    filterNameId: number,
    filter: any,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  updateFilter: (
    smartListId: number,
    filterNameId: number,
    data: any,
    filterId: number,
    callback: (id: number) => void,
  ) => void,
  deleteFilter: (
    filterNameId: number,
    filterId: number,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  goToMember: (id: number) => void,
  smartlist_filters: Array<Filter>,
  payment_packs: Array<PaymentPack>,
  establishments: Array<Establishment>,
  privatePassList: Array<PrivatePass>,
  privateServices: Array<PrivateService>,
  // privatePassList: Array<PrivatePass>,
  meta_activities: Array<MetaActivity>,
  email_templates_details: any,
  email_templates_list: any,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  tags: Array<Tag>,
  loading: boolean,
  setOpenSendEmail: (boolean) => void,
  openSendEmail: boolean,
  establishmentLoading: boolean,
  metaActivityLoading: boolean,
  coachLoading: boolean,
  paymentPackLoading: boolean,
  privatePassLoading: boolean,
  privateServiceLoading: boolean,
  fetchEstablishmentBulk: () => void,
  fetchMetaActivityBulk: () => void,
  fetchCoachBulk: () => void,
  fetchPaymentPackBulk: () => void,
  fetchPrivatePassBulk: () => void,
  fetchPrivateServiceBulk: () => void,
  fetchCoaches: () => void,
  coaches: Array<Coach>,
  smartListUpdate: () => void,
  members: any,
  fetchCommunicationsPaginatedMembers: () => void,
  sendCommunication: (data: any) => void,
  // statistics
  setCloseMemberTable: () => void,
  closeMemberTable: boolean,

  classes: Object,
  memberTitle: string,
  smartlistAutoTag: Array<any>,
  createAutoTag: (data: object) => void,
  deleteAutoTag: (id: number) => void,
  updateAutoTag: (id: number, data: object) => void,
  fetchAllAutoTagRulesAction: () => void,
  smartlistAutoTagLoading: boolean,
  openAutoTagRulesDialog: boolean,
};

type State = {
  onValueChangeActiveMemberFetch: boolean,
};

export class SmartListDetailMember extends Component<Props, State> {
  state = {
    onValueChangeActiveMemberFetch: false,
    openEditDialog: false,
    resetMembersFetchForCommunication: true,
  };

  componentDidMount() {
    this.props.fetchSmartListFilters(this.props.id);
    this.props.fetchTags();
    this.props.fetchAllAutoTagRulesAction();
  }

  createFilter = (filter_identifier, filterData) => {
    const filter = filterData;
    filter.smartlist = this.props.id;
    this.props.createFilter(filter_identifier, filter, this.props.id, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  updateFilter = (filterNameId, filterId, data) => {
    this.props.updateFilter(this.props.id, filterNameId, filterId, data, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  deleteFilter = (filterNameId, filterId) => {
    this.props.deleteFilter(filterNameId, filterId, this.props.id, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  updateSmartList = (smartlist) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.smartlist.id, smartlist);
  };

  fetchPaginatedMembers = (page, page_size) => {
    if (this.state.resetMembersFetchForCommunication) {
      this.props.fetchCommunicationsPaginatedMembers(
        {
          smartlist: this.props.id,
          page,
          page_size,
        },
        null,
        {
          onSuccess: () =>
            this.setState({
              resetMembersFetchForCommunication: false,
            }),
        },
      );
    } else {
      this.props.fetchCommunicationsPaginatedMembers(
        {
          page,
          page_size,
        },
        this.props.members.allIds,
      );
    }
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
        fetchAction: this.props.fetchAllPaymentPacks,
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
    };

    const fetchBulkItems = {
      meta_activities: this.props.fetchMetaActivityBulk,
      coaches: this.props.fetchCoachBulk,
      payment_packs: this.props.fetchPaymentPackBulk,
      establishments: this.props.fetchEstablishmentBulk,
      private_passes: this.props.fetchPrivatePassBulk,
      private_services: this.props.fetchPrivateServiceBulk,
    };
    return (
      <div>
        <FiltersPanel
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
          loading={this.props.loading}
          fetchItems={fetchItems}
          fetchBulkItems={fetchBulkItems}
          onRequestEmail={() => this.props.setOpenSendEmail(true)}
          smartListUpdate={this.props.smartListUpdate}
        />
        <AutoTagPanel
          smartlistAutoTag={this.props.smartlistAutoTag.filter(
            (tg) => tg.smartlist === this.props.id,
          )}
          smartlistAutoTagLoading={this.props.smartlistAutoTagLoading}
          createAutoTag={this.props.createAutoTag}
          deleteAutoTag={this.props.deleteAutoTag}
          updateAutoTag={this.props.updateAutoTag}
          tags={this.props.tags}
          tag_groups={this.props.tag_groups}
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
                fetch={({ page, page_size }) =>
                  fetchSmartListMembersAPI(this.props.id, { page, page_size })
                }
                goToMember={this.props.goToMember}
                onValueChangeActiveMemberFetch={
                  this.state.onValueChangeActiveMemberFetch
                }
                hideAddButton
              />
            )}
          </Collapse>
        </div>
        <CommunicationDialog
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
          allIds={this.props.members.allIds}
          allIdsWithEmail={this.props.members.allIds.filter(
            (memberId) =>
              !this.props.members.allIdsWithoutEmail.includes(memberId),
          )}
          allIdsWithPhone={this.props.members.allIds.filter(
            (memberId) =>
              !this.props.members.allIdsWithoutPhone.includes(memberId),
          )}
          fetchPreviousPage={(page, page_size) =>
            this.fetchPaginatedMembers(
              page - 1
                ? page - 1
                : parseInt(this.props.members.allIds.length / page_size, 10) +
                    1,
              page_size,
            )
          }
          fetchNextPage={(page, page_size) =>
            this.fetchPaginatedMembers(
              page > parseInt(this.props.members.allIds.length / page_size, 10)
                ? 1
                : page + 1,
              page_size,
            )
          }
          initMembers={(page, page_size) =>
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
        />
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

const styles = (theme) => ({
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

export default compose(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withState('openSendEmail', 'setOpenSendEmail', false),
  withState('closeMemberTable', 'setCloseMemberTable', true),
  withState('openAutoTagRulesDialog', 'setOpenAutoTagRulesDialog', false),
  withTranslation(['smartList', 'member', 'communication']),
  withState('openAutoTagRulesDialog', 'setOpenAutoTagRulesDialog', false),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      smartlist: getSmartList(state, id),
      smartlist_filters: getSmartListFilters(state, id),
      loading: state.smartList.loading || state.smartList.filter.loading,
      payment_packs: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      privatePassLoading: state.privateService.privatePass.loading,
      availablePrivateService: getAvailablePrivateServices(state),
      privateServicesById: _getPrivateServicesById(state),
      privateServiceLoading: state.privateService.privateService.loading,
      meta_activities: getMetaActivities(state),
      metaActivityLoading: state.metaActivity.loading,
      establishmentLoading: state.establishment.loading,
      coachLoading: state.coach.loading,
      paymentPackLoading: state.paymentPack.loading,
      establishments: getAllEstablishments(state),
      coaches: getCoaches(state),
      tags: tagSelectors.getMemberTagsWithTagGroup(state),
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      members: {
        displayItems: getPaginatedMembers(state),
        page: state.member.communication.page,
        allIds: state.member.communication.allIds,
        allIdsWithoutPhone: state.member.communication.allIdsWithoutPhone,
        allIdsWithoutEmail: state.member.communication.allIdsWithoutEmail,
        loading: state.member.communication.loading,
      },

      emailDetailLoading: state.emailTemplate.detail.isLoading,
      smartlistAutoTag: getSmartListAutoTag(state, id),
      smartlistAutoTagLoading: state.smartList.smartListTagRules.loading,
    }),
    {
      fetchSmartListFilters,
      fetchCoachBulk,
      fetchCoaches,
      fetchPrivatePassBulk,
      fetchAllPaymentPacks,
      fetchPaymentPackBulk,
      fetchEstablishmentBulk,
      fetchPrivatePassList,
      fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
      fetchPrivateServiceBulk,
      fetchTags,
      updateFilter,
      fetchEstablishments,
      fetchMetaActivityBulk,
      deleteFilter,
      smartListCreate,
      smartListUpdate,
      createFilter,
      fetchCommunicationsPaginatedMembers,
      sendCommunication: sendCommunicationAction,
      fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchAllActivities: fetchAllActivitiesAction,
      goToList: () => push('/smart-list/'),
      goToCampaignList: (id) => push(`/smart-list/${id}/campaign/`),
      goToMember: (id) => push(`/member/${id}/`),
      goToEmailCreate: () => push('/email-template/create'),
      fetchAllAutoTagRulesAction: fetchAutoTagRules,
      createAutoTagAction: smartLitAutTagCreate,
      updateAutoTagAction: updateSmartListAutoTag,
      deleteAutoTagAction: smartListAutoTagDelete,
      applySmartListTagRules: applySmartListAutoTagRules,
      applyAsyncSmartListAutoTagRules: applyAsyncSmartListAutoTagRulesAction,
    },
  ),
  withProps(
    ({ smartlist_filters, availablePrivateService, privateServicesById }) => {
      let smartListServicesIds = [];

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
  withHandlers({
    sendCommunication: ({ sendCommunication, id }) => (data) =>
      sendCommunication({ ...data, smartlist_id: id }),
  }),
  withHandlers({
    createAutoTag: ({
      createAutoTagAction,
      applyAsyncSmartListAutoTagRules,
      setOpenAutoTagRulesDialog,
      t,
      id,
    }) => async (data) => {
      setOpenAutoTagRulesDialog(true);
      const res = await showInformativeDialog(
        t('smartList:tag_rules.asyncDialog.title'),
        t('smartList:tag_rules.asyncDialog.message'),
      );
      createAutoTagAction(
        { ...data, smartlist: id },
        {
          onSuccess: () =>
            applyAsyncSmartListAutoTagRules(id, {
              onSuccess: () => res && setOpenAutoTagRulesDialog(false),
            }),
        },
      );
    },
    deleteAutoTag: ({ deleteAutoTagAction }) => (id) => {
      deleteAutoTagAction(id);
    },
    updateAutoTag: ({
      updateAutoTagAction,
      applyAsyncSmartListAutoTagRules,
      setOpenAutoTagRulesDialog,
      t,
      id,
    }) => async (tg_id, data) => {
      const res = await showInformativeDialog(
        t('smartList:tag_rules.asyncDialog.title'),
        t('smartList:tag_rules.asyncDialog.message'),
      );
      updateAutoTagAction(tg_id, data, {
        onSuccess: () =>
          applyAsyncSmartListAutoTagRules(id, {
            onSuccess: () => res && setOpenAutoTagRulesDialog(false),
          }),
      });
    },
  }),
)(SmartListDetailMember);
