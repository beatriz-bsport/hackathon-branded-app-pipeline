import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import SubscriptionEventsInnerRouter from '#src/pages/subscription-events/SubscriptionEventsInner.router';

export default function SubscriptionEvents() {
  return (
    <Switch>
      <Route
        exact
        component={SubscriptionEventsInnerRouter}
        path="/subscription-events/:tab"
      />
      <Redirect to="/subscription-events/overview" />
    </Switch>
  );
}
