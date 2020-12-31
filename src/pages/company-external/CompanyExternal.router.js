// @flow
import React from 'react';
import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import CompanyExternalAddMember from './CompanyExternalAddMember.page';

const GoBackComponent = connect(null, { goBack })(
  (props: { goBack: () => void }) => {
    props.goBack();
    return <div />;
  },
);

export const CompanyExternalRouter = () => (
  <Switch>
    <Route path="/external/:companyId/" component={CompanyExternalAddMember} />
    <Route path="/external/" component={GoBackComponent} />
  </Switch>
);

export default CompanyExternalRouter;
