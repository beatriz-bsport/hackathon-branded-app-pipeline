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
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import MetaActivityDetailPack from './MetaActivityDetailPack.page';
import MetaActivityDetailGeneral from './MetaActivityDetailGeneral.page';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

import { getMetaActivity } from '../../libs/meta-activity/selectors';
import { fetchMetaActivityDetails } from '../../libs/meta-activity/actions';

type Props = {
  pushToTab: (id: number, tab: string) => void,
  tab: string,
  id: number,
  fetchMetaActivityDetails: (id: number) => void,
  pageHeight: number,
};

const tabsData = Immutable([
  { label: 'tab.metaActivity.general', value: 'general' },
  { label: 'tab.metaActivity.pack', value: 'pack' },
]);

export class MetaActivityDetail extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMetaActivityDetails(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.props.fetchMetaActivityDetails(this.props.id);
    }
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
            path="/activity/:id/pack/:packId"
            component={MetaActivityDetailPack}
          />
          <Route
            exact
            path="/activity/:id/pack"
            component={MetaActivityDetailPack}
          />
          <Route
            exact
            path="/activity/:id/general"
            component={MetaActivityDetailGeneral}
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
      metaActivity: getMetaActivity(state, id),
    }),
    {
      pushToTab: (id, tab) => push(`/activity/${id}/${tab}`),
      fetchMetaActivityDetails,
    },
  ),
  withTitle(({ metaActivity }) => (metaActivity ? metaActivity.name : '')),
  withPageHeightHOC(),
)(MetaActivityDetail);
