import React from 'react';
import { Route, Switch } from 'react-router';

import ExpenseList from './ExpenseList.page';

export default () => (
  <Switch>
    <Route exact component={ExpenseList} path="/expense" />
    <Route exact component={ExpenseList} path="/expense/:expenseId" />
  </Switch>
);
