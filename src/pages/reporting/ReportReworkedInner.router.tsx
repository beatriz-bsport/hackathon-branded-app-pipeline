import React, { useCallback } from 'react';
import Immutable from 'seamless-immutable';
import { withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push as pushFunc } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';

import withPageHeightHOC from '#src/hocs/with-page-height.hoc';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import withTitle from '#src/hocs/with-title.hoc';

import ContentWithAppBar from '#src/components/generic-appbar-content/ContentWithAppBar.component';
import ReportingDashboard from '#src/pages/reporting/ReportingDashboard.page';
import ReportingViewDashboard from '#src/pages/reporting/ReportingViewDashboard.page';

type TabType = 'categories' | 'views';

type Props = {
  tab: TabType;
  pageHeight: number;
} & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'report:tab.reporting.categories', value: 'categories' },
  { label: 'report:tab.reporting.views', value: 'views' },
]);

const ReportReworkedInnerRouter: React.FC<Props> = ({
  pageHeight,
  tab,
  push,
}) => {
  const onChange = useCallback(
    (newTab: string) => {
      push(newTab);
    },
    [push],
  );

  return (
    <ContentWithAppBar
      onChange={onChange}
      pageHeight={pageHeight}
      tab={tab}
      tabsData={tabsData}
    >
      <Switch>
        <Route
          exact
          component={ReportingDashboard}
          path="/reporting/categories"
        />
        <Route
          exact
          component={ReportingViewDashboard}
          path="/reporting/views"
        />
        <Redirect to="/reporting/categories" />
      </Switch>
    </ContentWithAppBar>
  );
};

const connector = connect(() => ({}), {
  push: pushFunc,
});

export default compose(
  connector,
  routerParamsToProps({
    tab: 'tab:string',
  }),
  withTranslation(['report', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.reportingDashboard')),
  withPageHeightHOC(),
)(ReportReworkedInnerRouter);
