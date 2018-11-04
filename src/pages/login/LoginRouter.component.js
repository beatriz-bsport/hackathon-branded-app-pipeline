import React from 'react';

import { Switch, Route } from 'react-router-dom';
import LoginChoice from './LoginChoice.component';
import LoginPro from './LoginPro.component';
import LoginConsumer from './LoginConsumer.component';
import Signout from './Signout.component';
import ResetPassword from './ResetPassword.component';

export default function LoginRouter() {
  return (
    <Switch>
      <Route path="/login/pro" component={LoginPro} />
      <Route path="/login/consumer" component={LoginConsumer} />
      <Route path="/login/reset_password" component={ResetPassword} />
      <Route path="/login/signout" component={Signout} />
      <Route path="/login" component={LoginChoice} />
    </Switch>
  );
}
