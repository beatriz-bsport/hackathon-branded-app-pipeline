import React from 'react';
import Immutable from 'seamless-immutable';

import FactoryBot from '../../../../factories';
import { storiesOf } from '../../../stories';

import SCTSelector from './SCTSelector.component';

storiesOf('Category/SCT selector', module)
  .add('uncontrolled', () => {
    const SCTs = Immutable(FactoryBot.SCT.create(4));
    return <SCTSelector scts={SCTs} noMulti />;
  })
  .add('controlled', () => {
    const SCTs = Immutable(FactoryBot.SCT.create(4));
    return <SCTSelector scts={SCTs} value={SCTs[0].id} noMulti />;
  });
