import React from 'react';
import { Route, Switch } from 'react-router';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';

import TutorialLessonDetail from './TutorialLessonDetail.page';
import TutorialMenu from './TutorialMenu.page';

export default () =>
  platformTutorialActivated() && (
    <Switch>
      <Route
        component={TutorialLessonDetail}
        path="/tutorial/:sectionId/:lessonId"
      />
      <Route
        component={TutorialMenu}
        path="/tutorial/:defaultSelectedSectionId?"
      />
    </Switch>
  );
