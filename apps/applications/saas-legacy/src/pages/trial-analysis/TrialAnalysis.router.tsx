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
      <Route exact path="/trial-analysis" component={TrialAnalysis} />
      <Redirect to="/trial-analysis" />
    </Switch>
  );
};

export default compose(
  withTranslation(['trial-analysis', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.trialAnalysis')),
)(TrialAnalysisRouter);
