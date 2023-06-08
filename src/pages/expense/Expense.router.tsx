// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router';

import ExpenseList from './ExpenseList.page';

export default () => (
  <Switch>
    <Route exact path="/expense" component={ExpenseList} />
    <Route exact path="/expense/:expenseId" component={ExpenseList} />
  </Switch>
);
