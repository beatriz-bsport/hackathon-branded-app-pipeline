import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import SubscriptionEventsInnerRouter from '#src/pages/subscription-events/SubscriptionEventsInner.router';

export default function SubscriptionEvents() {
  return (
    <Switch>
      <Route
        component={SubscriptionEventsInnerRouter}
        path="/subscription-events"
      />
      <Redirect to="/subscription-events/sigma" />
    </Switch>
  );
}
