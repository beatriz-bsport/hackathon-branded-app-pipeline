import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import SubscriptionEventsOverview from '#src/pages/subscription-events/SubscriptionEventsOverview.page';

type Props = {};

const SubscriptionEventsInnerRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        component={SubscriptionEventsOverview}
        path="/subscription-events/overview"
      />
      <Redirect to="/subscription-events/overview" />
    </Switch>
  );
};

export default compose(
  withTranslation(['subscription-events', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.subscriptionEvents')),
)(SubscriptionEventsInnerRouter);
