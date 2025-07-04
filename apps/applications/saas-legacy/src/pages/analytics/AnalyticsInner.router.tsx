import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import AnalyticsOverview from '#src/pages/analytics/AnalyticsOverview.page';

type Props = {};

const AnalyticsInnerRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact component={AnalyticsOverview} path="/analytics/overview" />
      <Redirect to="/analytics/overview" />
    </Switch>
  );
};

export default compose(
  withTranslation(['analytics', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.analytics')),
)(AnalyticsInnerRouter);
