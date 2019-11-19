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
        path="/email-template/create"
        component={EmailTemplateCreate}
      />
      <Route exact path="/email-template/:id/edit" component={EmailEditor} />
      <Route exact path="/email-template/:id" component={EmailTemplateList} />
      <Route path="/email-template" component={EmailTemplateList} />
    </Switch>
  );
};
