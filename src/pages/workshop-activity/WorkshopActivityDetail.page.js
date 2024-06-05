// @flow
import React from 'react';
import Immutable from 'seamless-immutable';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import WorkshopActivityDetailPack from './WorkshopActivityDetailPack.page';
import WorkshopActivityDetailGeneral from './WorkshopActivityDetailGeneral.page';
import WorkshopActivityDetailGroup from './WorkshopActivityDetailGroup.page';

import { getWorkshops } from '../../libs/meta-activity/selectors';
import { fetchMetaActivities as fetchMetaActivitiesAction } from '../../libs/meta-activity/actions';

type Props = {
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  fetchMetaActivities: () => void,
  pageHeight: number,
};

const tabsData = Immutable([
  { label: 'tab.metaActivity.general', value: 'general' },
  { label: 'tab.metaActivity.pack', value: 'pack' },
  { label: 'tab.metaActivity.group', value: 'group' },
]);
export class WorkshopActivityDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivities();
  }

  onChange = (newTab: string) => {
    this.props.pushToTab(this.props.id, newTab);
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
            component={WorkshopActivityDetailPack}
            path="/workshop-activity/:id/pack/:packId"
          />
          <Route
            exact
            component={WorkshopActivityDetailPack}
            path="/workshop-activity/:id/pack"
          />
          <Route
            exact
            component={WorkshopActivityDetailGeneral}
            path="/workshop-activity/:id/general"
          />
          <Route
            component={WorkshopActivityDetailGroup}
            path="/workshop-activity/:id/group/:selectedOfferId?"
          />
        </Switch>
      </ContentWithAppBar>
    );
  }
}

export default compose(
  withTranslation(['metaActivity']),
  routerParamsToProps({ tab: 'tab', id: 'id:number' }),
  connect(
    (state, { id }) => ({
      workshopActivity: getWorkshops(state).find((ma) => ma.id === id),
    }),
    {
      pushToTab: (id, tab) => push(`/workshop-activity/${id}/${tab}`),
      fetchMetaActivities: fetchMetaActivitiesAction,
    },
  ),
  withTitle(({ workshopActivity }) => {
    if (workshopActivity) {
      return workshopActivity.name;
    }
    return '';
  }),
  withPageHeightHOC(),
)(WorkshopActivityDetail);
