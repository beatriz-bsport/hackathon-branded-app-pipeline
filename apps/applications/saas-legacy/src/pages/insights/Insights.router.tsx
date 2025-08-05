import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router';

import withTitle from '#src/hocs/with-title.hoc';
import InsightsIndex from '#src/pages/insights/InsightsIndex.page';

type Props = {};

const InsightsRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path="/insights" component={InsightsIndex} />
      <Redirect to="/insights" />
    </Switch>
  );
};

export default compose(
  withTranslation(['insights', 'titles']),
  withTitle(({ t }) => t('titles:dashboard.insights')),
)(InsightsRouter);
