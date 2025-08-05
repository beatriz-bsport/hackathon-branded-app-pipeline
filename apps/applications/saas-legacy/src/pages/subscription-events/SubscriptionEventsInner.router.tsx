import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import SubscriptionEvents from '#src/pages/subscription-events/SubscriptionEvents.page';

type Props = {};

const SubscriptionEventsInnerRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        path="/subscription-events/sigma"
        render={() => <SubscriptionEvents biTool="sigma" />}
      />
      <Redirect to="/subscription-events/sigma" />
    </Switch>
  );
};

export default compose(
  withTranslation(['subscription-events', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.subscriptionEvents')),
)(SubscriptionEventsInnerRouter);
