import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import ReportCategorySelector from './ReportCategorySelector.component';

storiesOf('Reporting/ReportCategorySelector', module).add('default', () => {
  const categories = ['members', 'sessions', 'sessions_detailed'];
  return (
    <ReportCategorySelector
      categories={categories}
      onSelect={action('onSelect')}
    />
  );
});
