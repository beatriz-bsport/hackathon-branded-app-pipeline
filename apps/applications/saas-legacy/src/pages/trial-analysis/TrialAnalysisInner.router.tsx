import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import TrialAnalysis from '#src/pages/trial-analysis/TrialAnalysis.page';

type Props = {};

const TrialAnalysisInnerRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route
        exact
        path="/trial-analysis/franchise/omni"
        render={() => <TrialAnalysis biTool="omni" level="franchise" />}
      />
      <Route
        exact
        path="/trial-analysis/company/omni"
        render={() => <TrialAnalysis biTool="omni" level="company" />}
      />
      <Route
        exact
        path="/trial-analysis/franchise/sigma"
        render={() => <TrialAnalysis biTool="sigma" level="franchise" />}
      />
      <Redirect to="/trial-analysis/franchise/omni" />
    </Switch>
  );
};

export default compose(
  withTranslation(['trial-analysis', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.trialAnalysis')),
)(TrialAnalysisInnerRouter);
