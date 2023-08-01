// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { withTranslation, TFunction } from 'react-i18next';

import { compose } from 'recompose';
import asyncComponent from '../../AsyncComponent';

// probably overengineered to implement code splitting here
// however we want to speed-up the detail page as much as possible:
// it can be opened in a new tab by other page so it needs to be
// lightweight
const MemberList = asyncComponent(() => import('./MemberList.page'));
const MemberForm = asyncComponent(() => import('./MemberForm.page'));
const MemberDetail = asyncComponent(() => import('./MemberDetail.page'));
const MemberMergeForm = asyncComponent(() => import('./MemberMergeForm.page'));

const getLink = (str) => {
  if (str.endsWith('/')) {
    return <Redirect to={`${str}info`} />;
  }
  return <Redirect to={`${str}/info`} />;
};

export const MemberRouter = (props: { t: TFunction }) => (
  <>
    <Helmet>
      <title>{props.t('member.members')}</title>
    </Helmet>
    <Switch>
      <Route exact component={MemberList} path="/member" />
      <Route exact component={MemberForm} path="/member/edit/:id" />
      <Route component={MemberForm} path="/member/add" />
      <Route component={MemberMergeForm} path="/member/merge/:src/into/:dst/" />
      <Route component={MemberDetail} path="/member/:id/:tab" />
      <Route
        exact
        component={() => getLink(window.location.pathname)}
        path="/member/:id/"
      />
    </Switch>
  </>
);

export default compose(withTranslation('titles'))(MemberRouter);
