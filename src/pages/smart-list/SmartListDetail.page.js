// @flow
import React from 'react';
import Immutable from 'seamless-immutable';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import SmartListDetailMember from './SmartListDetailMember.page';
import SmartListDetailCampaign from './SmartListDetailCampaign.page';
import SmartListDetailCampaignReport from './SmartListDetailCampaignReport.page';
import SmartListDetailStatistic from './SmartListDetailStatistic.page';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

import { getSmartList } from '../../libs/smart-list/selectors';
import { fetchSmartListDetail } from '../../libs/smart-list/actions';

type Props = {
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  fetchSmartListDetail: (id: number) => void,
  pageHeight: number,
};

const tabsData = Immutable([
  { label: 'tab.smartList.member', value: 'member' },
  { label: 'tab.smartList.campaign', value: 'campaign' },
  { label: 'tab.smartList.statistic', value: 'statistic' },
]);

export class SmartListDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSmartListDetail(this.props.id);
  }

  onChange = (newTab: string) => {
    this.props.pushToTab(this.props.id, newTab);
  };

  render() {
    const { tab, pageHeight } = this.props;
    return (
      <ContentWithAppBar
        tab={tab}
        onChange={this.onChange}
        pageHeight={pageHeight}
        tabsData={tabsData}
      >
        <Switch>
          <Route
            exact
            path="/smart-list/:id/member/"
            component={SmartListDetailMember}
          />
          <Route
            exact
            path="/smart-list/:id/campaign/:campaignId/"
            component={SmartListDetailCampaignReport}
          />
          <Route
            exact
            path="/smart-list/:id/campaign/"
            component={SmartListDetailCampaign}
          />
          <Route
            exact
            path="/smart-list/:id/statistic/"
            component={SmartListDetailStatistic}
          />
        </Switch>
      </ContentWithAppBar>
    );
  }
}

export default compose(
  withTranslation(['smartList']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  connect(
    (state, { id }) => ({
      smartlist: getSmartList(state, id),
    }),
    {
      pushToTab: (id, tab) => push(`/smart-list/${id}/${tab}`),
      fetchSmartListDetail,
    },
  ),
  withTitle(({ smartlist }) => (smartlist ? smartlist.name : '')),
  withPageHeightHOC(),
)(SmartListDetail);
