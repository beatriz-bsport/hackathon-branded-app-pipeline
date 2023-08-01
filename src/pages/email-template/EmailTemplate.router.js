// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

const EmailTemplateList = asyncComponent(() =>
  import('./EmailTemplateList.page'),
);
const EmailEditor = asyncComponent(() => import('./EmailTemplateEdit.page'));
const EmailTemplateCreate = asyncComponent(() =>
  import('./EmailTemplateCreate.page'),
);

export default () => {
  return (
    <Switch>
      <Route
        exact
        component={EmailTemplateCreate}
        path="/email-template/create"
      />
      <Route exact component={EmailEditor} path="/email-template/:id/edit" />
      <Route exact component={EmailTemplateList} path="/email-template/:id" />
      <Route component={EmailTemplateList} path="/email-template" />
    </Switch>
  );
};
