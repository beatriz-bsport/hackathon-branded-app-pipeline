import React from 'react';
import Immutable from 'seamless-immutable';

import { storiesOf } from '../../../stories';

import CoachSelector from './CoachSelector.component';

const COACHES = Immutable([
  {
    id: 0,
    user: {
      name: 'John Doe',
    },
  },
  {
    id: 1,
    user: {
      name: 'Sarah Joey',
    },
  },
]);

storiesOf('Coach/Selector', module)
  .add('default', () => {
    return <CoachSelector coaches={COACHES} selectOption={console.log} />;
  })
  .add('controlled', () => {
    return (
      <CoachSelector
        coaches={COACHES}
        selectOption={console.log}
        selectedCoaches={COACHES}
      />
    );
  });
