import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportCategorySelector from './ReportCategorySelector.component';

storiesOf('Reporting/ReportCategorySelector', module).add('default', () => {
  return <ReportCategorySelector onSelect={action('onSelect')} />;
});
