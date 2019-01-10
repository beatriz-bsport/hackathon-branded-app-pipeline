import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportTable from './ReportTable.component';

storiesOf('Reporting/ReportTable', module).add('default', () => {
  const report = FactoryBot.ReportConfiguration.create();
  const result = [['John', 'Doe'], ['Jenny', 'Doe']];
  return <ReportTable report={report} result={result} />;
});
