// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { push } from 'connected-react-router';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// import Paper from '@material-ui/core/Paper';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import IconButton from '@material-ui/core/IconButton';

// import EditIcon from '@material-ui/icons/Edit';

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
} from '../../libs/smart-list/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  smartListCreate,
  smartListUpdate,
  fetchSmartListFilters,
  updateFilter,
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
import {
  fetchMetaActivityBulk,
  fetchCompanyActivities as fetchAllActivitiesAction,
} from '../../libs/meta-activity/actions';
import { fetchTags } from '../../libs/tag/actions';
import tagSelectors from '../../libs/tag/selectors';

import FiltersPanel from '../../libs/smart-list/components/FiltersPanel.component';
import SendEmailDialog from '../../libs/smart-list/components/SendEmailDialog.component';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import SmartListEditDialog from '../../libs/smart-list/components/SmartListFormDialog.component';

import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import {
  emailTemplatesSummaries,
  emailTemplateDetail,
} from '../../libs/email-editor/actions';

import type { Establishment } from '../../libs/establishment/types';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import {
  fetchEstablishments,
  fetchEstablishmentBulk,
} from '../../libs/establishment/actions';

import {
  fetchAssociatedCoachesList as fetchCoaches,
  fetchCoachBulk,
} from '../../libs/associated-coach/actions';
import type { Coach } from '../../libs/associated-coach/types';

import { getCoaches } from '../../libs/associated-coach/selectors';

type Props = {
  id: number,
  t: TFunction,
  smartlist: any,
  fetchSmartListFilters: (id: number) => void,
  fetchAllPaymentPacks: () => void,
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
  establishmentLoading: boolean,
  metaActivityLoading: boolean,
  coachLoading: boolean,
  paymentPackLoading: boolean,
  fetchEstablishmentBulk: () => void,
  fetchMetaActivityBulk: () => void,
  fetchCoachBulk: () => void,
  fetchPaymentPackBulk: () => void,
  fetchCoaches: () => void,
  coaches: Array<Coach>,
  smartListUpdate: () => void,

  // statistics
  setCloseMemberTable: () => void,
  closeMemberTable: boolean,

  classes: Object,
  memberTitle: string,
};

type State = {
  onValueChangeActiveMemberFetch: boolean,
};

export class SmartListDetailMember extends Component<Props, State> {
  state = { onValueChangeActiveMemberFetch: false, openEditDialog: false };

  componentDidMount() {
    this.props.fetchSmartListFilters(this.props.id);
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

  updateSmartList = (smartlist) => {
    this.setState({ openEditDialog: false });
    this.props.smartListUpdate(this.props.smartlist.id, smartlist);
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
    };

    const fetchBulkItems = {
      meta_activities: this.props.fetchMetaActivityBulk,
      coaches: this.props.fetchCoachBulk,
      payment_packs: this.props.fetchPaymentPackBulk,
      establishments: this.props.fetchEstablishmentBulk,
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
          createFilter={this.createFilter}
          coaches={this.props.coaches}
          meta_activities={this.props.meta_activities}
          establishments={this.props.establishments}
          tags={this.props.tags}
          tag_groups={this.props.tag_groups}
          loading={this.props.loading}
          fetchItems={fetchItems}
          fetchBulkItems={fetchBulkItems}
          onRequestEmail={() => this.props.setOpenSendEmail(true)}
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
        <SendEmailDialog
          open={this.props.openSendEmail}
          onClose={() => this.props.setOpenSendEmail(false)}
          onSubmit={async (email_template_id, options) => {
            const response = await sendMail(this.props.id, email_template_id);
            setTimeout(() => {
              if (response.status === 200) {
                if (options && options.onSuccess) options.onSuccess();
                this.props.snackbarSuccess(
                  this.props.t('communication:send.success'),
                );
                // this.props.goToCampaignList(this.props.id);
              } else {
                if (options && options.onError) options.onError();
                this.props.snackbarError(
                  this.props.t('communication:send.error'),
                );
              }
            }, 3000);
          }}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emailDetailLoading={this.props.emailDetailLoading}
          goToEmailCreate={this.props.goToEmailCreate}
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
    paddingLeft: theme.spacing * 2,
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
  withTranslation(['smartList', 'member', 'communication']),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      smartlist: getSmartList(state, id),
      smartlist_filters: getSmartListFilters(state, id),
      loading: state.smartList.loading || state.smartList.filter.loading,
      payment_packs: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      meta_activities: getMetaActivities(state),
      metaActivityLoading: state.metaActivity.loading,
      establishmentLoading: state.establishment.loading,
      coachLoading: state.coach.loading,
      paymentPackLoading: state.paymentPack.loading,
      establishments: getAllEstablishments(state),
      coaches: getCoaches(state),
      tag_groups: tagSelectors.getMemberTagGroups(state),
      tags: tagSelectors.getMemberTags(state),
      email_templates_list: getAllEmailTemplatesSummaries(state),
      email_templates_details: getEmailTemplatesDetail(state),
      emailListLoading: state.emailTemplate.isLoading,
      emailDetailLoading: state.emailTemplate.detail.isLoading,
    }),
    {
      fetchSmartListFilters,
      fetchCoachBulk,
      fetchCoaches,
      fetchAllPaymentPacks,
      fetchPaymentPackBulk,
      fetchEstablishmentBulk,
      fetchPrivatePassList,
      fetchTags,
      updateFilter,
      sendMail,
      snackbarSuccess,
      fetchEstablishments,
      fetchMetaActivityBulk,
      deleteFilter,
      smartListCreate,
      smartListUpdate,
      createFilter,
      snackbarError,
      fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
      fetchEmailTemplateDetail: (id) => emailTemplateDetail(id),
      fetchAllActivities: fetchAllActivitiesAction,
      goToList: () => push('/smart-list/'),
      goToCampaignList: (id) => push(`/smart-list/${id}/campaign/`),
      goToMember: (id) => push(`/member/${id}/`),
      goToEmailCreate: () => push('/email-template/create'),
    },
  ),
)(SmartListDetailMember);
