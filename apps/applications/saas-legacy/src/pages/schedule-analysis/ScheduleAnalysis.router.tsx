import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import ScheduleAnalysis from '#src/pages/schedule-analysis/ScheduleAnalysis.page';

type Props = {};

const ScheduleAnalysisRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact component={ScheduleAnalysis} path="/schedule-analysis" />
      <Redirect to="/schedule-analysis" />
    </Switch>
  );
};

export default compose(
  withTranslation(['schedule-analysis', 'titles']),
  withTitle(({ t }) =>
    t('titles:dashboard.scheduleAnalysis', {
      defaultValue: 'Schedule analysis',
    }),
  ),
)(ScheduleAnalysisRouter);
