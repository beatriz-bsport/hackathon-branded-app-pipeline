// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import EmailTemplateList from './EmailTemplateList.page';
import EmailEditor from './EmailTemplateEdit.page';
import EmailTemplateCreate from './EmailTemplateCreate.page';

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
