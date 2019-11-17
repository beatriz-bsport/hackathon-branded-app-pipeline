// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import EmailTemplateList from './EmailTemplateList.page';
import EmailEditor from './EmailTemplateEdit.page';
import EmailTemplateCreate from './EmailTemplateCreate.page';

export default () => {
  return (
    <Switch>
      <Route path="/email/list/:id" component={EmailTemplateList} />
      <Route path="/email/list" component={EmailTemplateList} />
      <Route exact path="/email/edit/:id/:create" component={EmailEditor} />
      <Route exact path="/email/edit/:id" component={EmailEditor} />
      <Route exact path="/email/create/" component={EmailTemplateCreate} />
    </Switch>
  );
};
