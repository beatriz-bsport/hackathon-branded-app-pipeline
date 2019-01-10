import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportColumnSelector from './ReportColumnSelector.component';

storiesOf('Reporting/ReportColumnSelector', module).add('default', () => {
  const columns = [
    {
      identifier: 'identifier',
      name: 'Identifier',
      datatype: 'number',
    },
    {
      identifier: 'first_name',
      name: 'First name',
      datatype: 'string',
    },
    {
      identifier: 'last_name',
      name: 'Last name',
      datatype: 'string',
    },
    {
      identifier: 'email',
      name: 'Email',
      datatype: 'string',
    },
  ];
  return (
    <ReportColumnSelector
      columns={columns}
      value={['first_name', 'last_name']}
      onChange={action('onChange')}
    />
  );
});
