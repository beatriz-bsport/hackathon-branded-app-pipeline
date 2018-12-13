import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportDashboard from './ReportDashboard.component';

storiesOf('Reporting/ReportDashboard', module).add('default', () => {
  const configurations = FactoryBot.ReportConfiguration.create(6);
  return (
    <ReportDashboard
      reportConfigurations={configurations}
      upsertReportConfiguration={action('upsertReportConfiguration')}
    />
  );
});
