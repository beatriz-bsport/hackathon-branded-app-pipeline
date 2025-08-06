import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import TrialAnalysis from '#src/pages/trial-analysis/TrialAnalysis.page';

type Props = {};

const TrialAnalysisRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        path="/trial-analysis/franchise"
        render={() => <TrialAnalysis level="franchise" />}
      />
      <Route
        exact
        path="/trial-analysis/company"
        render={() => <TrialAnalysis level="company" />}
      />
      <Redirect to="/trial-analysis/franchise" />
    </Switch>
  );
};

export default compose(
  withTranslation(['trial-analysis', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.trialAnalysis')),
)(TrialAnalysisRouter);
