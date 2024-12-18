import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withHandlers } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { push } from 'connected-react-router';

import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { fetchCommunicationSentGroupConfigCommunicationSentGroupList as fetchCommunicationSentGroupConfigCommunicationSentGroupListAction } from '#src/libs/communication/actions';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import { getAllCommunicationSentGroup } from '#src/libs/communication/selectors';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import CampaignList from '#src/libs/communication/components/CampaignList.component';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import type { RootState } from 'src/reducers';
import type { WithHandlerType } from '#src/utils/types';
import type { CommunicationSentGroup } from '#src/libs/communication/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';

type OwnProps = {
  campaignId: number;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type Props = OwnAndConnectedProps &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles;

export class CommunicationSentGroupConfigDetailHistory extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchCommunicationSentGroupConfigCommunicationSentGroupList(1);
    this.props.fetchResolvedGenericTags();
  }

  fetchMore = () =>
    this.props.fetchCommunicationSentGroupConfigCommunicationSentGroupList(
      this.props.campaignHistoryList.next_page,
    );

  getCampaignList = () =>
    this.props.communicationSentGroupList.map((communicationSentGroup) => [
      communicationSentGroup,
      null,
    ]);

  render() {
    const {
      t,
      classes,
      campaignHistoryList,
      loading,
      goToCommunicationGroupReport,
      resolvedGenericTags,
    } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.title}>
          <Typography variant="h5">{t('historyTitle')}</Typography>
        </div>
        <Divider className={classes.divider} />
        <CampaignList
          campaignList={this.getCampaignList()}
          fetchMore={campaignHistoryList.next_page && this.fetchMore}
          loading={loading}
          onClickReport={goToCommunicationGroupReport}
          resolvedGenericTags={resolvedGenericTags}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  communicationSentGroupList: getAllCommunicationSentGroup(state),
  campaignHistoryList:
    state.communicationSentGroupConfig.communicationSentGroup,
  loading: state.communicationSentGroupConfig.communicationSentGroup.loading,
  resolvedGenericTags: getResolvedGenericTags(state),
});

const mapDispatchToProps = {
  fetchCommunicationSentGroupConfigCommunicationSentGroupListAction,
  fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
  push,
};
const connector = connect(mapStateToProps, mapDispatchToProps);

const mapWithHandlers = {
  fetchCommunicationSentGroupConfigCommunicationSentGroupList:
    (props: OwnAndConnectedProps) =>
    (
      page: number,
      options?: OptionCallback<PaginatedResponse<CommunicationSentGroup>>,
    ) =>
      props.fetchCommunicationSentGroupConfigCommunicationSentGroupListAction(
        {
          communication_sent_group_config_id: props.campaignId,
          page,
        },
        options,
      ),
  goToCommunicationGroupReport:
    (props: OwnAndConnectedProps) => (communicationGroupId: string) => {
      props.push(
        `/f/marketing/campaign/${props.campaignId}/history/report/${communicationGroupId}`,
      );
    },
};

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  routerParamsToProps({ campaignId: 'campaignId:number' }),
  withStyles(styles),
  withTranslation('campaign'),
  connector,
  withHandlers(mapWithHandlers),
)(CommunicationSentGroupConfigDetailHistory);
