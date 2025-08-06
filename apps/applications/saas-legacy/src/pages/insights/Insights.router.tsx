import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import InsightsIndex from '#src/pages/insights/InsightsIndex.page';
import TrialAnalysis from '#src/pages/trial-analysis/TrialAnalysis.page';
import SubscriptionEvents from '#src/pages/subscription-events/SubscriptionEvents.page';

type Props = {};

const InsightsRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/insights" component={InsightsIndex} />
      <Route
        exact
        path="/insights/trial_analysis"
        render={() => <TrialAnalysis level="company" />}
      />
      <Route
        exact
        path="/insights/recurring_revenue"
        render={() => <SubscriptionEvents />}
      />
      <Redirect to="/insights" />
    </Switch>
  );
};

export default compose(
  withTranslation([
    'insights',
    'titles',
    'trial-analysis',
    'subscription-events',
  ]),
  withTitle(({ t }) => t('titles:dashboard.insights')),
)(InsightsRouter);
