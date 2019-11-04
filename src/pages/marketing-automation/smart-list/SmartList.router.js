// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import SmartListList from './SmartListList.page';
import SmartListEdit from './SmartListEdit.page';

export default () => {
  return (
    <Switch>
      <Route exact path="/smart-list/:id" component={SmartListList} />
      <Route path="/smart-list/:id/detail" component={SmartListEdit} />
    </Switch>
  );
};
