// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { push } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import MemberTable from '../../libs/member/MemberTable.component';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import {
  getSmartListFilters,
  getSmartList,
} from '../../libs/smart-list/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  smartListCreate,
  smartListUpdate,
  fetchSmartListFilters,
  updateFilter,
  fetchSmartListDetail,
  deleteFilter,
  createFilter,
} from '../../libs/smart-list/actions';
import {
  fetchSmartListMembers as fetchSmartListMembersAPI,
  sendMail,
  getMemberTable,
} from '../../libs/smart-list/api';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';
import { getMetaActivities } from '../../libs/meta-activity/selectors';
import { fetchAllActivities as fetchAllActivitiesAction } from '../../libs/meta-activity/actions/meta-activity.actions';
import { fetchTags } from '../../libs/tag/actions';
import tagSelectors from '../../libs/tag/selectors';

import FiltersPanel from '../../libs/smart-list/components/FiltersPanel.component';
import SendEmailDialog from '../../libs/smart-list/components/SendEmailDialog.component';
import ConfigureDnsDialog from '../../libs/smart-list/components/ConfigureDnsDialog.component';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
} from '../../libs/email-editor/actions';

type Props = {
  id: number,
  t: TFunction,
  smart_list: any,
  fetchSmartListFilters: (id: number) => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchAllActivities: () => void,
  fetchEmailTemplateDetail: (id: number) => void,
  fetchEmailTemplatesSummaries: () => void,
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
  // privatePassList: Array<PrivatePass>,
  meta_activities: Array<MetaActivity>,
  email_templates_details: any,
  email_templates_list: any,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  tags: Array<Tag>,
  loading: boolean,
  tag_groups: any,
  setOpenSendEmail: (boolean) => void,
  openSendEmail: boolean,
  goToEmailCreate: () => void,
  snackbarSuccess: (string) => void,
  snackbarError: (string) => void,
  fetchSmartListDetail: (id) => void,
};

type State = {
  onValueChangeActiveMemberFetch: boolean,
};

export class SmartListDetailMember extends Component<Props, State> {
  state = { onValueChangeActiveMemberFetch: false };

  componentDidMount() {
    this.props.fetchSmartListFilters(this.props.id);
    this.props.fetchSmartListDetail(this.props.id);
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchAllActivities();
    this.props.fetchTags();
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

  updateFilter = (filterNameId, data, filterId) => {
    this.props.updateFilter(this.props.id, filterNameId, data, filterId, () => {
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

  render() {
    if (!this.props.smartlist_filters) {
      return <LinearProgress />;
    }
    return (
      <div>
        <FiltersPanel
          exportMemberTable={() => getMemberTable(this.props.id)}
          smartList={this.props.smart_list}
          filters={this.props.smartlist_filters}
          updateFilter={this.updateFilter}
          deleteFilter={this.deleteFilter}
          payment_packs={this.props.payment_packs}
          createFilter={this.createFilter}
          meta_activities={this.props.meta_activities}
          tags={this.props.tags}
          tag_groups={this.props.tag_groups}
          loading={this.props.loading}
          onRequestEmail={() => this.props.setOpenSendEmail(true)}
        />
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
        <SendEmailDialog
          open={this.props.openSendEmail}
          onClose={() => this.props.setOpenSendEmail(false)}
          onSubmit={async (email_template_id) => {
            const response = await sendMail(this.props.id, email_template_id);
            if (response.status === 200) {
              this.props.snackbarSuccess(this.props.t('mail.sendSuccess'));
            } else {
              this.props.snackbarError(this.props.t('mail.sendError'));
            }
          }}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          goToEmailCreate={this.props.goToEmailCreate}
        />
        <ConfigureDnsDialog
          open={false}
          onClose={() => this.props.setOpenSendEmail(false)}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withState('openSendEmail', 'setOpenSendEmail', false),
  withNamespaces(['smartList']),

  connect(
    (state, { id }) => ({
      smartlist_filters: getSmartListFilters(state, id),
      loading: state.smartList.loading || state.smartList.filter.loading,
      payment_packs: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      meta_activities: getMetaActivities(state),
      tag_groups: tagSelectors.getMemberTagGroups(state),
      tags: tagSelectors.getMemberTags(state),
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
      smart_list: getSmartList(state, id),
    }),
    {
      fetchSmartListFilters,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchTags,
      updateFilter,
      sendMail,
      snackbarSuccess,
      deleteFilter,
      smartListCreate,
      smartListUpdate,
      createFilter,
      snackbarError,
      fetchSmartListDetail,
      fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchAllActivities: fetchAllActivitiesAction,
      goToList: () => push('/smart-list/'),
      goToMember: (id) => push(`/member/${id}/`),
      goToEmailCreate: () => push('/email-template/create'),
    },
  ),
)(SmartListDetailMember);
