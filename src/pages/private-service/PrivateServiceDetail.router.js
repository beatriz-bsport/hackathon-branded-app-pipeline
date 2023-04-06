// @flow

import React from 'react';
import Immutable from 'seamless-immutable';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import PrivateServiceDetail from './PrivateServiceDetail.page';
import PrivateServiceCalendar from './PrivateServiceCalendar.page';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withPageHeightHOC from '#hocs/with-page-height.hoc';
import ContentWithAppBar from '#components/generic-appbar-content/ContentWithAppBar.component';

type Props = {
  tab: string,
  pushToTab: (id: number, tab: string) => void,
  id: number,
  pageHeight: number,
};

const tabsData = Immutable([
  { label: 'tab.service.general', value: 'general' },
  { label: 'tab.service.calendar', value: 'calendar' },
]);

export class PrivateServiceRouter extends React.Component<Props> {
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
            path="/private-service/service/:id/calendar"
            component={PrivateServiceCalendar}
          />
          <Route
            path="/private-service/service/:id/general"
            component={PrivateServiceDetail}
          />
          <Route
            path="/private-service/service/:id"
            component={PrivateServiceDetail}
          />
        </Switch>
      </ContentWithAppBar>
    );
  }
}
export default compose(
  routerParamsToProps({
    tab: 'tab',
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  connect(null, {
    pushToTab: (id: number, tab: string) =>
      push(`/private-service/service/${id}/${tab}`),
  }),
  withPageHeightHOC(),
)(PrivateServiceRouter);
