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
import FranchiseReportList from '#src/pages/franchise/reporting/FranchiseReportCategoryDashboard.page';
import FranchiseReportViewDashboard from '#src/pages/franchise/reporting/FranchiseReportViewDashboard.page';

type TabType = 'categories' | 'views';

type Props = {
  tab: TabType;
  pageHeight: number;
} & ConnectedProps<typeof connector>;

const tabsData = Immutable([
  { label: 'tab.reporting.categories', value: 'categories' },
  { label: 'tab.reporting.views', value: 'views' },
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
          component={FranchiseReportList}
          path="/f/reporting/categories"
        />
        <Route
          exact
          component={FranchiseReportViewDashboard}
          path="/f/reporting/views"
        />
        <Redirect to="/f/reporting/categories" />
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
  withTranslation(['reporting', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.reportingDashboard')),
  withPageHeightHOC(),
)(ReportReworkedInnerRouter);
