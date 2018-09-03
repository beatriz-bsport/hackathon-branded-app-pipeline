import React from 'react';

import { Switch, Route } from 'react-router-dom';
import LoginChoice from './LoginChoice.component';
import LoginPro from './LoginPro.component';
import LoginConsumer from './LoginConsumer.component';

export default function LoginRouter() {
  return (
    <Switch>
      <Route path="/login/pro" component={LoginPro} />
      <Route path="/login/consumer" component={LoginConsumer} />
      <Route path="/login" component={LoginChoice} />
    </Switch>
  );
}
