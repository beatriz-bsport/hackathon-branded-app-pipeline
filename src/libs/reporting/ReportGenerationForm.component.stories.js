import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportGenerationForm from './ReportGenerationForm.component';

storiesOf('Reporting/ReportGenerationForm', module)
  .add('default', () => {
    const reportConfiguration = FactoryBot.ReportConfiguration.create();
    return (
      <ReportGenerationForm
        reportConfiguration={reportConfiguration}
        onSubmit={action('onSubmit')}
      />
    );
  })
  .add('with export link', () => {
    const reportConfiguration = FactoryBot.ReportConfiguration.create();
    return (
      <ReportGenerationForm
        reportConfiguration={reportConfiguration}
        onSubmit={action('onSubmit')}
        exportLink={action('exportLink')}
      />
    );
  });
