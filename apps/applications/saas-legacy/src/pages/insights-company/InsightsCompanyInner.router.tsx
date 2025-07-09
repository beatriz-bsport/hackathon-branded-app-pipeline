import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import InsightsCompanyOverview from '#src/pages/insights-company/InsightsCompanyOverview.page';

type Props = {};

const InsightsCompanyInnerRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        component={InsightsCompanyOverview}
        path="/insights-company/overview"
      />
      <Redirect to="/insights-company/overview" />
    </Switch>
  );
};

export default compose(
  withTranslation(['insights-company', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.insightsCompany')),
)(InsightsCompanyInnerRouter);
