import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportList from './ReportList.component';

storiesOf('Reporting/ReportList', module).add('default', () => {
  const configurations = FactoryBot.ReportConfiguration.create(6);
  return <ReportList items={configurations} />;
});
