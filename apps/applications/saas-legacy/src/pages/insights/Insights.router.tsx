import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import InsightsIndex from '#src/pages/insights/InsightsIndex.page';
import TrialAnalysis from '#src/pages/trial-analysis/TrialAnalysis.page';
import SubscriptionEvents from '#src/pages/subscription-events/SubscriptionEvents.page';
import { INSIGHTS_ROUTES, INSIGHTS_TRANSLATION_NAMESPACES } from './constants';

type Props = {};

const InsightsRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path={INSIGHTS_ROUTES.INDEX} component={InsightsIndex} />
      <Route
        exact
        path={INSIGHTS_ROUTES.TRIAL_ANALYSIS}
        component={TrialAnalysis}
      />
      <Route
        exact
        path={INSIGHTS_ROUTES.RECURRING_REVENUE}
        render={() => <SubscriptionEvents />}
      />
      <Redirect to={INSIGHTS_ROUTES.INDEX} />
    </Switch>
  );
};

export default compose(
  withTranslation(INSIGHTS_TRANSLATION_NAMESPACES),
  withTitle(({ t }) => t('titles:dashboard.insights')),
)(InsightsRouter);
