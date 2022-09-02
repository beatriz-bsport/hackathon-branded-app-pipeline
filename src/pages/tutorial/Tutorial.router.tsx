import React from 'react';
import { Route, Switch } from 'react-router';

import TutorialLessonDetail from './TutorialLessonDetail.page';
import TutorialMenu from './TutorialMenu.page';
import Config from '../../config';

export default () =>
  Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
    <Switch>
      <Route
        path="/tutorial/:sectionId/:lessonId"
        component={TutorialLessonDetail}
      />
      <Route
        path="/tutorial/:defaultSelectedSectionId?"
        component={TutorialMenu}
      />
    </Switch>
  );
