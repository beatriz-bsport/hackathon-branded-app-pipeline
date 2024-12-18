import React from 'react';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { WithStyles } from '@material-ui/core';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import {
  getCommunicationGroupRecipientPaginationData,
  getCommunicationSentGroup,
  getCommunicationSentGroupReport,
  getRecipientListByCommunicationSentGroup,
} from '#src/libs/communication/selectors';
import { CampaignReport } from '#src/libs/communication/components/CampaignReport.component';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import type { Recipient } from '#src/libs/communication/types';
import {
  fetchCommunicationSentGroupDetails as fetchCommunicationSentGroupDetailsAction,
  fetchRecipientListByCommunicationSentGroup as fetchRecipientListByCommunicationSentGroupAction,
  fetchReportByCommunicationSentGroup as fetchReportByCommunicationSentGroupAction,
  fetchCommunicationSentGroupRecipientListExport as fetchCommunicationSentGroupRecipientListExportAction,
  fetchCommunicationSentGroupRecipientListExportLink as fetchCommunicationSentGroupRecipientListExportLinkAction,
} from '#src/libs/communication/actions';
import { RootState } from '../../../../reducers';
import BackofficeLinearProgress from '../../../../components/navigation/BackofficeLinearProgress.component';
import { OptionCallback, PaginatedResponse } from '../../../../state/types';
import { WithHandlerType } from '../../../../utils/types';

// eslint-disable-next-line react/no-unused-prop-types
type OwnProps = { communicationSentGroupId: number; campaignId: number };

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles;

export class CommunicationSentGroupConfigDetailReport extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchCommunicationSentGroupDetails();
    this.props.fetchReportByCommunicationSentGroup();
    this.props.fetchRecipientList(1, { ordering: '' });
    this.props.fetchResolvedGenericTags();
  }

  generateExportLink = (options?: OptionCallback<string>) => {
    this.props.fetchCommunicationSentGroupRecipientListExport(
      this.props.communicationSentGroupId,
      {
        onBackgroundSuccess: () => {
          this.props.fetchCommunicationSentGroupRecipientListExportLink(
            this.props.communicationSentGroupId,
            options,
          );
        },
        onBackgroundError: () => {
          options?.onError?.();
        },
        onError: () => options?.onError?.(),
      },
    );
  };

  render() {
    if (!this.props.communicationSentGroup) {
      return <BackofficeLinearProgress />;
    }

    return (
      <CampaignReport
        campaign={this.props.communicationSentGroup}
        fetchRecipientList={this.props.fetchRecipientList}
        generateExportLink={this.generateExportLink}
        goBack={this.props.goBack}
        recipientList={this.props.recipientList}
        recipientState={this.props.recipientState}
        report={this.props.communicationSentGroupReport}
        resolvedGenericTags={this.props.resolvedGenericTags}
      />
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { communicationSentGroupId }: { communicationSentGroupId: number },
) => ({
  recipientList: getRecipientListByCommunicationSentGroup(state),
  recipientState: getCommunicationGroupRecipientPaginationData(state),
  communicationSentGroup: getCommunicationSentGroup(
    state,
    communicationSentGroupId,
  ),
  communicationSentGroupReport: getCommunicationSentGroupReport(state),
  reportLoading:
    state.communicationSentGroupConfig.communicationSentGroup.report.loading,
  resolvedGenericTags: getResolvedGenericTags(state),
});

const mapDispatchToProps = {
  goBack,
  fetchCommunicationSentGroupDetailsAction,
  fetchRecipientListAction: fetchRecipientListByCommunicationSentGroupAction,
  fetchReportByCommunicationSentGroupAction,
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
  fetchCommunicationSentGroupRecipientListExport:
    fetchCommunicationSentGroupRecipientListExportAction,
  fetchCommunicationSentGroupRecipientListExportLink:
    fetchCommunicationSentGroupRecipientListExportLinkAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const mapWithHandlers = {
  fetchRecipientList:
    (props: OwnAndConnectedProps) =>
    (
      page: number,
      params: { ordering: string },
      options?: OptionCallback<PaginatedResponse<Recipient>>,
    ) => {
      props.fetchRecipientListAction(
        {
          page,
          communication_sent_group_id: props.communicationSentGroupId,
          params,
        },
        options,
      );
    },

  fetchReportByCommunicationSentGroup: (props: OwnAndConnectedProps) => () => {
    props.fetchReportByCommunicationSentGroupAction(
      props.communicationSentGroupId,
    );
  },

  fetchCommunicationSentGroupDetails: (props: OwnAndConnectedProps) => () => {
    props.fetchCommunicationSentGroupDetailsAction(
      props.communicationSentGroupId,
    );
  },
};

export default compose(
  routerParamsToProps({
    campaignId: 'campaignId:number',
    communicationSentGroupId: 'communicationSentGroupId:number',
  }),
  connector,
  withHandlers(mapWithHandlers),
)(CommunicationSentGroupConfigDetailReport);
