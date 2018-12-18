import React from 'react';

import { action } from '@storybook/addon-actions';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportGeneration from './ReportGeneration.component';

const report = FactoryBot.ReportConfiguration.create();

storiesOf('Reporting/Pages/ReportGeneration', module)
  .add('loading', () => {
    return <ReportGeneration report={report} />;
  })
  .add('loaded', () => {
    const result = [['John', 'Doe'], ['Jenny', 'Doe']];
    return (
      <ReportGeneration report={report} result={result} resultLoading={false} />
    );
  });
