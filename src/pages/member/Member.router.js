// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';

import asyncComponent from '../../AsyncComponent';

// probably overengineered to implement code splitting here
// however we want to speed-up the detail page as much as possible:
// it can be opened in a new tab by other page so it needs to be
// lightweight
const MemberList = asyncComponent(() => import('./MemberList.page'));
const MemberForm = asyncComponent(() => import('./MemberForm.page'));
const MemberDetail = asyncComponent(() => import('./MemberDetail.page'));
const MemberMergeForm = asyncComponent(() => import('./MemberMergeForm.page'));

export default () => (
  <Switch>
    <Route exact path="/member" component={MemberList} />
    <Route exact path="/member/edit/:id" component={MemberForm} />
    <Route path="/member/add" component={MemberForm} />
    <Route path="/member/merge/:src/into/:dst/" component={MemberMergeForm} />
    <Route path="/member/:id/:tab" component={MemberDetail} />
    <Route
      exact
      path="/member/:id/"
      component={() => <Redirect to={`${window.location.pathname}info`} />}
    />
  </Switch>
);
