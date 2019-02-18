// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import MemberList from './MemberList.page';
import MemberForm from './MemberForm.page';
import MemberDetail from './MemberDetail.page';

export default () => (
  <Switch>
    <Route exact path="/member" component={MemberList} />
    <Route exact path="/member/edit/:id" component={MemberForm} />
    <Route path="/member/add" component={MemberForm} />
    <Route path="/member/:id" component={MemberDetail} />
  </Switch>
);
