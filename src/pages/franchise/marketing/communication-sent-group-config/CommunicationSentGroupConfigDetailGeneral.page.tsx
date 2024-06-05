import React from 'react';
import { compose } from 'recompose';
import { LinearProgress } from '@material-ui/core';
import { ConnectedProps, connect } from 'react-redux';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import type { SendGroupedCommunicationData } from '#libs/communication/types';
import { getAllFranchiseCompanies } from '#libs/franchise/selectors';
import { fetchAllSmartLists as fetchAllSmartListsAction } from '#libs/smart-list/actions';
import { getAllSmartList } from '#libs/smart-list/selectors';
import CommunicationSentGroupConfigCommunicationDrawer from '#libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigCommunicationDrawer';
import {
  emailTemplateDetail as emailTemplateDetailAction,
  emailTemplatesSummaries as emailTemplatesSummariesAction,
} from '#libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import {
  sendGroupedCommunication as sendGroupedCommunicationAction,
  updateCommunicationSentGroupConfig as updateCommunicationSentGroupConfigAction,
  fetchMembersDataTableListExport as fetchMembersDataTableListExportAction,
  fetchMembersDataTableListExportLink as fetchMembersDataTableListExportLinkAction,
} from '#libs/communication/actions';

import { getCommunicationSentGroupConfig } from '#libs/communication/selectors';
import type { FranchiseCompany } from '#libs/franchise/types';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import CommunicationSentGroupConfigDetailGeneralPanel from '#libs/communication/components/communication-sent-group-config/CommunicationSentGroupConfigDetailGeneralPanel.component';
import type { OptionCallback } from '../../../../state/types';
import type { RootState } from '../../../../reducers';

type OwnProps = { campaignId: number };

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps;

type State = { isEmailDrawerOpen: boolean; isCampaignExporting: boolean };

export class CommunicationSentGroupConfigDetailGeneral extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEmailDrawerOpen: false,
      isCampaignExporting: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllSmartLists();
    this.props.fetchResolvedGenericTags();
  }

  handleEmailDrawerClose = () => this.setState({ isEmailDrawerOpen: false });

  handleEmailDrawerOpen = () => this.setState({ isEmailDrawerOpen: true });

  generateExportLink = () => {
    this.setState({ isCampaignExporting: true });
    this.props.fetchMembersDataTableListExport(this.props.campaignId, {
      onBackgroundSuccess: () => {
        this.props.fetchMembersDataTableListExportLink(this.props.campaignId, {
          onSuccess: (campaignXlsxExportLink) => {
            window.open(campaignXlsxExportLink);
            this.setState({ isCampaignExporting: false });
          },
          onError: () => this.setState({ isCampaignExporting: false }),
        });
      },
      onBackgroundError: () => {
        this.setState({ isCampaignExporting: false });
      },
      onError: () => this.setState({ isCampaignExporting: false }),
    });
  };

  sendGroupedCommunication = (
    data: SendGroupedCommunicationData,
    options?: OptionCallback,
  ) =>
    this.props.sendGroupedCommunication(data, {
      onSuccess: () => {
        options?.onSuccess && options.onSuccess();
        this.setState({ isEmailDrawerOpen: false });
      },
      onError: () => {
        options?.onError && options.onError();
      },
    });

  render() {
    const {
      companies,
      smartLists,
      smartListsLoading,
      emailTemplatesList,
      emailTemplatesListLoading,
      emailTemplateDetails,
      emailTemplateDetailLoading,
      fetchEmailTemplatesSummaries,
      fetchEmailTemplateDetail,
      updateCommunicationSentGroupConfig,
      campaignId,
      communicationSentGroupConfigSelected,
      loading,
      resolvedGenericTags,
      franchisorCustomDomain,
    } = this.props;

    if (smartListsLoading || loading) {
      return <LinearProgress />;
    }

    return (
      <div>
        <CommunicationSentGroupConfigDetailGeneralPanel
          campaignId={campaignId}
          communicationSentGroupConfigSelected={
            communicationSentGroupConfigSelected
          }
          companies={companies as FranchiseCompany[]}
          generateExportLink={this.generateExportLink}
          handleEmailDrawerOpen={this.handleEmailDrawerOpen}
          isCampaignExporting={this.state.isCampaignExporting}
          smartLists={smartLists}
          updateCommunicationSentGroupConfig={
            updateCommunicationSentGroupConfig
          }
        />
        {this.state.isEmailDrawerOpen && (
          <CommunicationSentGroupConfigCommunicationDrawer
            communicationSentGroupConfigId={campaignId}
            companies={companies as FranchiseCompany[]}
            emailTemplateDetailLoading={emailTemplateDetailLoading}
            emailTemplateDetails={emailTemplateDetails}
            emailTemplatesList={emailTemplatesList}
            emailTemplatesListLoading={emailTemplatesListLoading}
            fetchEmailTemplateDetail={fetchEmailTemplateDetail}
            fetchEmailTemplatesSummaries={fetchEmailTemplatesSummaries}
            franchisorCustomDomain={franchisorCustomDomain}
            isEmailDrawerOpen={this.state.isEmailDrawerOpen}
            onCancel={this.handleEmailDrawerClose}
            onSubmit={this.sendGroupedCommunication}
            resolvedGenericTags={resolvedGenericTags}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { campaignId }: { campaignId: number },
) => ({
  companies: getAllFranchiseCompanies(state),
  communicationSentGroupConfigSelected: getCommunicationSentGroupConfig(
    state,
    campaignId,
  ),
  loading:
    state.communicationSentGroupConfig.communicationSentGroupConfig.loading,
  smartLists: getAllSmartList(state),
  smartListsLoading: state.smartList.loading,
  emailTemplatesList: getAllEmailTemplatesSummaries(state),
  emailTemplatesListLoading: state.emailTemplate.loading,
  emailTemplateDetails: getEmailTemplatesDetail(state),
  emailTemplateDetailLoading: state.emailTemplate.detail.loading,
  resolvedGenericTags: getResolvedGenericTags(state),
  franchisorCustomDomain: state.franchise.franchisor.marketing_custom_domain,
});

const mapDispatchToProps = {
  fetchAllSmartLists: fetchAllSmartListsAction,
  fetchEmailTemplatesSummaries: () => emailTemplatesSummariesAction(),
  fetchEmailTemplateDetail: (id: number) => emailTemplateDetailAction(id),
  updateCommunicationSentGroupConfig: updateCommunicationSentGroupConfigAction,
  sendGroupedCommunication: sendGroupedCommunicationAction,
  fetchMembersDataTableListExport: fetchMembersDataTableListExportAction,
  fetchMembersDataTableListExportLink:
    fetchMembersDataTableListExportLinkAction,
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  routerParamsToProps({ campaignId: 'campaignId:number' }),
  connector,
)(CommunicationSentGroupConfigDetailGeneral);
