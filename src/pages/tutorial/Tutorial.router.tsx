// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';

import TutorialLessonDetail from './TutorialLessonDetail.page';
import TutorialMenu from './TutorialMenu.page';

export default () =>
  platformTutorialActivated() && (
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
