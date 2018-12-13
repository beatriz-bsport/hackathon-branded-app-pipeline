import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportConfigurationForm from './ReportConfigurationForm.component';

storiesOf('Reporting/ReportConfigurationForm', module).add('default', () => {
  return <ReportConfigurationForm onSubmit={action('onSubmit')} />;
});
