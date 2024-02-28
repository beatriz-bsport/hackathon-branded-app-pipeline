import React from 'react';
import Immutable from 'seamless-immutable';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { RootState } from '../../../../reducers';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import withTitle from '#hocs/with-title.hoc';
import CommunicationSentGroupConfigDetailGeneral from './CommunicationSentGroupConfigDetailGeneral.page';
import { getCommunicationSentGroupConfig } from '#libs/communication/selectors';
import { fetchCommunicationSentGroupConfigDetail as fetchCommunicationSentGroupConfigDetailAction } from '#libs/communication/actions';
import CommunicationSentGroupConfigDetailHistory from './CommunicationSentGroupConfigDetailHistory.page';
import { CommunicationSentGroupConfig } from '#libs/communication/types';
import CommunicationSentGroupConfigDetailReport from './CommunicationSentGroupConfigDetailReport.page';

type Props = {
  pushToTab: (id: number, tab: string) => void;
  tab: string;
  campaignId: number;
  fetchCommunicationSentGroupConfigDetail: (id: number) => void;
  pageHeight: number;
  communicationSentGroupConfig: CommunicationSentGroupConfig;
};

const tabsData = Immutable([
  { label: 'tab.communicationSentGroupConfig.general', value: 'general' },
  { label: 'tab.communicationSentGroupConfig.campaigns', value: 'history' },
]);

export class CommunicationSentGroupConfigDetail extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchCommunicationSentGroupConfigDetail(this.props.campaignId);
  }

  onChange = (newTab: string) => {
    this.props.pushToTab(this.props.campaignId, newTab);
  };

  render() {
    const { tab, pageHeight } = this.props;
    return (
      <ContentWithAppBar
        onChange={this.onChange}
        pageHeight={pageHeight}
        tab={tab}
        tabsData={tabsData}
      >
        <Switch>
          <Route
            exact
            component={CommunicationSentGroupConfigDetailGeneral}
            path="/f/marketing/campaign/:campaignId/general/"
          />
          <Route
            exact
            component={CommunicationSentGroupConfigDetailReport}
            path="/f/marketing/campaign/:campaignId/history/report/:communicationSentGroupId"
          />
          <Route
            exact
            component={CommunicationSentGroupConfigDetailHistory}
            path="/f/marketing/campaign/:campaignId/history"
          />
        </Switch>
      </ContentWithAppBar>
    );
  }
}

export default compose(
  withTranslation(['campaign']),
  routerParamsToProps({ tab: 'tab:string', campaignId: 'campaignId:number' }),
  connect(
    (state: RootState, { campaignId }: { campaignId: number }) => ({
      communicationSentGroupConfig: getCommunicationSentGroupConfig(
        state,
        campaignId,
      ),
    }),
    {
      pushToTab: (campaignId: string, tab: string) =>
        push(`/f/marketing/campaign/${campaignId}/${tab}`),
      fetchCommunicationSentGroupConfigDetail:
        fetchCommunicationSentGroupConfigDetailAction,
    },
  ),
  withTitle(({ communicationSentGroupConfig }) =>
    communicationSentGroupConfig ? communicationSentGroupConfig.name : '',
  ),
  withPageHeightHOC(),
)(CommunicationSentGroupConfigDetail);
