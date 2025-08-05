import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import TrialAnalysisInnerRouter from '#src/pages/trial-analysis/TrialAnalysisInner.router';

export default function TrialAnalysis() {
  return (
    <Switch>
      <Route component={TrialAnalysisInnerRouter} path="/trial-analysis" />
      <Redirect to="/trial-analysis/franchise/sigma" />
    </Switch>
  );
}
