// @flow
import React from 'react';
import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import namespaces from '../../i18n/namespaces.json';

import CompanyExternalAddMember from './CompanyExternalAddMember.page';

const GoBackComponent = connect(null, { goBack })(
  (props: { goBack: () => void }) => {
    props.goBack();
    return <div />;
  },
);

export const CompanyExternalRouter = () => (
  <Switch>
    <Route component={CompanyExternalAddMember} path="/external/:companyId/" />
    <Route component={GoBackComponent} path="/external/" />
  </Switch>
);

export default withTranslation(namespaces)(CompanyExternalRouter);
