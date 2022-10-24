// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { goBack, push } from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import {
  fetchCampaign,
  fetchCampaignReport,
  fetchRecipientByCampaign,
} from '../../libs/communication/actions';
import {
  getCampaign,
  getCampaignReport,
  getRecipientListByCampaign,
} from '../../libs/communication/selectors';
import CampaignReport from '../../libs/communication/components/CampaignReport.component';

import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import type {
  Campaign,
  CampaignReport as CampaignReportType,
  Recipient,
} from '../../libs/communication/types';

type Props = {
  fetchCampaign: () => void,
  fetchCampaignReport: () => void,
  fetchResolvedGenericTags: () => void,
  resolvedGenericTags: ResolvedGenericTags,
  fetchRecipientList: (page: number, params: any) => void,
  campaign: ?Campaign,
  goBack: () => void,
  recipientState: Object,
  campaignReport: CampaignReportType,
  reportLoading: boolean,
  recipientList: Array<Recipient>,
  goToMember: (id: number) => void,
};

export class SmartListDetailCampaignReport extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCampaign();
    this.props.fetchCampaignReport();
    this.props.fetchResolvedGenericTags();
  }

  render() {
    if (!this.props.campaign) {
      return <BackofficeLinearProgress />;
    }
    return (
      <CampaignReport
        campaign={this.props.campaign}
        goBack={this.props.goBack}
        fetchRecipientList={this.props.fetchRecipientList}
        recipientState={this.props.recipientState}
        recipientList={this.props.recipientList}
        report={this.props.campaignReport}
        reportLoading={this.props.reportLoading}
        goToMember={this.props.goToMember}
        resolvedGenericTags={this.props.resolvedGenericTags}
      />
    );
  }
}

export default compose(
  routerParamsToProps({ campaignId: 'campaignId' }),
  connect(
    (state, { campaignId }) => ({
      recipientState: state.communication.recipient.byCampaign,
      recipientList: getRecipientListByCampaign(state),
      campaign: getCampaign(state, campaignId),
      campaignReport: getCampaignReport(state),
      reportLoading: state.communication.campaign.report.loading,
      resolvedGenericTags: getResolvedGenericTags(state),
    }),
    (dispatch, { campaignId }) => ({
      goBack: () => dispatch(goBack()),
      goToMember: (memberId) => dispatch(push(`/member/${memberId}/info`)),
      fetchCampaign: () => dispatch(fetchCampaign(campaignId)),
      fetchCampaignReport: () => dispatch(fetchCampaignReport(campaignId)),
      fetchRecipientList: (page, params) =>
        dispatch(fetchRecipientByCampaign(campaignId, page, params)),
      fetchResolvedGenericTags: () =>
        dispatch(fetchResolvedGenericTagsAction()),
    }),
  ),
)(SmartListDetailCampaignReport);
